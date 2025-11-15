from django.urls import re_path
from .consumers import TaskConsumer, NotificationConsumer

websocket_urlpatterns = [
    re_path(r"ws/tasks/$", TaskConsumer.as_asgi()),
    re_path(r"ws/notifications/$", NotificationConsumer.as_asgi()),
]
