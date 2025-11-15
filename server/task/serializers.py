from rest_framework import serializers
from .models import Task
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
