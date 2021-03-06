# Generated by Django 4.0.4 on 2022-04-26 21:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, verbose_name='name')),
                ('users', models.CharField(max_length=150, verbose_name='users')),
                ('image', models.ImageField(blank=True, upload_to='photos/chat_images', verbose_name='image')),
                ('message_ids', models.TextField(verbose_name='message_ids')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_sent', models.CharField(max_length=10, verbose_name='time_sent')),
                ('autor', models.IntegerField(verbose_name='autor')),
                ('is_read', models.BooleanField(verbose_name='is_read')),
                ('read_by', models.CharField(max_length=150, verbose_name='read_by')),
                ('text', models.CharField(max_length=1000, verbose_name='text')),
                ('image', models.ImageField(blank=True, upload_to='photos/chat_images', verbose_name='image')),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('login', models.CharField(max_length=15, verbose_name='Логин')),
                ('email', models.CharField(max_length=40, verbose_name='Почта')),
                ('password', models.CharField(max_length=30, verbose_name='Пароль')),
                ('name', models.CharField(max_length=30, verbose_name='Имя')),
                ('description', models.CharField(max_length=300, verbose_name='Описание')),
                ('chat_ids', models.CharField(max_length=300)),
                ('followers', models.IntegerField()),
                ('followed', models.IntegerField()),
                ('profile_photo', models.ImageField(blank=True, upload_to='photos/profile_photos', verbose_name='Фото аккаунта')),
            ],
        ),
    ]
