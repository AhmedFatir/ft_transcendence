# Generated by Django 4.2.13 on 2024-07-22 12:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userachievement',
            name='unlocked',
            field=models.BooleanField(default=False),
        ),
    ]