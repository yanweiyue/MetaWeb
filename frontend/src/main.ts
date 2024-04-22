/*
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 03:50:38
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-04-23 21:24:23
 * @FilePath: /metaweb_front/src/main.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
 */
import { createApp } from "vue";
// import axios from './plugins/axios.js'
import App from "./App.vue";
import router from "./router";
import { createLogto } from "@logto/vue";
import { appId, endpoint } from "./consts";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import mapboxgl from 'mapbox-gl';
import './assets/iconfont.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import UndrawUi from 'undraw-ui'
import 'undraw-ui/dist/style.css'

Date.prototype.Format =  function (fmt) {  // author: meizz 
  var o = {
     "M+":  this.getMonth() + 1,  // 月份 
     "d+":  this.getDate(),  // 日 
     "h+":  this.getHours(),  // 小时 
     "m+":  this.getMinutes(),  // 分 
     "s+":  this.getSeconds(),  // 秒 
     "q+": Math.floor(( this.getMonth() + 3) / 3),  // 季度 
     "S":  this.getMilliseconds()  // 毫秒 
 };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, ( this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for ( var k  in o)
  if ( new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
// 英文标志为中文
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
			
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createLogto, {
  appId,
  endpoint
});
app.use(router)
// app.use(OrbitControls)
app.use(ElementPlus)
app.use(UndrawUi)
app.mount('#app')
