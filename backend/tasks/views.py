from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.utils import timezone
from collections import Counter
from .models import Task
from .serializers import RegisterSerializer, TaskSerializer, CustomTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    s = RegisterSerializer(data=request.data)
    if s.is_valid():
        user = s.save()
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)}, status=201)
    return Response(s.errors, status=400)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user:
        refresh = CustomTokenObtainPairSerializer.get_token(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    return Response({'error': 'Invalid credentials'}, status=400)

class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        instance = self.get_object()
        completing = serializer.validated_data.get('completed', instance.completed)
        if completing and not instance.completed:
            serializer.save(completed_at=timezone.now())
        elif not completing:
            serializer.save(completed_at=None)
        else:
            serializer.save()

@api_view(['POST'])
def timer_start(request, pk):
    task = Task.objects.filter(pk=pk, user=request.user).first()
    if not task:
        return Response(status=404)
    if not task.timer_running:
        task.timer_running = True
        task.timer_started_at = timezone.now()
        task.save()
    return Response(TaskSerializer(task).data)

@api_view(['POST'])
def timer_stop(request, pk):
    task = Task.objects.filter(pk=pk, user=request.user).first()
    if not task:
        return Response(status=404)
    if task.timer_running and task.timer_started_at:
        delta = timezone.now() - task.timer_started_at
        task.timer_seconds += int(delta.total_seconds())
        task.timer_running = False
        task.timer_started_at = None
        task.save()
    return Response(TaskSerializer(task).data)

@api_view(['GET'])
def stats(request):
    tasks = Task.objects.filter(user=request.user)
    total = tasks.count()
    completed_qs = tasks.filter(completed=True)
    completed = completed_qs.count()

    # Avg time to complete (created_at -> completed_at) in minutes
    times = [
        (t.completed_at - t.created_at).total_seconds() / 60
        for t in completed_qs if t.completed_at
    ]
    avg_minutes = round(sum(times) / len(times)) if times else 0

    # Most productive day
    days = [t.completed_at.strftime('%A') for t in completed_qs if t.completed_at]
    productive_day = Counter(days).most_common(1)[0][0] if days else 'N/A'

    # Most used category
    cats = [t.category for t in tasks]
    top_category = Counter(cats).most_common(1)[0][0] if cats else 'N/A'

    # Weekly chart — tasks created per day for last 7 days
    from datetime import date, timedelta
    today = date.today()
    weekly = []
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        weekly.append({
            'day': day.strftime('%a'),
            'created': tasks.filter(created_at__date=day).count(),
            'completed': tasks.filter(completed_at__date=day).count(),
        })

    # Monthly chart — tasks created per week for last 4 weeks
    monthly = []
    for i in range(3, -1, -1):
        start = today - timedelta(weeks=i+1)
        end = today - timedelta(weeks=i)
        monthly.append({
            'week': f'W-{4-i}',
            'created': tasks.filter(created_at__date__gte=start, created_at__date__lt=end).count(),
            'completed': tasks.filter(completed_at__date__gte=start, completed_at__date__lt=end).count(),
        })

    # Category breakdown
    category_data = [
        {'name': cat, 'count': tasks.filter(category=cat).count()}
        for cat, _ in Task.CATEGORIES
        if tasks.filter(category=cat).count() > 0
    ]

    return Response({
        'total': total,
        'completed': completed,
        'completion_rate': round((completed / total * 100), 1) if total else 0,
        'avg_completion_minutes': avg_minutes,
        'productive_day': productive_day,
        'top_category': top_category,
        'weekly': weekly,
        'monthly': monthly,
        'category_data': category_data,
    })
