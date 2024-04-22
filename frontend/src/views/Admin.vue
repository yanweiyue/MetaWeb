<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-12-13 18:06:05
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-02-23 21:49:08
 * @FilePath: /metaweb_front/src/views/Admin.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
-->
<script setup>
/* eslint-disable */
import { defineComponent, onMounted, nextTick, watchEffect, reactive, ref, getCurrentInstance } from 'vue'

import { UploadFilled, Plus, LocationFilled } from "@element-plus/icons-vue";
import { ElNotification, ElLoading } from 'element-plus'
import { redirectUrl } from "../consts";
import axios from "axios";
import { api } from "../api/api";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))
const table_data = ref({})
const table_total = ref({})
const pagelength = ref(10)
const activeName = ref('product')
const isShowContent = ref(false)
const isShowPartner = ref(false)
const partner_form_ref = ref(null)
const product_form_ref = ref(null)

const fromtype_options = ref(JSON.parse(sessionStorage.getItem('fromtype_options')));
const category_options = ref(JSON.parse(sessionStorage.getItem('category_options')));
const occupation_options = ref(JSON.parse(sessionStorage.getItem('occupation_options')));

const list_product_data = () => {
    axios(api.enroll_list_product({})).then(
        (response) => {
            if (response.status == 200) {
                table_data.value['product'] = response.data.data.data
                table_total.value['product'] = response.data.data.total
                console.log(table_data.value)
            }
        }
    );
}
const list_group_data = () => {
    axios(api.enroll_list_group({})).then(
        (response) => {
            if (response.status == 200) {
                table_data.value['group'] = response.data.data.data
                table_total.value['group'] = response.data.data.total
                console.log(table_data.value)
            }
        }
    );
}
const list_partner_data = () => {
    axios(api.enroll_list_partner({})).then(
        (response) => {
            if (response.status == 200) {
                table_data.value['partner'] = response.data.data.data
                table_total.value['partner'] = response.data.data.total
                console.log(table_data.value)
            }
        }
    );
}
const product_form_data = ref({})
const get_content_data = (id) => {
    axios(api.enroll_get_content({ id: id })).then(
        (response) => {
            if (response.status == 200) {
                table_data.value['content'] = response.data.data
                console.log(table_data.value);
                isShowContent.value = true;
            }
        }
    );
}

const show_product_detail = (product) => {
    product_form_data.value = product;
    get_content_data(product.id);
}
const productSubmit = async () => {
    console.log(product_form_data.value)
    axios(api.enroll_update_product(product_form_data.value)).then(
        (response) => {
            if (response.status == 200) {
                ElNotification({
                    title: '成功！',
                    message: response.data.data,
                    type: 'success',
                })
                isShowContent.value = false
            }
        }
    );
}
const region_options = ref([]);
const region_search = (queryString, cb) => {
    axios(api.anyregion_place({ 'name': queryString, 'pagelength': 10, 'infolength': 80 })).then(
        (response) => {
            if (response.status == 200) {
                if (response.data.status) {
                    region_options.value = response.data.body
                    cb(region_options.value);
                }
            }
        }
    );
}
const region_select = (item) => {
    product_form_data.value.point = [item.lon, item.lat]
}

const partner_form = ref({})

const show_partner_detail = (partner) => {
    partner_form.value = partner;
    isShowPartner.value = true;
}

const partner_region_select = (item) => {
    partner_form.value.regional = item.fullname
    partner_form.value.point = [item.lon, item.lat]
}


const pageChange = (val) => {
    console.log(val);
    if (activeName.value == 'product') {
        list_product_data(val);
    }
}

const partner_rules = reactive({
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
    ],
})
const partnerSubmit = async (formEl) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log(partner_form.value)
            axios(api.enroll_update_partner(partner_form.value)).then(
                (response) => {
                    if (response.status == 200) {
                        ElNotification({
                            title: '成功！',
                            message: response.data.data,
                            type: 'success',
                        })
                        isShowPartner.value = false
                        formEl.resetFields()
                    }
                    else {
                        ElNotification({
                            title: '失败！',
                            message: response.data.message,
                            type: 'error',
                        })
                    }
                }
            );
        } else {
            ElNotification({
                title: '提交失败！请检查必填表单项是否输入完成',
                type: 'error',
            })
        }
    })
}


