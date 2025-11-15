# tasks/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.db.models import Count, Exists, OuterRef
from .models import Task, TaskLike
from channels.db import database_sync_to_async
from typing import Dict


def get_task_with_annotations(task_uuid, user) -> Dict:
    from task.serializers import TaskListSerializer
    task = Task.objects.filter(uuid=task_uuid)\
        .annotate(
            amount_likes=Count("likes"),
            has_my_like=Exists(
                TaskLike.objects.filter(task=OuterRef("pk"), user=user)
            )
    ).first()

    return TaskListSerializer(task).data


class TaskConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("tasks", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("tasks", self.channel_name)

    async def task_event(self, event):
        await self.send_json(event['data'])


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["user"].id

        if not self.user_id:
            return await self.close()

        await self.channel_layer.group_add(
            f"user_{self.user_id}", self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f"user_{self.user_id}", self.channel_name
        )

    async def notification_event(self, event):
        await self.send_json(event["data"])
