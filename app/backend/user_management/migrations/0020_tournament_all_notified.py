# Generated by Django 4.2.13 on 2024-12-18 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0019_alter_localtournament_tournament_stage'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='all_notified',
            field=models.BooleanField(default=False),
        ),
    ]
