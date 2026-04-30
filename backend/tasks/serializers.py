from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task
from django.utils import timezone
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TaskSerializer(serializers.ModelSerializer):
    elapsed_seconds = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'completed', 'completed_at', 'priority', 'category',
                  'due_date', 'created_at', 'timer_seconds', 'timer_running', 'elapsed_seconds']
        read_only_fields = ['created_at', 'completed_at', 'timer_seconds', 'timer_running', 'elapsed_seconds']

    def get_elapsed_seconds(self, obj):
        if obj.timer_running and obj.timer_started_at:
            delta = timezone.now() - obj.timer_started_at
            return obj.timer_seconds + int(delta.total_seconds())
        return obj.timer_seconds
