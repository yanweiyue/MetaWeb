'''
Author: shaojinxin shaojinxin@citorytech.com
Date: 2022-12-12 17:00:19
LastEditors: shaojinxin shaojinxin@citorytech.com
LastEditTime: 2022-12-20 15:18:12
FilePath: /metaweb_backend/apps/enroll/urls.py
Description: 

Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
'''
from django.urls import path

from .views import *

urlpatterns = [
    path('create/partner', create_partner.as_view(), name='create_partner'),
    path('create/product', create_product.as_view(), name='create_product'),
    path('create/group', create_group.as_view(), name='create_group'),
    path('search/partner', search_partner.as_view(), name='search_partner'),
    path('search/tag', search_tag.as_view(), name='search_tag'),
    path('search/group', search_group.as_view(), name='search_group'),
    path('list/occupation', list_occupation.as_view(), name='list_occupation'),
    path('list/category', list_category.as_view(), name='list_category'),
    path('list/fromtype', list_fromtype.as_view(), name='list_fromtype'),
    path('list/product', list_product.as_view(), name='list_product'),
    path('list/group', list_group.as_view(), name='list_group'),
    path('list/partner', list_partner.as_view(), name='list_partner'),
    path('get/content', get_content.as_view(), name='get_content'),
    path('update/partner', update_partner.as_view(), name='update_partner'),
    path('update/product', update_product.as_view(), name='update_product'),
    path('upload', upload_file.as_view(), name='upload_file'),
]