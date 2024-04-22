'''
Author: shaojinxin shaojinxin@citorytech.com
Date: 2022-12-12 19:07:39
LastEditors: shaojinxin shaojinxin@citorytech.com
LastEditTime: 2023-04-24 16:47:51
FilePath: /metopia/backend/apps/enroll/views.py
Description: 

Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
'''
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import connections
from django.db.models import Q
from django.core import serializers
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .decorator import *
from .models import *
import json,datetime,csv,decimal,os,re,hashlib
from pipe import select,where,groupby,sort
# from project.myglobal import cosclient,dictfetchall,_logging
from project.myglobal import _logging
from django.conf import settings
# from qcloud_cos.cos_exception import CosClientError, CosServiceError
import exifread
import base64
logger = _logging(filename='./logs/enroll.log')
STATIC_URL = 'static/upload/'

class create_partner(APIView):
    @swagger_auto_schema(operation_summary='新建作者', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['name', 'occupation'],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="作者姓名"),
            'gender': openapi.Schema(type=openapi.TYPE_STRING, description="作者性别"),
            'regional': openapi.Schema(type=openapi.TYPE_STRING, description="出生地"),
            'point':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_NUMBER),description="出生地经纬度"),
            'avatar':openapi.Schema(type=openapi.TYPE_STRING, description="作者头像地址"),
            'signature':openapi.Schema(type=openapi.TYPE_STRING, description="个性签名"),
            'occupation':openapi.Schema(type=openapi.TYPE_NUMBER, description="职业"),
            'email':openapi.Schema(type=openapi.TYPE_STRING, description="邮箱"),
            'phone':openapi.Schema(type=openapi.TYPE_STRING, description="手机"),
        },
    ))
    def post(self, request, *args, **kwargs):
        name = request.data['name']
        gender = request.data['gender']
        regional = request.data['regional']
        point = request.data['point']
        avatar = request.data['avatar'] if 'avatar' in request.data.keys() else None
        signature = request.data['signature'] if 'signature' in request.data.keys() else None
        email = request.data['email'] if 'email' in request.data.keys() else None
        phone = request.data['phone'] if 'phone' in request.data.keys() else None
        _occupation = occupation.objects.get(id=int(request.data['occupation'])) if 'occupation' in request.data.keys() else None
        try:
            partner.objects.create(name=name, email=email,phone=phone,gender=gender,regional=regional,point=point, avatar=avatar, signature=signature,occupation= _occupation )
            return JsonResponse(dict(data=f'新建作者『{name}』成功', status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class update_partner(APIView):
    @swagger_auto_schema(operation_summary='更新作者信息', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['id'],
        properties={
            'id':openapi.Schema(type=openapi.TYPE_NUMBER, description="作者ID"),
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="作者姓名"),
            'gender': openapi.Schema(type=openapi.TYPE_STRING, description="作者性别"),
            'regional': openapi.Schema(type=openapi.TYPE_STRING, description="出生地"),
            'point':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_NUMBER),description="出生地经纬度"),
            'avatar':openapi.Schema(type=openapi.TYPE_STRING, description="作者头像地址"),
            'signature':openapi.Schema(type=openapi.TYPE_STRING, description="个性签名"),
            'occupation__id':openapi.Schema(type=openapi.TYPE_NUMBER, description="职业"),
            'email':openapi.Schema(type=openapi.TYPE_STRING, description="邮箱"),
            'phone':openapi.Schema(type=openapi.TYPE_STRING, description="手机"),
        },
    ))
    def post(self, request, *args, **kwargs):
        id = request.data['id'] 
        name = request.data['name'] if 'name' in request.data.keys() else None
        gender = request.data['gender'] if 'gender' in request.data.keys() else None
        regional = request.data['regional'] if 'regional' in request.data.keys() else None
        point = request.data['point'] if 'point' in request.data.keys() else None
        avatar = request.data['avatar'] if 'avatar' in request.data.keys() else None
        signature = request.data['signature'] if 'signature' in request.data.keys() else None
        email = request.data['email'] if 'email' in request.data.keys() else None
        phone = request.data['phone'] if 'phone' in request.data.keys() else None
        _occupation = occupation.objects.get(id=int(request.data['occupation__id'])) if 'occupation__id' in request.data.keys() else None
        try:
            _partner = partner.objects.filter(id=int(id))
            _partner.update(name=name, email=email,phone=phone,gender=gender,regional=regional,point=point, avatar=avatar, signature=signature,occupation= _occupation )
            return JsonResponse(dict(data=f'更新作者『{name}』成功', status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class create_group(APIView):
    @swagger_auto_schema(operation_summary='新建小组', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['name', 'leader','member'],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="小组名称"),
            'leader': openapi.Schema(type=openapi.TYPE_STRING, description="组长"),
            'member': openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING), description="组员"),
        },
    ))
    def post(self, request, *args, **kwargs):
        name = request.data['name']
        leader = request.data['leader']
        member = request.data['member']
        # logger.info(partner.objects.filter(name=name))
        try:
            group.objects.create(name=name, leader=partner.objects.filter(name=leader)[0],member=member)
            return JsonResponse(dict(data='新建小组成功', status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class create_product(APIView):
    @swagger_auto_schema(operation_summary='注册作品', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['product_form', 'content_mid_form','content_end_form'],
        properties={
            'group_form': openapi.Schema(type=openapi.TYPE_OBJECT, description="小组表单"),
            'product_form_data': openapi.Schema(type=openapi.TYPE_OBJECT, description="作品表单"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            product_form = request.data['product_form_data']
            if 'group_form' in request.data.keys():
                group_form = request.data['group_form']
                _leader = partner.objects.filter(name=group_form['leader'])
                if not _leader.exists():
                    return JsonResponse(dict(message='组长不存在，请创建作者并提交作者信息后重新提交项目！', status=False, code=200))
                _leader = _leader[0]
                _group = group.objects.filter(name=group_form['name'],leader=_leader)
                if not _group.exists():
                    _group = group(name=group_form['name'], leader=partner.objects.filter(name=group_form['leader'])[0],member=group_form['member'])
                    _group.save()
                    logger.info(f"注册小组成功:{group_form['name']}")
                else:
                    _group = _group[0]
                    logger.info(f"小组已存在:{group_form['name']}")
            else:
                _group = group.objects.filter(name=product_form['group'])
                if not _group.exists():
                    return JsonResponse(dict(message='小组信息错误，请重新选择或创建新的小组。', status=False, code=200))
                else:
                    _group = _group[0]
            _category = category.objects.filter(id=product_form['category'])[0]
            product_name = product_form['name']
            _fromtype = product_form['fromtype'] if 'fromtype' in product_form.keys() else 1
            _product = product.objects.filter(fromtype__id=_fromtype,name=product_name,group=_group)
            if not _product.exists():
                _product = product(fromtype=fromtype.objects.get(id=_fromtype),name=product_name,group=_group,regional=product_form['regional'],point=product_form['point'],category=_category,tags=product_form['tags'],description=product_form['description'])
                _product.save()
                logger.info(f"项目保存成功:{product_name}")
            else:
                _product.update(name=product_name,group=_group,regional=product_form['regional'],point=product_form['point'],category=_category,tags=product_form['tags'],description=product_form['description'])
                logger.info(f"项目更新成功:{product_name}")
                _product = _product[0]
            cmid = content.objects.filter(product=_product,stage='mid')
            if not cmid.exists():
                content.objects.create(product=_product,stage='mid',date=product_form['mid_date'],album=product_form['mid_album'],images=product_form['mid_images'])
                logger.info(f"中期保存成功:{product_name}")
            else:
                cmid.update(product=_product,stage='mid',date=product_form['mid_date'],album=product_form['mid_album'],images=product_form['mid_images'])
            cend = content.objects.filter(product=_product,stage='end')
            if not cend.exists():
                content.objects.create(product=_product,stage='end',date=product_form['end_date'],album=product_form['end_album'],images=product_form['end_images'],video=product_form['end_video'],model=product_form['end_model'],slide=product_form['end_slide'],pdf=product_form['end_pdf'])
                logger.info(f"终期保存成功:{product_name}")
            else:
                cend.update(product=_product,stage='end',date=product_form['end_date'],album=product_form['end_album'],images=product_form['end_images'],video=product_form['end_video'],model=product_form['end_model'],slide=product_form['end_slide'],pdf=product_form['end_pdf'])
            return JsonResponse(dict(data=f'新建作品『{product_name}』成功', status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))


class update_product(APIView):
    @swagger_auto_schema(operation_summary='更新作品基础信息', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['id'],
        properties={
            'id': openapi.Schema(type=openapi.TYPE_NUMBER, description="项目ID"),
            'name':openapi.Schema(type=openapi.TYPE_STRING, description="项目名称"),
            'regional':openapi.Schema(type=openapi.TYPE_STRING, description="位置"),
            'point':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_NUMBER), description="经纬度"),
            'description':openapi.Schema(type=openapi.TYPE_STRING, description="项目描述"),
            'tags':openapi.Schema(type=openapi.TYPE_ARRAY,items=openapi.Items(type=openapi.TYPE_STRING), description="标签"),
            'category__id': openapi.Schema(type=openapi.TYPE_STRING, description="研究方向"),
            'fromtype__id': openapi.Schema(type=openapi.TYPE_STRING, description="大类"),
            'group__id': openapi.Schema(type=openapi.TYPE_STRING, description="小组ID"),
            'group__name': openapi.Schema(type=openapi.TYPE_STRING, description="小组名称"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            id = request.data['id'] 
            name = request.data['name'] if 'name' in request.data.keys() else None
            regional = request.data['regional'] if 'regional' in request.data.keys() else None
            point = request.data['point'] if 'point' in request.data.keys() else None
            description = request.data['description'] if 'description' in request.data.keys() else None
            tags = request.data['tags'] if 'tags' in request.data.keys() else None
            category__id = request.data['category__id'] if 'category__id' in request.data.keys() else None
            fromtype__id = request.data['fromtype__id'] if 'fromtype__id' in request.data.keys() else None
            group__id = request.data['group__id'] if 'group__id' in request.data.keys() else None
            group__name = request.data['group__name'] if 'group__name' in request.data.keys() else None
            _group =group.objects.get(id=group__id)
            if group__name!=_group.name:
                _group.name = group__name
                _group.save()
            _category = category.objects.get(id=category__id)
            _fromtype = fromtype.objects.get(id=fromtype__id)
            _product = product.objects.filter(id=id)
            _product.update(fromtype=_fromtype,name=name,group=_group,regional=regional,point=point,category=_category,tags=tags,description=description)
            return JsonResponse(dict(data=f'更新作品『{name}』成功', status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))
class search_partner(APIView):
    @swagger_auto_schema(operation_summary='查找作者', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="作者姓名"),
            'gender': openapi.Schema(type=openapi.TYPE_STRING, description="作者性别"),
            'regional': openapi.Schema(type=openapi.TYPE_STRING, description="出生地"),
            'signature':openapi.Schema(type=openapi.TYPE_STRING, description="个性签名"),
            'occupation':openapi.Schema(type=openapi.TYPE_STRING, description="职业")
        },
    ))
    def post(self, request, *args, **kwargs):
        
        if 'name' in request.data.keys():
            if request.data['name'] == "":
                return JsonResponse(dict(message='empty name', status=False, code=200))
            p = partner.objects.filter(name__icontains=request.data['name'])
        if 'gender' in request.data.keys():
            p = partner.objects.filter(gender=request.data['gender'])
        if 'regional' in request.data.keys():
            p = partner.objects.filter(regional__icontains=request.data['regional'])
        if 'signature' in request.data.keys():
            p = partner.objects.filter(signature__icontains=request.data['signature'])
        if 'occupation' in request.data.keys():
            p = partner.objects.filter(occupation=request.data['occupation'])
        try:
            res = list(p.values())
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class search_tag(APIView):
    @swagger_auto_schema(operation_summary='搜索作品标签', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="标签")
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            res = list(tags.objects.filter(name__icontains=request.data['name']).values())
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class search_group(APIView):
    @swagger_auto_schema(operation_summary='搜索小组', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description="小组")
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            res = list(group.objects.filter(name__icontains=request.data['name']).values())
            res = list(res | select(lambda x:{"id":x["id"], "name":x["name"],"leader":partner.objects.get(id=x["leader_id"]).name}))
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))
        
class list_occupation(APIView):
    @swagger_auto_schema(operation_summary='枚举职业', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT
    ))
    def post(self, request, *args, **kwargs):
        try:
            res = list(occupation.objects.all().values())
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class list_category(APIView):
    @swagger_auto_schema(operation_summary='枚举作品类别', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT
    ))
    def post(self, request, *args, **kwargs):
        try:
            res = list(category.objects.all().values())
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))


