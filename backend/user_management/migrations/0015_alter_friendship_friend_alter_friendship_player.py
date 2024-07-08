# Generated by Django 4.2.13 on 2024-07-08 08:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user_management', '0014_remove_player_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='friendship',
            name='friend',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friends_with', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='friendship',
            name='player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='friendships', to=settings.AUTH_USER_MODEL),
        ),
    ]
