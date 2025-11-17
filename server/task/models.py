from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from datetime import datetime
from .constants import NotificationType


class Task(models.Model):
    uuid = models.UUIDField(unique=True, editable=False,
                            db_index=True, default=uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(blank=False, null=False)
    finish_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class TaskLike(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    task = models.ForeignKey(Task, related_name='likes',
                             on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['task', 'user']


class Notification(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )

    title = models.CharField(max_length=255)
    message = models.TextField(blank=True)
    type = models.CharField(
        max_length=30,
        choices=NotificationType.choices,
        default=NotificationType.INFO
    )

    # SQLite 100% compatível
    data = models.JSONField(blank=True, null=True)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "is_read"]),
        ]
        ordering = ("-created_at",)

    def mark_as_read(self):
        self.is_read = True
        self.read_at = datetime.now()
        self.save(update_fields=["is_read", "read_at"])

    def __str__(self):
        return f"[{self.type}] {self.title}"
