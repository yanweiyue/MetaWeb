<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-12-13 18:06:05
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-10 18:29:52
 * @FilePath: /metaweb_front/src/views/Camping.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
-->
<script setup>
/* eslint-disable */
import { onMounted, ref } from 'vue'
import { Star, Share, Refresh, MagicStick } from "@element-plus/icons-vue";
import axios from "axios";
import { api } from "../api/api";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import { config, animations,elements } from '../scripts/config'
import { App } from '../scripts/app';
import { monthNumber, formatTooltip,toWGSCoordinates } from '../scripts/utils'
import { onClick, drawGlobeThree, get_dashboard_content_detail, timeSliderInput } from '../scripts/draw'
import {heartBeat} from '../scripts/heart'
import {flyToHeart} from '../scripts/camera'
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))
// 时间轴相关
config.timeline.startDate = new Date('2018-01-01');
config.timeline.surfaceDate = new Date('2020-01-01');
const today = new Date();
const months = ref(monthNumber(today, config.timeline.startDate)) //今天距离开始日期之间的差值
//时间轴mark数
config.timeline.markscount = 13
config.timeline.monthinterval = parseInt(Math.floor(parseInt(months.value) / config.timeline.markscount));
const selectTime = ref([0, config.timeline.markscount]);//当前选中的时间段
const marks = ref({});
for (var i = 0; i < config.timeline.markscount; i++) {
    marks.value[i] = formatTooltip(i)
}
marks.value[config.timeline.markscount] = '今天'
const markscount = ref(config.timeline.markscount);
// 时间轴数据筛选
const myTimeSliderInput = (val) => {
    timeSliderInput(val, dashboard_content_data.value)
}
// 分享点赞
const isLike = ref(false)
const isShare = ref(false)
// 旋转发光
const isRotateGlobe = ref(animations.rotateGlobe)
const isBreathingLight = ref(animations.breathingLight)
const isRotateGlobeSwitch = () => { isRotateGlobe.value = !isRotateGlobe.value; animations.rotateGlobe = isRotateGlobe.value }
const isBreathingLightSwitch = () => { isBreathingLight.value = !isBreathingLight.value; animations.breathingLight = isBreathingLight.value }
// webgl主体
let app = null;
// 所有项目的基本信息，画星星用
const dashboard_content_data = ref([])
// 选中一个项目后画详情面板是否展开
const dialogVisible = ref(false)
// 选中一个项目后画详情面板数据
const dashboard_content_detail_data = ref(null)
const MAG_MIN = 6.5
const list_dashboard_content_data = () => {
    axios(api.dashboard_list_content({ fromtype: 4, start_hex: '#007AFF', finish_hex: '#ff0000', mid_hex: '#00FF64', color_length: 30 })).then(
        (response) => {
            if (response.status == 200) {
                dashboard_content_data.value = response.data.data
                console.log(response.data);
                for (let p of dashboard_content_data.value) {
                    p.date = new Date(Date.parse(p.date))
                    if (p.date < config.timeline.surfaceDate) {
                        p.altitude = ((config.sizes.globe - config.timeline.minDistance) * Math.abs(p.date - config.timeline.startDate) / Math.abs(config.timeline.surfaceDate - config.timeline.startDate)) + config.timeline.minDistance
                    } else {
                        p.altitude = ((config.timeline.maxDistance - config.sizes.globe) * Math.abs(p.date - config.timeline.surfaceDate) / Math.abs(new Date() - config.timeline.surfaceDate)) + config.sizes.globe
                    }
                    p.scale =Math.random()*0.3;
                }
                console.log(dashboard_content_data.value)
                // // webgl初始化场景
                app = new App(dashboard_content_data.value);
                
                drawGlobeThree(app)
                window.addEventListener('click', (event) => {
                    elements.heart.visible = true
                    let idx = onClick(event)
                    console.log(idx)
                    dashboard_content_detail_data.value = dashboard_content_data.value[idx]
                    console.log(dashboard_content_detail_data.value)
                    dialogVisible.value = true
                }, false);
            }
        }
    );
}
// 播放视频
const video_visible = ref(false)
const video_ref = ref(null)
const video_url = ref('')
const play_vedio = (url) => {
    console.log('播放视频')
    console.log(url)
    video_visible.value = true
    video_url.value = url
}

