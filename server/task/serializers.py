from rest_framework import serializers
from .models import Task, Notification, TaskLike
from account.serializers import UserMinSerializer


class TaskListSerializer(serializers.ModelSerializer):
    amount_likes = serializers.IntegerField()
    has_my_like = serializers.BooleanField()
    user = UserMinSerializer()

    class Meta:
        model = Task
        fields = [
            'uuid',
            'title',
            'finish_at',
            'user',
            'amount_likes',
            'has_my_like',
            'created_at'
        ]


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title']


class TaskLikeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskLike
        fields = ['task']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'uuid',
            'title',
            'message',
            'data',
            'type',
            'is_read',
            'read_at',
            'created_at'
        ]


class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'title',
            'message',
            'data'
        ]
