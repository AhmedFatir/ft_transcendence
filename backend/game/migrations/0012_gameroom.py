# Generated by Django 4.2.13 on 2024-07-13 06:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_management', '0018_remove_player_id_alter_player_user'),
        ('game', '0011_alter_gamesettings_paddle'),
    ]

    operations = [
        migrations.CreateModel(
            name='GameRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_waiting', models.BooleanField(default=True)),
                ('creatred_at', models.DateTimeField(auto_now_add=True)),
                ('player1', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='user_management.player')),
                ('player2', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='user_management.player')),
            ],
        ),
    ]