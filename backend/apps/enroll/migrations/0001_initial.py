'''
Author: shaojinxin shaojinxin@citorytech.com
Date: 2022-12-19 12:42:55
LastEditors: shaojinxin shaojinxin@citorytech.com
LastEditTime: 2022-12-19 16:15:44
FilePath: /metaweb_backend/apps/enroll/migrations/0001_initial.py
Description: 

Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
'''
# Generated by Django 4.1.4 on 2022-12-15 19:50

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='作品类别')),
            ],
        ),
        migrations.CreateModel(
            name='group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='小组名称')),
                ('member', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=128), blank=True, size=None, verbose_name='组员')),
            ],
        ),
        migrations.CreateModel(
            name='occupation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='职业名称')),
            ],
        ),
        migrations.CreateModel(
            name='tags',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='作品标签')),
            ],
        ),
        migrations.CreateModel(
            name='product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='作品名称')),
                ('regional', models.CharField(max_length=32, verbose_name='创作地点')),
                ('point', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=2, verbose_name='创作地点经纬度')),
                ('tags', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=32), blank=True, size=None, verbose_name='标签(数组)')),
                ('description', models.TextField(blank=True, verbose_name='作品描述')),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='enroll.category', verbose_name='作品类别')),
                ('group', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='enroll.group', verbose_name='小组')),
            ],
        ),
        migrations.CreateModel(
            name='partner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, verbose_name='作者姓名')),
                ('gender', models.CharField(max_length=32, verbose_name='作者性别')),
                ('regional', models.CharField(max_length=128, verbose_name='出生地')),
                ('point', django.contrib.postgres.fields.ArrayField(base_field=models.FloatField(), size=2, verbose_name='出生地经纬度')),
                ('avatar', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, null=True, size=None, verbose_name='作者头像')),
                ('signature', models.TextField(blank=True, verbose_name='个性签名')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='邮箱')),
                ('phone', models.CharField(blank=True, max_length=128, verbose_name='手机号')),
                ('occupation', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='enroll.occupation', verbose_name='职业名称')),
            ],
        ),
        migrations.AddField(
            model_name='group',
            name='leader',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='enroll.partner', verbose_name='组长'),
        ),
        migrations.CreateModel(
            name='content',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stage', models.CharField(choices=[('start', '启动'), ('medium', '中期'), ('end', '终期')], default='start', max_length=128, verbose_name='作品阶段')),
                ('date', models.DateTimeField(blank=True, verbose_name='创作时间')),
                ('album', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品封面')),
                ('images', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品图片')),
                ('video', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品视频')),
                ('model', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品模型')),
                ('slide', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品ppt')),
                ('pdf', django.contrib.postgres.fields.ArrayField(base_field=models.JSONField(), blank=True, size=None, verbose_name='作品pdf')),
                ('product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='enroll.product', verbose_name='作品')),
            ],
        ),
    ]
