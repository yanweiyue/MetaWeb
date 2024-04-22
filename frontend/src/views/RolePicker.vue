<script setup>
/* eslint-disable */
import { onMounted, ref } from 'vue'
import { isWebGLAvailable, getErrorMessage } from '../plugins/mywebgl'
import { particles_stars } from '../plugins/mystars';
import axios from "axios";
import {api} from "@/api/api";
import router from "@/router";

const roles = ref([
  {
    role: "designer",
    pic: "/img/designer.png",
    name: "设计师"
  },
  {
    role: "owner",
    pic: "/img/owner.png",
    name: "业主/游客"
  },
  {
    role: "supplier",
    pic: "/img/supplier.png",
    name: "制造商"
  }
])

const chosen = ref(null);

const pickRole = (id) => {
  chosen.value = id >> 1;
}

const login = () => {
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  userInfo.role = roles.value[chosen.value].role;
  axios(api.login(userInfo)).then(
      (response) => {
        if (response.status == 200) {
          userInfo.id = response.data.id;
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          router.push("/excellent");
        }
      }
  );
}

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
    <el-card class="role-container">
      <el-row class="justify-center">
        <div class="role-prompt">您的身份是？</div>
      </el-row>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col v-for="i in 5" :span="(i % 2 === 1 ? 6 : 1)">
          <el-image :src="roles[i >> 1].pic" v-if="i % 2 === 1" :class="['role-pic', chosen === i >> 1 ? 'shinning' : '']" @click="pickRole(i)"></el-image>
          <div v-if="i % 2 === 1" class="white role-name">{{roles[i >> 1].name}}</div>
        </el-col>
      </el-row>
      <el-row class="justify-right">
        <el-button type="primary" @click="login" class="next-btn">下一步</el-button>
      </el-row>
    </el-card>
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

.role-container {
  position: relative;
  width: 50%;
  height: 50%;
  left: 25%;
  top: 25%;
  background-color: rgb(93,93,93);
  border-radius: 15px;
}

.role-prompt {
  text-align: center;
  color: white;
  font-size: 150%;
}

.justify-center {
  justify-content: center;
}

.justify-right {
  justify-content: right;
}

.role-name {
  padding-top: 15px;
}

.role-pic {
  margin-top: 30px;
}

.shinning {
  filter: drop-shadow(0 0 15px white);
  width: 102%
}

.role-pic:hover {
  filter: drop-shadow(0 0 15px white);
  width: 102%;
}

.white {
  color: white;
}

.next-btn {
  //margin-top: 10px;
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