<!--
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 03:50:38
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-02-23 16:34:53
 * @FilePath: /metaweb_front/src/views/CallbackView.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
-->
<script setup lang="ts">
import { useLogto,useHandleSignInCallback } from "@logto/vue";
import { onMounted, ref} from 'vue'
import axios from "axios";
import { api } from "../api/api";
import router from "@/router";
const { isAuthenticated, fetchUserInfo, signIn } = useLogto();

const { isLoading } = useHandleSignInCallback(async() => {
  let userInfo = await fetchUserInfo();
  console.log(userInfo);
  // userInfo.role = sessionStorage.getItem('role');
  userInfo.avatar = userInfo.picture
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  router.push('/role')
});

function isMobile() {
    let userAgentInfo = navigator.userAgent;
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let getArr = Agents.filter(i => userAgentInfo.includes(i));
    return getArr.length ? true : false;
  }
sessionStorage.setItem('ismobile', JSON.stringify(isMobile()));

</script>

<template>
  <p v-if="isLoading">正在重定向...</p>
</template>
