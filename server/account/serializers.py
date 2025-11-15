from rest_framework import serializers
from django.contrib.auth.models import User


class UserMinSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(source='profile.uuid')

    class Meta:
        model = User
        fields = ['uuid', 'first_name', 'username']
