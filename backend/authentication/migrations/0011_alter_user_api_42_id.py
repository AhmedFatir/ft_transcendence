# Generated by Django 4.2.13 on 2024-07-13 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0010_user_api_42_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='api_42_id',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]
