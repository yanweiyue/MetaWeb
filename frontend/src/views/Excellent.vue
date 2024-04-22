<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-12-29 15:18:04
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-10 18:28:52
 * @FilePath: /metaweb_front/src/views/Excellent.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
-->
<script setup>
/* eslint-disable */
import {onMounted, ref, computed, reactive} from 'vue'
import {Star, Share, Refresh, MagicStick} from "@element-plus/icons-vue";
import axios from "axios";
import {api} from "../api/api";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import {config, animations} from '../scripts/config'
import {App} from '../scripts/app';
import {monthNumber, formatTooltip} from '../scripts/utils'
import {onClick, drawGlobeThree, get_dashboard_content_detail, timeSliderInput} from '../scripts/draw'
import TWEEN from "@tweenjs/tween.js";
import emoji from '@/assets/emoji/emoji'
import { UToast, useLevel } from 'undraw-ui'
import { ElAvatar, ElButton } from 'undraw-ui'
import { reply, comment } from '@/assets/comment.js'


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
  timeSliderInput(val, case_data.value)
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
const userinfo = ref(JSON.parse(sessionStorage.getItem('userInfo')));

// webgl主体
let app = null;
// 所有项目的基本信息，画星星用
const case_data = ref([])
// 选中一个项目后画详情面板数据
const case_detail = ref({})

const case_detail_item = computed(() => {
  return [
    {
      name: "Designer",
      val: case_detail.value.designer,
      icon: "el-icon-ali-shejishi"
    },
    {
      name: "Supplier",
      val: case_detail.value.supplier,
      icon: "el-icon-ali-gongyingshang"
    },
    {
      name: "Area",
      val: case_detail.value.area,
      icon: "el-icon-ali-jianzhumianji"
    },
    {
      name: "Address",
      val: case_detail.value.address,
      icon: "el-icon-ali-address"
    },
    {
      name: "Description",
      val: case_detail.value.description,
      icon: "el-icon-ali-description"
    }
  ]
})

const jumpToDetail = (url) => {
  window.open(url);
}

