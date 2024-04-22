<script setup>
/* eslint-disable */
import { defineComponent, onMounted, nextTick, watchEffect, reactive, ref, getCurrentInstance } from 'vue'
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

const product_form_ref = ref(null)
const notdone = ref(true)

const product_form_data = ref({
    fromtype: 1,
    name: '',
    group: '',
    regional: '',
    point: [],
    category: '',
    tags: [],
    description: '',
    mid_date: '',
    mid_album: [],
    mid_images: [],
    end_date: '',
    end_album: [],
    end_images: [],
    end_video: [],
    end_model: [],
    end_slide: [],
    end_pdf: []
})

const prdt_form = ref(
    {
      name: "",
      designer: "",
      longitude: '',
      latitude: '',
      address: "",
      regional: "",
      description: "",
      tag: [],
      mid_time: "",
      term_time: "",

    }
)

const prdt_files = {
  middle_album: [],
  middle_cover: [null],
  term_cover: [null],
  term_album: [],
  video: ""
}
const handleChangeMidCv = (file) => {
  prdt_files.middle_cover[0] = file.raw;
}

const handleChangeMidImg = (file) => {
  prdt_files.middle_album.push(file.raw);
}

const handleChangeFinalCv = (file) => {
  prdt_files.term_cover[0] = file.raw;
}

const handleChangeFinalImg = (file) => {
  prdt_files.term_album.push(file.raw);
}

const handleChangeVideo = (file) => {
  prdt_files.video = file.raw;
}

//地图
let map = ''
let marker = ''
const onDragEnd = () => {
  const lngLat = marker.getLngLat();
  prdt_form.value.latitude = lngLat.lat
  prdt_form.value.longitude = lngLat.lng
}

async function initmap() {
    // //去除mapbox的logo
    // map._logoControl && map.removeControl(map._logoControl);
    map = new mapboxgl.Map({
        accessToken: 'pk.eyJ1IjoiczQ0NzE4NTIwOSIsImEiOiJjamNpZ211YTkybDFsMzNtdG1icGkyeTM3In0.rUYTu9jx6tWO1mZoMOb9Uw',
        container: 'regionalmap',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [121.526, 31.2595],
        zoom: 14.89,
        pitch: 0,
        preserveDrawingBuffer: true
    })
    map.on('load', () => {
        console.log('map loaded')
    })
    // 设置语言为中文
    map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }));
    // 添加全屏按钮
    map.addControl(new mapboxgl.FullscreenControl());
    marker = new mapboxgl.Marker({ color: 'black', draggable: true })
    marker.setLngLat([121.526, 31.2595]).addTo(map);
    marker.on('dragend', onDragEnd);
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
  prdt_form.value.longitude = item.lon;
  prdt_form.value.latitude = item.lat;
  prdt_form.value.address = item.info;
    marker.setLngLat([item.lon, item.lat])
    map.setCenter({ lng: item.lon, lat: item.lat })
}

const tags_loading = ref(false)
const tags_options = ref([]);
const tags_search = (name) => {
    tags_loading.value = true
    axios(api.enroll_search_tag({ 'name': name })).then(
        (response) => {
            if (response.status == 200) {
                let data = response.data.data
                tags_options.value = data
                tags_loading.value = false
            }
        }
    );
}