onMounted(async () => {
    list_dashboard_content_data()
})


const heartBeatAnimation = () => {
    let target = {lat: 16.849705829435003,lon: 89.06151211535075,alt: 69.29646455628168}
    // console.log(target)
    flyToHeart(app.camera,target,heartBeat)
    // let pos = toWGSCoordinates(-app.camera.position.x, app.camera.position.y, -app.camera.position.z)
    // console.log(pos)
}
</script>
<template>
    <div id="vue">
        <SideBarHorizontal v-if="ismobile" />
        <SideBarVertical v-else />
        <el-tooltip class="box-item" effect="dark" content="心动营地" placement="bottom"><el-button
                type="danger" class="el-icon-ali-cc-heart" circle
                style="z-index: 1000;position: absolute;right: 116px;top: 80px;"
                @click="heartBeatAnimation"></el-button></el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="呼吸灯特效开启/关闭" placement="bottom"><el-button
                :type="isBreathingLight == true ? 'primary' : 'info'" :icon="MagicStick" circle
                style="z-index: 1000;position: absolute;right: 70px;top: 80px;"
                @click="isBreathingLightSwitch"></el-button></el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="地球旋转开启/关闭" placement="bottom"><el-button
                :type="isRotateGlobe == true ? 'primary' : 'info'" :icon="Refresh" circle
                style="z-index: 1000;position: absolute;right: 24px;top: 80px;"
                @click="isRotateGlobeSwitch"></el-button></el-tooltip>

                <el-dialog v-model="dialogVisible" v-if="dashboard_content_detail_data != null">
            <div class="dialog_body">
                <div class="dialog_left">
                    <h2 style="color:#5FD87E">{{ dashboard_content_detail_data['name'] }}</h2>
                    <p>时间:<el-tag>{{ dashboard_content_detail_data['date'].Format("yyyy-MM-dd") }}</el-tag></p>
                    <p>地点:{{ dashboard_content_detail_data['addr'] }}</p>
                    
                    <p>经度:<el-tag>{{ dashboard_content_detail_data['longitude'].substring(0,7) }}</el-tag> 纬度:<el-tag>{{
                        dashboard_content_detail_data['latitude'].substring(0,7) }}</el-tag></p>
                    <p v-show="dashboard_content_detail_data['area'] != null">区域:<el-tag>{{ dashboard_content_detail_data['area'] }}</el-tag></p>
                    <p v-show="dashboard_content_detail_data['phone'] != null">联系电话:<el-tag>{{ dashboard_content_detail_data['phone'] }}</el-tag></p>
                </div>
                <div class="dialog_right"> 
                        <el-image style="width: 256px; height: 256px"
                            :src="dashboard_content_detail_data['image']"
                            :zoom-rate="1.2" :initial-index="1" fit="cover" />
                        </div>
            </div>
            <div class="control">
                <i v-show="!isLike" @click="isLike = true" class="el-icon-ali-cc-heart-o"></i>
                <i v-show="isLike" @click="isLike = false" style="color:#F25051" class="el-icon-ali-cc-heart"></i>
                <i class="el-icon-ali-share1"></i>
            </div>
        </el-dialog>
        <div class="timeline">
            <img style="height:100%;position: absolute;left: 0;"
                src="https://metaweb.cdn.citory.tech/textures/timeline_earth.webp" />
            <hr />
            <div class="slider-demo-block">
                <el-slider v-model="selectTime" :step="1" range show-stops :min="0" :max="markscount" :marks="marks"
                    @input="myTimeSliderInput" :format-tooltip="formatTooltip" />
            </div>
            <p>未来</p>
        </div>
    </div>
</template> 
<style scoped>
@import '../assets/planet.css';
</style>


<style>
@import '../assets/planetGlobal.css';
</style>

