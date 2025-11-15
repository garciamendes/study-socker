from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.conf import settings


class Profile(models.Model):
    uuid = models.UUIDField(unique=True, editable=False,
                            db_index=True, default=uuid4)
    user = models.OneToOneField(
        User, related_name='profile', on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