//获取数据
const showCase = () => {
  axios(api.query_case({type: "excellent"})).then(
      (response) => {
        if (response.status == 200) {
          case_data.value = response.data.slice(1)
          for (let p of case_data.value) {
            p.date = new Date();
            p.color = '#FF0000'
            // p.date = new Date(Date.parse(p.date))
            if (p.date < config.timeline.surfaceDate) {
              p.altitude = ((config.sizes.globe - config.timeline.minDistance) * Math.abs(p.date - config.timeline.startDate) / Math.abs(config.timeline.surfaceDate - config.timeline.startDate)) + config.timeline.minDistance
            } else {
              p.altitude = ((config.timeline.maxDistance - config.sizes.globe) * Math.abs(p.date - config.timeline.surfaceDate) / Math.abs(new Date() - config.timeline.surfaceDate)) + config.sizes.globe
            }
            // p.scale = Math.random();
            p.scale = 0.5;
          }
          console.log(case_data.value)
          // webgl初始化场景
          app = new App(case_data.value, globeContainerId.value);
          drawGlobeThree(app)
          window.addEventListener('click', (event) => {
            let instance = onClick(event, globeContainerId.value)
            if (!instance) {
              return;
            }
            console.log(`instanceId: ${instance}`)
            let caseid = case_data.value[instance.instanceId].id;
            showDetail.value = true;

            axios(api.query_detail({type: "excellent", caseid: caseid, userid: userinfo.value.id})).then(
                (response) => {
                  if (response.status == 200) {
                    case_detail.value = response.data;
                    case_detail.value.id = caseid;
                    isLike.value = response.data.self_like

                    let tgtPos = instance.point.multiplyScalar(1.7);
                    let tgtX = tgtPos.x;
                    let orgX = window.app.camera.position.x;
                    if (!showImg.value) {
                      loadComment();
                    }

                    new TWEEN.Tween(window.app.camera.position)
                        .to(tgtPos, 1000)
                        .easing(TWEEN.Easing.Sinusoidal.InOut)
                        .onUpdate(() => {
                          if (!globe.split) {
                            return;
                          }
                          let curSpan = 100 - (window.app.camera.position.x - orgX) / (tgtX - orgX) * 50;
                          if (curSpan) {
                            globe.span = curSpan;
                            window.app.handleResize();
                          }
                        })
                        .onComplete(() => {
                          globe.split = false;
                          adjustDetailImgHeight();
                          setTextVertical(true);
                        }).start();
                  }
                }
            )
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


const globe = reactive({
  span: 100,
  split: true
});
const globeStyle = computed(() => {
  return {
    width: globe.span + "%",
    position: "relative"
  }
});
const detailStyle = computed(() => {
  return {
    width: (100 - globe.span) + "%"
  }
})
const sliderStyle = computed(() => {
  return {
    position: "absolute",
    left: globe.split ? "20vw" : "10vw",
    bottom: globe.split ? "25px" : "60px",
    width: globe.split ? "60vw" : "30vw"
  }
})
const showDetail = ref(false);
const globeContainerId = ref("globe-container");


const setTextVertical = (flag) => {
  let els = document.getElementsByClassName("el-slider__marks-text");
  for (let i = 0; i < els.length; i++) {
    els[i].style.writingMode = flag ? "vertical-lr" : "";
  }
}
const cancelSplit = () => {
  new TWEEN.Tween(globe)
      .to({span: 100}, 600)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        window.app.handleResize();
      })
      .onComplete(()=> {
        setTextVertical(false);
        showDetail.value = false;
        setTimeout(window.app.handleResize, 100);
      })
      .start();
  config_cmt.comments = []
  globe.split = true;
}

const adjustDetailImgHeight = () => {
  let description = document.getElementById("detail-description");
  let img_ctr = document.getElementById("detail-img-ctr");
  img_ctr.style.height = (description.parentElement.clientHeight - description.clientHeight) + "px";
}

const heartClass = computed(() => {
  return isLike.value ? "el-icon-ali-cc-heart" : "el-icon-ali-cc-heart-o"
})
const heartColor = computed(() => {
  return isLike.value ? "red" : "";
});
const like_case = () => {
  if (!isLike.value) {
    isLike.value = true;

    axios(api.make_like({
      userid: userinfo.value.id,
      caseid: case_detail.value.id,
      type: "excellent"
    })).then((response) => {
      if (response.status == 200) {
          case_detail.value.size += 1;
      }
    })
  }
}


const loadComment = () => {
  axios(api.query_comment(
      {
        caseid: case_detail.value.id,
        type: "excellent"
      }
  )).then((response) => {
    if (response.status == 200) {
      let cmts = []
      for (let cmt of response.data.slice(1)) {
        cmts.push({
          user: {
            id: cmt.id,
            avatar: cmt.avatar,
            username: cmt.username,
          },
          content: cmt.comment
        })
      }
      config_cmt.comments = cmts;
      config_cmt.total = cmts.length;
    }
  })
}

const showImg = ref(true);
const toggleCmt = () => {
  showImg.value = !showImg.value;
  if (!showImg.value) {
    loadComment();
  }
}
const config_cmt = reactive({
  user: {
    id: userinfo.value.id,
    username: userinfo.value.name,
    avatar: userinfo.value.picture,
    level: 6,
    // 评论id数组 建议:存储方式用户id和文章id和评论id组成关系,根据用户id和文章id来获取对应点赞评论id,然后加入到数组中返回
    likeIds: []
  },
  emoji: emoji,
  comments: [],
  total: 0
})

let temp_id = 100
// 提交评论事件
const submit = ({ content, parentId, files, finish }) => {
  console.log('提交评论: ' + content, parentId, files)

  let comment = {
    // id: String((temp_id += 1)),
    // parentId: parentId,
    uid: config_cmt.user.id,
    // address: '来自江苏',
    content: content,
    likes: 0,
    createTime: '1分钟前',
    // contentImg: contentImg,
    user: {
      username: config_cmt.user.username,
      avatar: config_cmt.user.avatar,
      level: 6,
      homeLink: `/${(temp_id += 1)}`
    },
    reply: null
  }
  axios(api.make_comment(
      {
        userid: config_cmt.user.id,
        caseid: case_detail.value.id,
        type: "excellent",
        comment: content
      }
  )).then((response) => {
    if (response.status == 200) {
      comment.id = response.data.id;
      finish(comment)
      UToast({ message: '评论成功!', type: 'info' })
    }
  })
}

// 点赞按钮事件
const like = (id, finish) => {
  console.log('点赞: ' + id)
  finish();
}

// 分页插件
const page = (pageNum, pageSize, arr) => {
  var skipNum = (pageNum - 1) * pageSize
  var newArr =
      skipNum + pageSize >= arr.length ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
  return newArr
}

//回复分页
const replyPage = (parentId, pageNum, pageSize, finish) => {
  let tmp = {
    total: reply.total,
    list: page(pageNum, pageSize, reply.list)
  }
  setTimeout(() => {
    finish(tmp)
  }, 200)
}

onMounted(async () => {
  showCase()
})

</script>
<template>
  <div id="vue">
    <SideBarHorizontal v-if="ismobile"/>
    <SideBarVertical v-else/>
    <el-row class="full-screen">
      <div :style="globeStyle" :id="globeContainerId" class="full-height">
        <div class="map-tool">
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
        </div>
        <div class="timeline">
          <img style="height:100%;position: absolute;left: 0;"
               src="https://metaweb.cdn.citory.tech/textures/timeline_earth.webp"/>
          <hr/>
          <div class="slider-timeline" :style="sliderStyle">
            <el-slider v-model="selectTime" :step="1" range show-stops :min="0" :max="markscount" :marks="marks"
                       @input="myTimeSliderInput" :format-tooltip="formatTooltip"/>
          </div>
          <p>未来</p>
        </div>
      </div>
      <div :style="detailStyle" class="full-height bg-black" v-if="showDetail">
        <el-row class="full-width" id="detail-description">
          <el-descriptions
              class="full-width"
              :column="2"
              border
          >
            <template #extra>
              <div class="ctrl-panel">
                <i @click="like_case" :class="heartClass" :style="{color: heartColor}"><span class="like-num">{{case_detail.size}}</span></i>
                <i class="el-icon-ali-message-fill" @click="toggleCmt"></i>
                <i class="el-icon-ali-open" @click="jumpToDetail(case_detail.url)"></i>
                <i class="el-icon-ali-wrong" @click="cancelSplit"></i>
              </div>
            </template>
            <template #title>
              <span class="detail-header">{{ case_detail.name }}</span>
            </template>
            <el-descriptions-item v-for="item in case_detail_item" class="detail-item">
              <template #label>
                <div class="cell-item">
                  <i :class="item.icon"/>
                  &nbsp{{ item.name }}
                </div>
              </template>
              {{ item.val }}
            </el-descriptions-item>
          </el-descriptions>
        </el-row>
        <el-row class="full-width half-height" id="detail-img-ctr">
          <el-image v-if="showImg" v-for="url in case_detail.img" :src="url" class="full-width" />
          <u-comment v-else class="full-width text-left"
              :config="config_cmt"
              @submit="submit"
              @like="like"
              @reply-page="replyPage"
          >
          </u-comment>
        </el-row>
      </div>
    </el-row>
    <!-- <div id="globeThree"></div> -->
  </div>
</template>
<style scoped>
@import '../assets/planet.css';
.cell-item {
  display: flex;
  align-items: center;
}
</style>

<style>
@import '../assets/planetGlobal.css';

.full-screen {
  position: absolute;
  width: 100%;
  height: 100%;
}

.full-height {
  height: 100%;
}

.full-width {
  width: 100%;
}

#detail-description {
  max-height: 50%;
  overflow-y: scroll;
}

#detail-img-ctr {
  overflow: scroll;
}

.half-height {
  height: 50%;
}

.bg-black {
  background-color: #2A2B2E;
}

.detail-header {
  color: white;
  font-size: 120%;
  margin-top: 10px;
}

.ctrl-panel > i {
  font-size: 1.5rem;
  margin: 0px 8px;
  color: white;
}

.detail-item > i{
  font-size: 1.2rem;
}

.text-left {
  text-align: left;
}

.like-num {
  color: white;
  font-size: medium;
}

</style>