class list_fromtype(APIView):
    @swagger_auto_schema(operation_summary='枚举作品来源', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT
    ))
    def post(self, request, *args, **kwargs):
        try:
            res = list(fromtype.objects.all().values())
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class list_product(APIView):
    @swagger_auto_schema(operation_summary='作品清单', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'pagenum': openapi.Schema(type=openapi.TYPE_NUMBER, description="页码"),
            'pagelength': openapi.Schema(type=openapi.TYPE_NUMBER, description="每页长度"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            if 'pagenum' in request.data.keys() and 'pagelength' in request.data.keys():
                startRow = (request.data['pagenum']-1)*request.data['pagelength']
                endRow = request.data['pagenum'] * request.data['pagelength']
                res = list(product.objects.all().order_by('pk')[startRow:endRow].values('id','fromtype__id','fromtype__name','name','group__id','group__name','regional','point','category__id','category__name','tags','description'))
            else:
                res = list(product.objects.all().order_by('pk').values('id','fromtype__id','fromtype__name','name','group__id','group__name','regional','point','category__id','category__name','tags','description'))
            count = product.objects.all().count()
            return JsonResponse(dict(data={"data":res,"total":count}, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class list_group(APIView):
    @swagger_auto_schema(operation_summary='小组清单', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'pagenum': openapi.Schema(type=openapi.TYPE_NUMBER, description="页码"),
            'pagelength': openapi.Schema(type=openapi.TYPE_NUMBER, description="每页长度"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            if 'pagenum' in request.data.keys() and 'pagelength' in request.data.keys():
                startRow = (request.data['pagenum']-1)*request.data['pagelength']
                endRow = request.data['pagenum'] * request.data['pagelength']
                res = list(group.objects.all().order_by('pk')[startRow:endRow].values('id','name','leader__id','leader__name','member'))
            else:
                res = list(group.objects.all().order_by('pk').values('id','name','leader__id','leader__name','member'))
            count = group.objects.all().count()
            return JsonResponse(dict(data={"data":res,"total":count}, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class list_partner(APIView):
    @swagger_auto_schema(operation_summary='作者清单', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=[],
        properties={
            'pagenum': openapi.Schema(type=openapi.TYPE_NUMBER, description="页码"),
            'pagelength': openapi.Schema(type=openapi.TYPE_NUMBER, description="每页长度"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            if 'pagenum' in request.data.keys() and 'pagelength' in request.data.keys():
                startRow = (request.data['pagenum']-1)*request.data['pagelength']
                endRow = request.data['pagenum'] * request.data['pagelength']
                res = list(partner.objects.all().order_by('pk')[startRow:endRow].values('id','name','gender','regional','point','avatar','signature','occupation__id','occupation__name','email','phone'))
            else:
                res = list(partner.objects.all().order_by('pk').values('id','name','gender','regional','point','avatar','signature','occupation__id','occupation__name','email','phone'))
            count = partner.objects.all().count()
            return JsonResponse(dict(data={"data":res,"total":count}, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))
        
class get_content(APIView):
    @swagger_auto_schema(operation_summary='获取作品内容', request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['id'],
        properties={
            'id': openapi.Schema(type=openapi.TYPE_NUMBER, description="项目id"),
        },
    ))
    def post(self, request, *args, **kwargs):
        try:
            bac = list(content.objects.filter(product__id=request.data['id']).values('product__name','stage','date','album','images','video','model','slide','pdf'))
            res = {}
            for i in bac:
                res[i['stage']]={}
                for j in i:
                    if i[j]!=None and i[j]!=[]:
                        res[i['stage']][j]=i[j]
            return JsonResponse(dict(data=res, status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=200))

class upload_file(APIView):
    @swagger_auto_schema(operation_summary='上传文件',request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['file'],
            properties={
                'extra':openapi.Schema(type=openapi.TYPE_STRING, description="额外参数"),                
                'file': openapi.Schema(type=openapi.TYPE_FILE,description="上传文件"),
            },
        ))
    def post(self, request,*args, **kwargs):
        try:
            myFile = request.FILES.get("file", None)
            # md5重命名
            md5obj = hashlib.md5()
            md5obj.update(myFile.read())
            hash = md5obj.hexdigest()
            formatname =str(hash)+'_'+myFile.name
            # 保存位置
            inner_path = os.path.join(settings.LOCAL_DIR,STATIC_URL,formatname)
            destination = open(inner_path,'wb+')    # 打开特定的文件进行二进制的写操作  
            for chunk in myFile.chunks():      # 分块写入文件  
                destination.write(chunk)  
            destination.close()
            # 使用高级接口断点续传，失败重试时不会上传已成功的分块(这里重试10次)
            # for i in range(0, 10):
            #     try:
            #         response = cosclient.upload_file(
            #         Bucket='metaweb-1254980686',
            #         Key=formatname,
            #         LocalFilePath=inner_path)
            #         break
            #     except CosClientError or CosServiceError as e:
            #         print(e)
            extra = request.data['extra'] if 'extra' in request.data.keys() else None
            res = {"name":formatname,"extra":extra,"url":f'https://metaweb-1254980686.cos.ap-shanghai.myqcloud.com/{formatname}'}
            if extra == 'getLocation':
                coors = get_location(myFile)
                res['coors'] = coors
                del res['extra']
            return JsonResponse(dict(data=res,status=True, code=200))
        except Exception as r:
            return JsonResponse(dict(message=str(r), status=False, code=400))



def convert2latlon(x):    
    # 处理经纬度 将其转化为 xx.xxxxxx格式
    x_last = eval(str(x[-1]))
    new_x = x[0].num + x[1].num / 60 + x_last / 3600
    return str(new_x)
# bytes 转 base64
def bytes_to_base64(image_bytes):    
    image_base4 = base64.b64encode(image_bytes).decode('utf8')
    return image_base4

def get_location(myFile):
    # 获取图片信息
    # f = open(path,"rb")   # 读取图片为二进制格式
    tags = exifread.process_file(myFile)
    # 图片纬度
    lat = tags.get('GPS GPSLatitude', '0').values if 'GPS GPSLatitude' in tags.keys() else None
    lat = convert2latlon(lat) if lat is not None else None
    # 图片经度
    lon = tags.get('GPS GPSLongitude', '0').values if 'GPS GPSLongitude' in tags.keys() else None
    lon = convert2latlon(lon) if lon is not None else None
    # 获取日期，时间
    date =  tags.get('EXIF DateTimeDigitized').values if 'EXIF DateTimeDigitized' in tags.keys() else None
    thumbnail = bytes_to_base64(tags.get('JPEGThumbnail')) if 'JPEGThumbnail' in tags.keys() else None
    return{"lon":lon,"lat":lat,"date":date,"thumbnail":thumbnail}
