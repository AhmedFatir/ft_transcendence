# Generated by Django 4.2.13 on 2024-09-24 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0014_remove_localtournament_tournament_participants'),
    ]

    operations = [
        migrations.AlterField(
            model_name='localplayer',
            name='paddle_color',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]