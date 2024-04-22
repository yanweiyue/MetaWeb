<!--
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 06:51:59
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2022-12-18 15:32:47
 * @FilePath: /shaojinxin/metaweb_front/src/components/Header.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
-->
<script setup>
import { ref } from 'vue'
import { useLogto } from "@logto/vue";
import { baseUrl } from "../consts";
const { signOut } = useLogto();
const dropdown = ref()
function onClickSignOut() {
  signOut(baseUrl);
};
function showClick() {
  dropdown.value.handleOpen()
}
const props = defineProps({
  userinfo: JSON,
});

console.log(props)

</script>

<template>
  <div class="header-container">
    <div class="logo-container">
      <a href="https://www.citorytech.com">
        <el-image style="height:40px" src="https://metaweb.cdn.citory.tech/metaweb_logo_dark.svg" fit="cover">
        </el-image>
      </a>
    </div>
    <!-- <p class="username">你好，{{userinfo.name}}！</p> -->
    <el-dropdown ref="dropdown" trigger="contextmenu" style="margin-right: 0px">
      <el-button class="user-container" type="Primary" @click="showClick" text>
        <el-avatar class="user-avatar" :size="45" :src="userinfo.picture" />
        <p>{{ userinfo.name }}</p>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>
            <el-button type="primary" onclick="window.location.href='https://www.citorytech.com'" text>官网</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="primary" onclick="window.location.href='mailto:citorytech@citorytech.com'" text>反馈</el-button>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <el-button type="danger" @click="onClickSignOut" text>退出</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.header-container {
  display: flex;
  background-color: #1e2025;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  padding: 0 20px;
}

.user-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  /* width: 150px; */
}


.user-avatar {
  margin: 0 10px;
}

.username {
  margin: 0 20px;
  letter-spacing: 3px;
}
</style>
