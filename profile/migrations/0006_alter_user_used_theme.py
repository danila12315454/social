# Generated by Django 4.0.4 on 2022-04-29 10:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profile', '0005_user_used_theme'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='used_theme',
            field=models.IntegerField(default='0', verbose_name='used_theme'),
        ),
    ]
