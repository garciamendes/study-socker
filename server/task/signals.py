# tasks/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .consumers import get_task_with_annotations
from .models import Task, TaskLike
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
    # Atualizar todos com a task atualizada
    async_to_sync(channel_layer.group_send)(
        "tasks",
        {
            "type": "task.event",
            "data": {
                "event": "task_updated",
                "task": instance.task.to_json()
            }
        }
    )

    # Notificar dono da task
    async_to_sync(channel_layer.group_send)(
        f"user_{instance.task.user.id}",
        {
            "type": "notification.event",
            "data": {
                "event": "task_liked",
                "task_id": instance.task.id,
                "message": f"{instance.user.username} curtiu sua task"
            }
        }
    )
