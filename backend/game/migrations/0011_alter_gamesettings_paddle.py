# Generated by Django 4.2.13 on 2024-07-10 18:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0010_gamesettings_keys'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamesettings',
            name='paddle',
            field=models.CharField(max_length=255),
        ),
    ]
