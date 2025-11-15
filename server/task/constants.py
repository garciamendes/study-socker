from django.db import models


class NotificationType(models.TextChoices):
    TASK_CREATED = "TASK_CREATED", "Task Criada"
    TASK_UPDATED = "TASK_UPDATED", "Task Atualizada"
    SYSTEM = "SYSTEM", "Sistema"
    INFO = "INFO", "Informativo"
    WARNING = "WARNING", "Aviso"
    ERROR = "ERROR", "Erro"
