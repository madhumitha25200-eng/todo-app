from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    PRIORITY = [('low', 'Low'), ('medium', 'Medium'), ('high', 'High')]
    CATEGORIES = [
        ('work', 'Work'), ('personal', 'Personal'), ('health', 'Health'),
        ('learning', 'Learning'), ('shopping', 'Shopping'), ('other', 'Other'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORIES, default='other')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    timer_seconds = models.PositiveIntegerField(default=0)
    timer_running = models.BooleanField(default=False)
    timer_started_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
