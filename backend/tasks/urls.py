from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('tasks/', views.TaskListCreate.as_view()),
    path('tasks/<int:pk>/', views.TaskDetail.as_view()),
    path('tasks/<int:pk>/start/', views.timer_start),
    path('tasks/<int:pk>/stop/', views.timer_stop),
    path('stats/', views.stats),
]
