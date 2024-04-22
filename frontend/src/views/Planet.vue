<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-12-29 15:18:04
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-10 18:28:52
 * @FilePath: /metaweb_front/src/views/Planet.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script setup>
/* eslint-disable */
import {onMounted, ref} from 'vue'
import {Star, Share, Refresh, MagicStick} from "@element-plus/icons-vue";
import axios from "axios";
import {api} from "../api/api";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import {config, animations} from '../scripts/config'
import {App} from '../scripts/app';
import {monthNumber, formatTooltip} from '../scripts/utils'
import {onClick, drawGlobeThree, get_dashboard_content_detail, timeSliderInput} from '../scripts/draw'
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))
// 时间轴相关
config.timeline.startDate = new Date('2022-01-01'); //开始时间（在地內）
config.timeline.surfaceDate = new Date('2022-07-01');//地表象征时间
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
const isRotateGlobeSwitch = () => {
  isRotateGlobe.value = !isRotateGlobe.value;
  animations.rotateGlobe = isRotateGlobe.value
}
const isBreathingLightSwitch = () => {
  isBreathingLight.value = !isBreathingLight.value;
  animations.breathingLight = isBreathingLight.value
}
// webgl主体
let app = null;
// 所有项目的基本信息，画星星用
const dashboard_content_data = ref([])
// 选中一个项目后画详情面板是否展开
const dialogVisible = ref(false)
// 选中一个项目后画详情面板数据
const dashboard_content_detail_data = ref(null)
// 获取数据
const list_dashboard_content_data = () => {
  axios(api.dashboard_list_content({fromtype: 1})).then(
      (response) => {
        if (response.status == 200) {
          dashboard_content_data.value = response.data.data
          for (let p of dashboard_content_data.value) {
            p.date = new Date(Date.parse(p.date))
            if (p.date < config.timeline.surfaceDate) {
              p.altitude = ((config.sizes.globe - config.timeline.minDistance) * Math.abs(p.date - config.timeline.startDate) / Math.abs(config.timeline.surfaceDate - config.timeline.startDate)) + config.timeline.minDistance
            } else {
              p.altitude = ((config.timeline.maxDistance - config.sizes.globe) * Math.abs(p.date - config.timeline.surfaceDate) / Math.abs(new Date() - config.timeline.surfaceDate)) + config.sizes.globe
            }
            p.scale = Math.random();
          }
          console.log(dashboard_content_data.value)
          // webgl初始化场景
          app = new App(dashboard_content_data.value);
          drawGlobeThree(app)
          window.addEventListener('click', (event) => {
            if (!dialogVisible.value) {
              let instanceId = onClick(event)
              console.log(`instanceId: ${instanceId}`)
              get_dashboard_content_detail(instanceId, dashboard_content_data.value).then(data => {
                console.log(data);
                dashboard_content_detail_data.value = data;
                console.log(dashboard_content_detail_data.value)
                dialogVisible.value = true;
                console.log(dialogVisible.value)
              })
            }
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

</script>
<template>
  <div id="vue">
    <SideBarHorizontal v-if="ismobile"/>
    <SideBarVertical v-else/>
    <el-tooltip class="box-item" effect="dark" content="呼吸灯特效开启/关闭" placement="bottom">
      <el-button
          :type="isBreathingLight == true ? 'success' : 'danger'" :icon="MagicStick" circle
          style="z-index: 1000;position: absolute;right: 70px;top: 80px;"
          @click="isBreathingLightSwitch"></el-button>
    </el-tooltip>
    <el-tooltip class="box-item" effect="dark" content="地球旋转开启/关闭" placement="bottom">
      <el-button
          :type="isRotateGlobe == true ? 'success' : 'danger'" :icon="Refresh" circle
          style="z-index: 1000;position: absolute;right: 24px;top: 80px;"
          @click="isRotateGlobeSwitch"></el-button>
    </el-tooltip>

    <el-dialog v-model="dialogVisible" v-if="dashboard_content_detail_data != null">
      <div class="dialog_body">
        <div class="dialog_left">
          <h2 style="color:#5FD87E">{{ dashboard_content_detail_data['product__name'] }}</h2>
          <el-tag>{{ dashboard_content_detail_data['product__category__name'] }}</el-tag>
          <el-tag type="warning">{{ dashboard_content_detail_data['stage'] == 'mid' ? '中期' : '终期' }}</el-tag>
          <p>作者:{{ dashboard_content_detail_data['product__group__name'] }}</p>
          <p>{{ dashboard_content_detail_data['date'].split("T")[0] }} 于
            {{ dashboard_content_detail_data['product__regional'] }}</p>
          <hr/>
          <p>{{ dashboard_content_detail_data['product__description'] }}</p>
        </div>
        <div class="dialog_right">
          <el-image style="width: 256px; height: 256px"
                    :src="dashboard_content_detail_data['album'][0].url + '/thumb512'"
                    @click="play_vedio(dashboard_content_detail_data['video'][0].url)" :zoom-rate="1.2"
                    :initial-index="1" fit="cover"/>

        </div>
        <el-dialog v-model="video_visible" :close-on-click-modal="false" :destroy-on-close="true"
                   style="text-align: center; width: 80%;">
          <video ref="video_ref" style=" width: 100%;height:100%" preload="auto" controls autoplay>
            <source :src="video_url" type="video/mp4">
          </video>
        </el-dialog>
      </div>
      <div class="control">
        <i v-show="!isLike" @click="isLike = true" class="el-icon-ali-cc-heart-o"></i>
        <i v-show="isLike" @click="isLike = false" style="color:#F25051" class="el-icon-ali-cc-heart"></i>
        <i class="el-icon-ali-share1"></i>
      </div>
    </el-dialog>
    <div class="timeline">
      <img style="height:100%;position: absolute;left: 0;"
           src="https://metaweb.cdn.citory.tech/textures/timeline_earth.webp"/>
      <hr/>
      <div class="slider-demo-block">
        <el-slider v-model="selectTime" :step="1" range show-stops :min="0" :max="markscount" :marks="marks"
                   @input="myTimeSliderInput" :format-tooltip="formatTooltip"/>
      </div>
      <p>未来</p>
    </div>
    <!-- <div id="globeThree"></div> -->
  </div>
</template>
<style scoped>
@import '../assets/planet.css';
</style>

<style>
@import '../assets/planetGlobal.css';
</style>