const submitForm = async (formEl) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
          let form = new FormData();
          for (let [key, val] of Object.entries(prdt_form.value)) {
            form.append(key, val);
          }
          for(let [key, val] of Object.entries(prdt_files)) {
            for(let i = 0; i < val.length; i++) {
              form.append(key, val[i]);
            }
          }
            axios(api.uploadCase(form)).then(
                (response) => {
                    if (response.status == 200) {
                        if (response.data.status) {
                            notdone.value = false
                        }
                        else {
                            ElNotification({
                                title: '创建项目失败！',
                                message: response.data.message,
                                type: 'error',
                                duration: 0,
                            })
                        }
                    }
                    else{
                        ElNotification({
                            title: '网络请求失败，请查看网络配置！',
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

const reload = () => {
    location.reload()
}
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = (file) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}

onMounted(async () => {
    console.log('onMounted test')
    initmap();
});
</script>
<template>
    <div id="vue">
        <SideBarHorizontal v-if="ismobile" />
        <SideBarVertical v-else />
        <div class="content">
            <div class="title">
                <h1>Work Registration Form</h1>
            </div>
            <div v-if="notdone" class="formbody">
                <el-form ref="product_form_ref" :model="prdt_form" status-icon
                    label-width="120px" label-position="top">
                    <h2>Basic Information：</h2>
                  <el-form-item label="Name" required prop="name">
                    <el-input v-model="prdt_form.name" />
                  </el-form-item>
                    <el-form-item label="Designer" required prop="designer">
                        <el-input v-model="prdt_form.designer" />
                    </el-form-item>

                    <el-form-item label="Location" required prop="regional">
                        <el-alert type="info" show-icon :closable="false">
                            <p>请搜索并拖拽地图上的黑色图钉至作品案例所在地</p>
                        </el-alert>
                        <el-autocomplete style="width:100%" v-model="prdt_form.regional" size="large"
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
                        <span style="position: absolute;top: 40px;right: 10px;color: #999;">经纬度：[{{ prdt_form.longitude
                        }}, {{prdt_form.latitude}}]</span>
                        <div id="regionalmap" ref="mapcanvas">
                        </div>
                    </el-form-item>
                    <el-form-item label="Description" prop="description">
                        <el-input v-model="prdt_form.description" :autosize="{ minRows: 5, maxRows: 10 }"
                            minlength="150" maxlength="300" show-word-limit type="textarea" placeholder="150~300字" />
                    </el-form-item>
                    <el-form-item label="Tag" prop="tags">
                        <el-select style="width:100%" v-model="prdt_form.tag"
                            class="m-2" size="large" multiple filterable allow-create default-first-option
                             remote :reserve-keyword="false"
                            placeholder="请选择或创建多个与作品相关的标签，如'元宇宙'、'web3.0'等">
                            <el-option v-for="item in tags_options" :key="item.id" :label="item.name"
                                :value="item.name" />
                        </el-select>
                    </el-form-item>
                    <h2>中期过程文件：</h2>
                    <el-form-item label="请选择中期过程文件创作时间" prop="mid_date">
                        <el-date-picker v-model="prdt_form.mid_time" type="date" placeholder="选择日期"
                                        value-format="YYYY-MM-DD"
                                        format="YYYY/MM/DD"
                                        size="large" />
                    </el-form-item>
                    <el-form-item label="封面主图1张，A3横版:297mm×420mm 300dpi" prop="middle_cover">
                        <el-upload :limit="1" :auto-upload="false" :on-change="handleChangeMidCv"
                            list-type="picture-card" multiple accept="image/png, image/jpeg"
                            :on-preview="handlePictureCardPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="作品图，A3横版:297mm×420mm 300dpi" prop="middle_img">
                        <el-upload :on-change="handleChangeMidImg" :auto-upload="false"
                                   list-type="picture-card" multiple accept="image/png, image/jpeg"
                            :on-preview="handlePictureCardPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <h2>终期成果文件：</h2>
                    <el-form-item label="请选择终期成果文件创作时间" prop="end_date">
                        <el-date-picker v-model="prdt_form.term_time" type="date" placeholder="选择日期"
                                        value-format="YYYY-MM-DD"
                                        format="YYYY/MM/DD"
                                        size="large" />
                    </el-form-item>
                    <el-form-item label="封面主图1张，A3横版:297mm×420mm 300dpi" prop="final_cover">
                        <el-upload :on-change="handleChangeFinalCv" :limit="1" :auto-upload="false"
                                   list-type="picture-card" multiple accept="image/png, image/jpeg"
                            :on-preview="handlePictureCardPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="作品图，A3横版:297mm×420mm 300dpi" prop="final_img">
                        <el-upload :on-change="handleChangeFinalImg" :auto-upload="false"
                            list-type="picture-card" multiple accept="image/png, image/jpeg"
                            :on-preview="handlePictureCardPreview">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="作品视频" prop="video">
                        <el-upload class="upload-demo"  drag :auto-upload="false"
                                   :on-change="handleChangeVideo"
                            accept="video/mp4">
                            <el-icon class="el-icon--upload">
                                <UploadFilled />
                            </el-icon>
                            <div class="el-upload__text">
                                <em>点击</em> 或拖拽上传文件
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    2分钟左右；1920*1080p；mp4格式
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width: 100%;" type="primary"
                            @click="submitForm(product_form_ref)">提交</el-button>
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

width:4px;

}

.content::-webkit-scrollbar-track {

background-color:rgb(208, 223, 238);

-webkit-border-radius: 2em;

-moz-border-radius: 2em;

border-radius:2em;

}

.content::-webkit-scrollbar-thumb {

background-color:rgb(42, 121, 185);

-webkit-border-radius: 2em;

-moz-border-radius: 2em;

border-radius:2em;

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
    .content{
    margin: 60px 0 10px 0;
}
}

</style>
<style>
.mapboxgl-marker {
    z-index: 999;
}
.avatar{
    width:100%;
}
.mapboxgl-ctrl-bottom-right{
    display: none;
}
</style>