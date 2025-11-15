from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskListSerializer
from .serializers import TaskCreateSerializer
from django.db.models import Count
from django.db.models import OuterRef
from django.db.models import Exists
from .models import TaskLike
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status


class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all().order_by('-id')
    permission_classes = [IsAuthenticated]
    serializer_class = TaskListSerializer
    lookup_field = 'uuid'

    def get_queryset(self):
        queryset = super().get_queryset()

        return queryset.annotate(
            amount_likes=Count('likes'),
            has_my_like=Exists(
                TaskLike.objects.filter(task=OuterRef(
                    'pk'), user=self.request.user)
            )
        )

    def get_serializer_class(self):
        if (self.action == 'create'):
            return TaskCreateSerializer

        return super().get_serializer_class()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        return super().perform_create(serializer)

    @action(methods=['POST'], detail=True, url_path='like')
    def like(self, request, *args, **kwargs):
        instance = self.get_object()

        TaskLike.objects.create(task=instance, user=request.user)
        return Response(status=status.HTTP_200_OK)

    @action(methods=['DELETE'], detail=True, url_path='deslike')
    def deslike(self, request, *args, **kwargs):
        instance = self.get_object()

        TaskLike.objects.get(task=instance, user=request.user).delete()
        return Response(status=status.HTTP_200_OK)
