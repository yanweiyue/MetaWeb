<script setup>
/* eslint-disable */
import { defineComponent, onMounted, nextTick, watchEffect, reactive, ref, getCurrentInstance, computed } from 'vue'
import { UploadFilled, Plus, LocationFilled } from "@element-plus/icons-vue";
import { ElNotification, ElLoading } from 'element-plus'
import { redirectUrl } from "../consts";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import axios from "axios";
import { api } from "../api/api";
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))


const personal_form_ref = ref(null)
const notdone = ref(true)
const personal_form_data = ref({
    userinfo: JSON.parse(sessionStorage.getItem('userInfo')),
    phtots: [],
})

const count_photo_coors = computed(() => { // 有坐标的照片数量
    let count = 0;
    for (let photo of personal_form_data.value.phtots) {
        if (photo.coors) {
            count += 1
        }
    }
    return count
})

const personal_rules = reactive({
    regional: [
        {
            required: true,
            message: '请确认照片地点',
            trigger: 'change',
        },
    ],
    date: [
        {
            type: 'date',
            required: true,
            message: '请确定照片时间',
            trigger: 'blur',
        },
    ],
    phtots: [
        {
            type: 'array',
            required: true,
            message: '请上传照片',
            trigger: 'change',
        },
    ]
})



const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}

const handleSuccess = (response, file, fileLists) => {
    console.log(response)
    personal_form_data.value.phtots.push(response.data)
    console.log(personal_form_data.value)
}

const handleRemove = (file) => {
    let _extra = `${file.response.data.extra}.splice(${file.response.data.extra}.indexOf('${file.response.data.name}'), 1)`
    console.log(_extra)
    eval(_extra);
    console.log(personal_form_data.value)
}

onMounted(async () => {
    console.log('onMounted test')
});
</script>
<template>
    <div id="vue">
        <SideBarHorizontal v-if="ismobile" />
        <SideBarVertical v-else />
        <div class="content">
            <el-dialog v-model="dialogVisible">
                <img style="width: 100%;" :src="dialogImageUrl" alt="">
            </el-dialog>
            <div class="title">
                <h1>上传照片</h1>
            </div>

            <div v-if="notdone" class="formbody">
                <h3>已上传{{ personal_form_data.phtots.length }}张，识别到{{ count_photo_coors }}个位置</h3>
                <el-form ref="personal_form_ref" :model="personal_form_data" :rules="product_rules" status-icon
                    label-width="120px" label-position="top">
                    <el-form-item label="如上传的是原图，将自动识别坐标信息" required prop="phtots">
                        <el-upload action="MetaWebApi/web/enroll/upload" :file-list="personal_form_data.phtots"
                            :data="{ 'extra': 'getLocation' }" :on-success="handleSuccess" list-type="picture-card" multiple
                            accept="image/png, image/jpeg" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>

                    <el-form-item>
                        <el-button style="width: 100%;" type="primary" @click="submitForm(personal_form_ref)">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-result v-else style="scale: 1.5;margin: 15% 0;" icon="success" title="上传成功" sub-title="提交项目成功！">
                <template #extra>
                    <el-button type="primary" @click="reload">重新登记</el-button>
                </template>
            </el-result>
            <el-backtop :right="100" :bottom="100" />
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


.content {
    width: 100%;
    margin: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: nowrap;
    overflow-y: scroll;
}

.content::-webkit-scrollbar {

    width: 4px;

}

.content::-webkit-scrollbar-track {

    background-color: rgb(208, 223, 238);

    -webkit-border-radius: 2em;

    -moz-border-radius: 2em;

    border-radius: 2em;

}

.content::-webkit-scrollbar-thumb {

    background-color: rgb(42, 121, 185);

    -webkit-border-radius: 2em;

    -moz-border-radius: 2em;

    border-radius: 2em;

}

.formbody {
    width: 80%;
    max-width: 1000px;
}

.fullname {}

.info {
    font-size: 0.5rem;
    margin-left: 10px;
    color: #b1b1b1;
}

#regionalmap {
    position: relative;
    height: 300px;
    width: 100%;
    margin: 10px 0;
}

h2 {
    color: #555;
    text-align: left;
}

h1 {
    color: #555;
}

.upload-demo {
    width: 100%;
}

.mapboxgl-ctrl {
    display: none !important;
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

.album_uploader {
    width: 420px;
    height: 297px;
    justify-content: flex-start;
}

.avatar_uploader {
    width: 200px;
    height: 200px;
}

.album_uploader:hover,
.avatar_uploader:hover {
    border-color: var(--el-color-primary);
}

@media only screen and (min-width: 320px) and (max-width: 500px) {
    .content {
        margin: 60px 0 10px 0;
    }

    .formbody {
        width: 90%;
    }
}
</style>
<style>
.mapboxgl-marker {
    z-index: 999;
}

.avatar {
    width: 100%;
}

.mapboxgl-ctrl-bottom-right {
    display: none;
}
</style>