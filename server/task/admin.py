from django.contrib import admin
from .models import Task, Notification, TaskLike


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'title', 'user']


@admin.register(TaskLike)
class TaskListAdmin(admin.ModelAdmin):
    list_display = ['uuid']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['uuid', 'user', 'type']
