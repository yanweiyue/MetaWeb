<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-12-13 18:06:05
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-02-23 19:09:59
 * @FilePath: /metaweb_front/src/views/Home.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
-->
<script setup>
/* eslint-disable */
import { onMounted,  ref } from 'vue'
import { isWebGLAvailable, getErrorMessage } from '../plugins/mywebgl'
import { particles_stars } from '../plugins/mystars';
import router from "@/router";
import {redirectUrl} from "@/consts";
import {useLogto} from "@logto/vue";

const { isAuthenticated, fetchUserInfo, signIn } = useLogto();

const onClickSignIn = () => {
  signIn(redirectUrl);
}
const host = ref(window.location.host);
console.log(`host: ${host.value}`);
onMounted(async () => {
    // 浏览器是否支持 webgl
    if (isWebGLAvailable()) {
        console.log('webgl is available!')
    } else {
        const warning = getWebGLErrorMessage(1);
        alert(warning);
    }
    particles_stars()
});

</script>
<template>
    <div id="vue">
        <img class="logo_vector" src="https://metaweb.cdn.citory.tech/metaweb_vector-8.png" />
        <div class="title">
            <h1 style="margin: 0;">Meta Web</h1>
            <button @click="onClickSignIn" class="button button-glow button-pill button-primary"
                style="width:100%;font-size: 1.5rem;font-weight: 900;">进入...</button>
        </div>
        <div v-if="host=='metopia.cn'" class="footer">沪ICP备2023003774号-1  沪公网安备31011002006111</div>
    </div>
</template> 
<style scoped>
#vue {
    width: 100vw;
    height: 100vh;
    /* position: absolute; */
    /* background-image: url(https://metaweb.cdn.citory.tech/space_backgroud.webp); */
    /* background-size: cover; */
}


.logo_vector {
    width: 64px;
    height: 50px;
    position: fixed;
    right: 45px;
    top: 45px;
}

.title {
    font-size: 4rem;
    position: fixed;
    left: 10%;
    top: 40%;
}

@media only screen and (min-width: 320px) and (max-width: 500px) {
    .title {
        font-size: 4rem;
        position: absolute;
        left: 10%;
        top: calc(50vh - 50vw);
        width: 80%;
    }
}
.footer{
    position: absolute;
    bottom: 10px;
    font-size: 0.5rem;
    width: 100%;
    text-align: center;
}
</style>

<style>
body {
    margin: 0;
    background-color: #000011;
}

canvas {
    vertical-align: bottom;
    z-index: 1;
}

</style>
