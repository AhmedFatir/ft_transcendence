# Generated by Django 4.2.13 on 2024-08-15 15:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0005_gamechallenge_invite_game_room'),
    ]

    operations = [
        migrations.AddField(
            model_name='invitegameroom',
            name='player1_connected',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='invitegameroom',
            name='player2_connected',
            field=models.BooleanField(default=False),
        ),
    ]
