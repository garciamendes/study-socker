# tasks/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .consumers import get_task_with_annotations
from .models import Task, TaskLike, Notification
from .serializers import NotificationSerializer
from .serializers import NotificationCreateSerializer
from django.db import transaction

channel_layer = get_channel_layer()


@receiver(post_save, sender=Task)
def task_created(sender, instance: Task, created, **kwargs):
    if created:
        def send_event():
            async_to_sync(channel_layer.group_send)(
                "tasks",
                {
                    "type": "task.event",
                    "data": {
                        "event": "task_created",
                        "task": get_task_with_annotations(instance.uuid, instance.user)
                    }
                }
            )

        transaction.on_commit(send_event)


@receiver(post_save, sender=TaskLike)
def task_liked(sender, instance, created, **kwargs):
    if not created:
        return

    serializer = NotificationCreateSerializer(data={
        'title': 'Like na task',
        'message': f"{instance.user.first_name or instance.user.username} curtiu sua task",
        'data': {
            "task": str(instance.task.uuid),
            "task_like": str(instance.uuid),
            "liked_by": str(instance.user.profile.uuid)
        },
    })

    serializer.is_valid(raise_exception=True)
    notification = serializer.save(user=instance.task.user)

    def send_event():
        async_to_sync(channel_layer.group_send)(
            "notification",
            {
                "type": "notification.event",
                "data": {
                    "event": 'task_liked',
                    "notification": NotificationSerializer(notification).data
                },
            }
        )

    transaction.on_commit(send_event)
