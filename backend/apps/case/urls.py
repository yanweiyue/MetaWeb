from django.urls import path

from .views import *

urlpatterns = [
    path('query_case',query_case,name='query_case'),
    path('query_case_detail',query_case_detail,name='query_case_detail'),
    path('make_comment',make_comment,name='make_comment'),
    path('query_comment',query_comment,name='query_comment'),
    path('make_like',make_like,name='make_like'),
    path('query_case_keyword',query_case_keyword,name='query_case_keyword'),
    path('upload_case',upload_case,name='upload_case')
]