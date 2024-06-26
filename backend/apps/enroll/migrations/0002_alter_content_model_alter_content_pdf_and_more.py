# Generated by Django 4.1.4 on 2022-12-15 20:42

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('enroll', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='content',
            name='model',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, null=True, size=None, verbose_name='作品模型'),
        ),
        migrations.AlterField(
            model_name='content',
            name='pdf',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, null=True, size=None, verbose_name='作品pdf'),
        ),
        migrations.AlterField(
            model_name='content',
            name='slide',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, null=True, size=None, verbose_name='作品ppt'),
        ),
        migrations.AlterField(
            model_name='content',
            name='video',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, null=True, size=None, verbose_name='作品视频'),
        ),
    ]
