/**
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-10-28 11:29:54
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2022-12-20 15:00:39
 * @FilePath: /metaweb_front/src/api/api.js
 * @Description: 
 * @
 * @Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
 */

const TIMEOUTLIMIT = 1000*60
const api = {
    anyregion_place(param) {
        return {
            method: "get",
            url:'anyregion/place',
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    anyregion_geojson(param) {
        return {
            method: "get",
            url:'anyregion/geojson',
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_category(data) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/category',
            data: data,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_occupation(data) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/occupation',
            data: data,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_product(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/product',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_group(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/group',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_partner(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/partner',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_list_fromtype(data) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/list/fromtype',
            data: data,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_get_content(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/get/content',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_update_partner(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/update/partner',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_update_product(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/update/product',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_search_tag(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/search/tag',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_search_group(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/search/group',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_search_partner(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/search/partner',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_create_partner(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/create/partner',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    enroll_create_product(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/enroll/create/product',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    dashboard_list_content(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/dashboard/list/content',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    dashboard_detail_content(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/dashboard/detail/content',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    dashboard_socail_like(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/dashboard/social/like',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    dashboard_socail_view(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/dashboard/social/view',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    dashboard_socail_share(param) {
        return {
            method: "post",
            url:'MetaWebApi/web/dashboard/social/share',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    query_case(param) {
        return {
            method: "GET",
            url:'/api/v1/case/query_case',
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    query_detail(param) {
        return {
            method: "GET",
            url: "api/v1/case/query_case_detail",
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    make_comment(param) {
        return {
            method: "POST",
            url: "/api/v1/case/make_comment",
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    query_comment(param) {
        return {
            method: "GET",
            url: "/api/v1/case/query_comment",
            params:param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    make_like(param) {
        return {
            method: "POST",
            url: "/api/v1/case/make_like",
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    register(param) {
        return {
            method: "POST",
            url: '/api/v1/register',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    login(param) {
        return {
            method: "POST",
            url: '/api/v1/login',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    // ADD BY WANGSHIJIE 2023/08/16
    // ��ѯAPI Get
    queryUser(param) {
        return {
            method: "GET",
            url:'/api/v1/user/queryRole',
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    // ��ѯuserId Get
    queryUserId(param) {
        return {
            method: "GET",
            url:'/api/v1/user/queryId',
            params: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    // ���ʦ�޸�API Post 
    updateDesigner(param) {
        return {
            method: "POST",
            url:'/api/v1/profile/designer',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json'
            }
        }
    },
    // ��Ӧ���޸�API Post
    updateSupplier(param) {
        return {
            method: "POST",
            url:'/api/v1/profile/supplier',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                'accept': 'application/json',
                "Content-Type": "multipart/form-data;"
            }
        }
    },
    uploadCase(param) {
        return {
            method: "POST",
            url: '/api/v1/case/upload_case',
            data: param,
            timeout: TIMEOUTLIMIT,
            headers: {
                "Content-Type": "multipart/form-data;"
            }
        }
    }
}
export { api }