const handleExceed = (files, uploadFiles) => {
    ElNotification({
        title: '失败！',
        message: '上传超出数量限制，请删除已有的文件再重新上传',
        type: 'error',
    })
}
const refreshAllData = () => {
    list_product_data();
    list_group_data();
    list_partner_data();
    ElNotification({
        title: '成功！',
        message: '刷新数据成功',
        type: 'success',
    })
}
const filterHandler = (value, row, column) => {
    const property = column['property']
    return row[property] === value
}
onMounted(async () => {
    refreshAllData();
});

</script>
<template>
    <div id="vue">
        <SideBarHorizontal v-if="ismobile" />
        <SideBarVertical v-else />
        <div id="content">
            <h1>管理后台面板 <el-button type="success" round @click="refreshAllData">刷新数据</el-button></h1>
            <el-dialog v-model="isShowContent" v-if="table_data['content'] != null" style="z-index:999">
                <h1>{{ table_data['content']['mid']['product__name'] }}</h1>
                <el-form ref="product_form_ref" v-if="product_form_data != null" :model="product_form_data" status-icon
                    label-width="120px" label-position="top">
                    <h2>作品大类：</h2>
                    <el-form-item required prop="fromtype">
                        <el-select style="width:100%" v-model="product_form_data.fromtype__id" class="m-2"
                            placeholder="选择作品的类型" size="large">
                            <el-option v-for="item in fromtype_options" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <h2>基础信息：</h2>
                    <el-form-item label="作品名" prop="name">
                        <el-input v-model="product_form_data.name" />
                    </el-form-item>
                    <el-form-item label="小组名" prop="group">
                        <el-input v-model="product_form_data.group__name" />
                    </el-form-item>
                    <el-form-item label="作品案例所在地" prop="regional">
                        <el-autocomplete style="width:100%" v-model="product_form_data.regional" size="large"
                            :fetch-suggestions="region_search" value-key="fullname" highlight-first-item fit-input-width
                            placeholder="请输入搜索地址，如：同济大学" @select="region_select">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <LocationFilled />
                                </el-icon>
                            </template><template #default="{ item }">
                                <span class="fullname">{{ item.fullname }}</span>
                                <span class="info">{{ item.info }}</span>
                            </template>
                        </el-autocomplete>
                        <span style="position: absolute;top: 5px;right: 50px;color: #666;">{{ product_form_data.point
                        }}</span>
                        <div id="regionalmap" ref="mapcanvas">
                        </div>
                    </el-form-item>
                    <el-form-item label="研究方向" prop="category">
                        <el-select style="width:100%" v-model="product_form_data.category__id" class="m-2" clearable
                            filterable allow-create default-first-option placeholder="选择研究方向或输入其他" size="large">
                            <el-option v-for="item in category_options" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="作品描述" prop="description">
                        <el-input v-model="product_form_data.description" :autosize="{ minRows: 5, maxRows: 10 }"
                            minlength="150" maxlength="300" show-word-limit type="textarea" placeholder="150~300字" />
                    </el-form-item>
                    <el-form-item label="作品标签" prop="tags">
                        <el-select style="width:100%" :loading="tags_loading" v-model="product_form_data.tags" class="m-2"
                            size="large" multiple filterable allow-create default-first-option :remote-method="tags_search"
                            remote :reserve-keyword="false" placeholder="请选择或创建多个与作品相关的标签，如'元宇宙'、'web3.0'等">
                            <el-option v-for="item in tags_options" :key="item.id" :label="item.name" :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
                        <el-button type="primary" size="large" @click="productSubmit(product_form_ref)">更新</el-button>
                    </el-form-item>
                </el-form>
                <h2>——中期成果——</h2>
                <p>{{ table_data['content']['mid']['date'].split("T")[0] }}</p>
                <h3>—封面—</h3>
                <el-image style="width: 256px; height: 256px"
                    :src="table_data['content']['mid']['album'][0].url + '/thumb512'"
                    :preview-src-list="[table_data['content']['mid']['album'][0].url + '/thumb1080']" :zoom-rate="1.2"
                    :initial-index="1" fit="cover" />
                <h3>—内页—</h3>
                <el-image style="width: 128px; height: 128px" v-for="item in table_data['content']['mid']['images']"
                    :key="item.name" :src="item.url + '/thumb256'" :preview-src-list="[item.url + '/thumb1080']"
                    :zoom-rate="1.2" :initial-index="1" fit="cover" />
                <h2>——终期成果——</h2>
                <p>{{ table_data['content']['end']['date'].split("T")[0] }}</p>
                <h3>—封面—</h3>
                <el-image style="width: 256px; height: 256px"
                    :src="table_data['content']['end']['album'][0].url + '/thumb512'"
                    :preview-src-list="[table_data['content']['end']['album'][0].url + '/thumb1080']" :zoom-rate="1.2"
                    :initial-index="1" fit="cover" />
                <h3>—内页—</h3>
                <el-image style="width: 128px; height: 128px" v-for="item in table_data['content']['end']['images']"
                    :key="item.name" :src="item.url + '/thumb256'" :preview-src-list="[item.url + '/thumb1080']"
                    :zoom-rate="1.2" :initial-index="1" fit="cover" />
                <div v-show="table_data['content']['end']['video'] != null">
                    <h4>—视频—</h4>
                    <el-link class="link" v-for="item in table_data['content']['end']['video']" :key="item.name"
                        :href="item.url" target="_blank">{{ item.name }}</el-link>
                </div>
                <div v-show="table_data['content']['end']['model'] != null">
                    <h4>—模型—</h4>
                    <el-link class="link" v-for="item in table_data['content']['end']['model']" :key="item.name"
                        :href="item.url" target="_blank">{{ item.name }}</el-link>
                </div>
                <div v-show="table_data['content']['end']['slide'] != null">
                    <h4>—演示文稿—</h4>
                    <el-link class="link" v-for="item in table_data['content']['end']['slide']" :key="item.name"
                        :href="item.url" target="_blank">{{ item.name }}</el-link>
                </div>
                <div v-show="table_data['content']['end']['pdf'] != null">
                    <h4>—PDF—</h4>
                    <el-link class="link" v-for="item in table_data['content']['end']['pdf']" :key="item.name"
                        :href="item.url" target="_blank">{{ item.name }}</el-link>
                </div>
            </el-dialog>
            <el-dialog v-model="isShowPartner" v-if="partner_form != null" style="z-index:999">
                <el-form ref="partner_form_ref" :model="partner_form" :rules="partner_rules" label-width="120px"
                    label-position="top">
                    <h2>更新作者信息——ID:{{ partner_form.id }}</h2>
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="partner_form.name" />
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-select style="width:100%" v-model="partner_form.gender" class="m-2" size="large">
                            <el-option label="男" value="男" />
                            <el-option label="女" value="女" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="出生地" prop="regional">
                        <el-autocomplete style="width:100%" v-model="partner_form.regional" size="large"
                            :fetch-suggestions="region_search" value-key="fullname" highlight-first-item fit-input-width
                            placeholder="请填写出生地" @select="partner_region_select">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <LocationFilled />
                                </el-icon>
                            </template><template #default="{ item }">
                                <span class="fullname">{{ item.fullname }}</span>
                                <span class="info">{{ item.info }}</span>
                            </template>
                        </el-autocomplete>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="partner_form.email" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="partner_form.phone" />
                    </el-form-item>
                    <el-form-item label="头像" prop="avatar">
                        <el-upload :limit="1" :data="{ 'extra': 'partner_form.value.avatar' }"
                            :on-success="partnerhandleSuccess" v-model:file-list="partner_form.avatar"
                            action="MetaWebApi/web/enroll/upload" list-type="picture-card"
                            :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-exceed="handleExceed">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="职业" prop="occupation">
                        <el-select style="width:100%" v-model="partner_form.occupation__id" class="m-2" clearable filterable
                            allow-create default-first-option placeholder="选择研究方向或输入其他" size="large">
                            <el-option v-for="item in occupation_options" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="个性签名" prop="signature">
                        <el-input v-model="partner_form.signature" :autosize="{ minRows: 5, maxRows: 10 }" minlength="5"
                            maxlength="100" show-word-limit type="textarea" placeholder="5~100字" />
                    </el-form-item>
                    <el-form-item style="display: flex;flex-wrap: wrap;align-items: center;justify-content: center;">
                        <el-button type="primary" size="large" @click="partnerSubmit(partner_form_ref)">更新</el-button>
                        <el-button type="danger" size="large" @click="isShowPartner = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <el-tabs type="border-card" v-model="activeName" style="height: 85%;">
                <el-tab-pane name="product" label="作品管理">
                    <el-table stripe max-height="80vh" v-if="table_data['product'] != null" :data="table_data['product']"
                        style="width: 100%">
                        <el-table-column label="序号" width="60">
                            <template #default="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="fromtype__name" :filters="[
                            { text: 'studio3', value: 'studio3' },
                            { text: '科技追光', value: '科技追光' }
                        ]" :filter-method="filterHandler" label="项目大类" width="100" />
                        <el-table-column sortable prop="name" label="项目名称" width="180">
                            <template #default="scope">
                                <el-link type="primary" @click="show_product_detail(scope.row)">{{ scope.row.name
                                }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column sortable prop="group__name" label="小组" width="150" />
                        <el-table-column sortable prop="category__name" label="研究方向" width="150" />
                        <el-table-column sortable prop="regional" label="作品所在地" width="150" />
                        <el-table-column sortable prop="description" label="作品描述" />
                        <el-table-column sortable prop="tags" label="作品标签" width="180">
                            <template #default="scope">
                                <el-tag disable-transitions v-for="tag in scope.row.tags" :key="tag">{{ tag }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="group" label="小组管理">
                    <el-table stripe max-height="80vh" v-if="table_data['group'] != null" :data="table_data['group']">
                        <el-table-column label="序号" width="60">
                            <template #default="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column sortable prop="name" label="小组名" />
                        <el-table-column sortable prop="leader__name" label="组长">
                            <template #default="scope">
                                <el-link type="primary">{{ scope.row.leader__name }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="member" label="成员">
                            <template #default="scope">
                                <el-tag disable-transitions v-for="tag in scope.row.member" :key="tag">{{ tag
                                }}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="partner" label="作者管理">
                    <el-table stripe max-height="80vh" v-if="table_data['partner'] != null" :data="table_data['partner']">
                        <el-table-column label="序号" width="60">
                            <template #default="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column sortable prop="name" label="姓名" width="150">
                            <template #default="scope">
                                <el-link type="primary" @click="show_partner_detail(scope.row)">{{ scope.row.name
                                }}</el-link>
                            </template>
                        </el-table-column>
                        <el-table-column sortable prop="gender" label="性别" width="150" />
                        <el-table-column sortable prop="regional" label="出生地" width="150" />
                        <el-table-column sortable prop="email" label="邮箱" />
                        <el-table-column sortable prop="phone" label="电话" />
                        <el-table-column sortable prop="occupation__name" label="职业" width="150" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template> 
<style scoped>
#vue {
    margin: 0;
    background-color: #fff;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    color: #444;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

#content {
    width: 100%;
    margin: 0 220px;
}

.pagination {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 14px;
}

.link {
    display: block;
}

.avatar {
    width: 256px;
    height: 256px;
}

.album_uploader,
.avatar_uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    font-size: 28px;
    color: #8c939d;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar_uploader {
    width: 200px;
    height: 200px;
}

.album_uploader:hover,
.avatar_uploader:hover {
    border-color: var(--el-color-primary);
}

.info {
    font-size: 0.5rem;
    margin-left: 10px;
    color: #b1b1b1;
}

@media only screen and (min-width: 320px) and (max-width: 500px) {
    #content {
        margin: 0;
    }
}
</style>
