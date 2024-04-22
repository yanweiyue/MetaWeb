<!--
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 06:51:59
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-09 19:52:29
 * @FilePath: /metaweb_front/src/components/SideBarHorizontal.vue
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
-->
<script setup>
import { ref, watch } from 'vue'
import { useLogto } from "@logto/vue";
import { baseUrl } from "../consts";
import { useRoute } from 'vue-router';
import {
  Compass,
  Lightning,
  Search,
  Place,
  Setting,
  Finished,
  Expand,
  Operation,
  SwitchButton,
  Fold,
  Camera,
  Guide,
  User //ADD BY WANGSHIJIE 2023/08/16
} from '@element-plus/icons-vue'

let path = ref("")
const route = useRoute()
path.value = route.path
console.log('sidebar route', path.value)
const activeIndex = ref('')
activeIndex.value = path.value.replace('/', '')
const { signOut } = useLogto();

function onClickSignOut() {
  signOut(baseUrl);
};

const userinfo = ref(JSON.parse(sessionStorage.getItem('userInfo')));
// ADD START BY WANGSHIJIE 2023/08/16
const role = userinfo.value.role;
// ADD END   BY WANGSHIJIE 2023/08/16
const isAdmin = ref(false)

if (userinfo.value != null && userinfo.value.role_names != null) {
  isAdmin.value = userinfo.value.role_names.includes('admin');
  console.log(isAdmin.value)
}
</script>

<template>
  <div class="sidebar-container">
    <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#ffd04b"
      background-color="#2A2B2E" text-color="#fff">
      <el-menu-item><img class="expand_logo" src="https://metaweb.cdn.citory.tech/metaweb_vector-8.png" /></el-menu-item>
      <el-sub-menu index="0">
        <template #title>导航</template>
        <el-menu-item index="planet">
          <el-icon>
            <Compass />
          </el-icon>
          <template #title>studio3</template>
        </el-menu-item>
        <el-menu-item index="planettech">
          <el-icon>
            <Place />
          </el-icon>
          <template #title>科技追光</template>
        </el-menu-item>
        <el-menu-item index="camping">
          <el-icon>
            <Guide />
          </el-icon>
          <template #title>露营吧</template>
        </el-menu-item>
        <el-menu-item index="earthquakes">
          <el-icon>
            <Lightning />
          </el-icon>
          <template #title>全球地震</template>
        </el-menu-item>
        <el-menu-item index="photo">
          <el-icon>
            <Camera />
          </el-icon>
          <template #title>我的照片</template>
        </el-menu-item>
        <el-menu-item index="enroll">
          <el-icon>
            <Finished />
          </el-icon>
          <template #title>作品登记</template>
        </el-menu-item>
        <el-menu-item index="5" disabled>
          <el-icon>
            <Operation />
          </el-icon>
          <template #title>设置</template>
        </el-menu-item>
        <el-menu-item index="admin" v-if="isAdmin">
          <el-icon>
            <Operation />
          </el-icon>
          <template #title>管理后台</template>
        </el-menu-item>
<!--ADD START BY WANGSHIJIE 2023/08/06-->
        <el-menu-item index="search">
          <el-icon>
            <Search />
          </el-icon>
          <template #title>查找</template>
        </el-menu-item>
        <el-menu-item index="profile_d" v-if="role == 'designer'">
          <el-icon>
            <User />
          </el-icon>
          <template #title>Profile</template>
        </el-menu-item>
        <el-menu-item index="profile_s" v-if="role == 'supplier'">
          <el-icon>
            <User />
          </el-icon>
          <template #title>Profile</template>
        </el-menu-item>        
<!--ADD END   BY WANGSHIJIE 2023/08/06-->
      </el-sub-menu>
      <!-- <el-divider direction="vertical" style="border-block-color: #666;" /> -->
      <!-- <div class="flex-grow" /> -->
      <el-sub-menu index="2" class="user-container">
        <template #title>
          <div class="user-avatar"><el-avatar :size="45" shape="square" :src="userinfo.picture" /></div>
        </template>
        <el-menu-item>
          <p id="user-name">{{ userinfo.name }}</p>
        </el-menu-item>
        <el-menu-item>
          <p id="user-category">{{ isAdmin ? "管理员" : "探索者" }}</p>
        </el-menu-item>
        <el-button style="width:100%" type="danger" :icon="SwitchButton" round @click="onClickSignOut">退出</el-button>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 0.8;
}

.sidebar-container {
  z-index: 2;
  position: absolute;
}

.user-container {
  right: 0;
  position: absolute;
  top: 0;
  height: 60px;
}

.user-avatar {
  margin: 20px 10px 10px 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.expand_logo {
  height: 28px;
  width: 28px;
  margin-top: 10px;
}

#user-name {
  font-size: 1.2rem;
  text-align: right;
  width: 100%;
}

#user-category {
  font-size: 0.8rem;
  text-align: right;
  width: 100%;
}

.el-menu {
  height: 60px;
  width: 100vw;
  z-index: 2;
  border: none;
}

.el-menu-demo:not(.el-menu--collapse) {
  height: 60px;
}
</style>
