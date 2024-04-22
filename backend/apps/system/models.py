from django.db import models
from django.contrib.postgres.fields import ArrayField
# Create your models here.

class user(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    email = models.CharField(max_length=200, null=True, blank=True)
    password = models.CharField(max_length=200)
    avatar = models.CharField(max_length=200, null=True, blank=True)
    area = models.CharField("所在地区",max_length=20,null=True,blank=True)
    birthday = models.DateField("生日",null=True,blank=True)
    age = models.IntegerField("年龄",null=True,blank=True)
    degree = models.CharField("学位",max_length=20,null=True,blank=True)
    address = models.CharField("地址",max_length=50,null=True,blank=True)
    company = models.CharField("公司",max_length=50,null=True,blank=True)
    tel = models.CharField("电话",max_length=15,null=True,blank=True)
    style = models.TextField("风格",null=True,blank=True)
    url = models.CharField("个人主页",max_length=100,null=True,blank=True)
    attachment = ArrayField(models.CharField("附件",max_length=32),null=True,blank=True)
    direction = models.CharField("商务方向",max_length=50,null=True,blank=True)
