from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class excellent_case(models.Model):
    name = models.CharField("建筑名称",max_length=200)
    longitude = models.FloatField("经度")
    latitude = models.FloatField("纬度")
    url = models.CharField("url",max_length=200,null=True,blank=True)
    size = models.IntegerField("点赞数")
    designer = models.CharField("设计者",max_length=50,null=True,blank=True)
    supplier = models.CharField("供应商",max_length=100,null=True,blank=True)
    address = models.CharField("地址",max_length=100,null=True,blank=True)
    area = models.IntegerField("面积",null=True,blank=True)
    description = models.TextField("描述", null=True, blank=True)
    img = ArrayField(models.CharField(max_length=50),null=True,blank=True) # 图片列表，可以空

    def __str__(self):
        return self.name
    
class custome_case(models.Model):
    name = models.CharField("建筑名称",max_length=200)
    longitude = models.FloatField("经度")
    latitude = models.FloatField("纬度")
    address = models.CharField("地址",max_length=100,null=True,blank=True)
    size = models.IntegerField("点赞数")
    type = models.CharField("案例类型",max_length=20)
    designer = models.CharField("设计者",max_length=50,null=True,blank=True)
    description = models.TextField("描述",max_length=800,null=True,blank=True)
    mid_time = models.DateField("中期时间",null=True,blank=True)
    mid_cover = models.CharField("中期封面",max_length=50,null=True,blank=True)
    term_time = models.DateField("终期时间",null=True,blank=True)
    term_cover = models.CharField("终期封面",max_length=50,null=True,blank=True)
    video = models.CharField("视频",max_length=50,null=True,blank=True)
    tag = ArrayField(models.CharField(max_length=50),null=True,blank=True) # 标签列表，可以空
    mid_album = ArrayField(models.CharField(max_length=50),null=True,blank=True) # 中期作品图列表，可以空
    term_album = ArrayField(models.CharField(
        max_length=50), null=True, blank=True)  # 终期作品图列表，可以空

    def __str__(self):
        return self.name
    
# 评论
class comment(models.Model):
    # 暂时不用外键
    # caseid = models.ForeignKey('case',on_delete=models.CASCADE)
    # userid = models.ForeignKey('user.user',on_delete=models.CASCADE)    # 级联
    caseid = models.IntegerField()
    userid = models.IntegerField()    
    content = models.CharField("评论内容",max_length=500)
    type = models.CharField("样例类型",max_length=20)

# 点赞
class like(models.Model):
    # 暂时不用外键
    # caseid = models.ForeignKey('case',on_delete=models.CASCADE)
    # userid = models.ForeignKey('user.user',on_delete=models.CASCADE)    # 级联
    caseid = models.IntegerField()
    userid = models.IntegerField()    
    type = models.CharField("样例类型",max_length=20)