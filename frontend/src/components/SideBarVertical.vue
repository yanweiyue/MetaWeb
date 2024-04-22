<!--
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 06:51:59
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-09 19:52:07
 * @FilePath: /metaweb_front/src/components/SideBarVertical.vue
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


// const props = defineProps({
//   userinfo: JSON,
// });
const userinfo = ref(JSON.parse(sessionStorage.getItem('userInfo')));
const role = userinfo.value ? userinfo.value.role : "owner";
const isAdmin = ref(false)

if (userinfo.value != null && userinfo.value.role_names != null) {
  isAdmin.value = userinfo.value.role_names.includes('admin');
  console.log(isAdmin.value)
}

const isCollapse = ref(true)
// isCollapse.value = sessionStorage.getItem('menuIsCollapse')
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}

const collapseExpand = () => {
  isCollapse.value = false;
  // sessionStorage.setItem('menuIsCollapse', false);
}
const collapseFold = () => {
  isCollapse.value = true;
  // sessionStorage.setItem('menuIsCollapse', true);
}
</script>

<template>
  <div class="sidebar-container">
    <el-menu router :default-active="activeIndex" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
      @close="handleClose" active-text-color="#ffd04b" background-color="#2A2B2E" text-color="#fff"
      @mouseenter="collapseExpand" @mouseleave="collapseFold">
      <img class="expand_logo" v-show="isCollapse" src="https://metaweb.cdn.citory.tech/metaweb_vector-8.png" />
      <img class="fold_logo" v-show="isCollapse == false" src="https://metaweb.cdn.citory.tech/metaweb_logo_dark.svg" />
      <div class="user-avatar"><el-avatar :size="45" shape="square" :src="userinfo.picture" /></div>
      <div class="user-container" v-show="isCollapse == false">
        <p id="user-name">{{ userinfo.name }}</p>
        <p id="user-category">{{ isAdmin ? "管理员" : "探索者" }}</p>
      </div>
      <el-divider style="border-block-color: #666;" />
      <el-menu-item index="excellent">
        <el-icon>
          <MapLocation />
        </el-icon>
        <template #title>Excellent Case</template>
      </el-menu-item>
      <el-menu-item index="landscape">
        <el-icon>
          <Picture />
        </el-icon>
        <template #title>Landscape</template>
      </el-menu-item>
      <el-menu-item index="custom">
        <el-icon>
          <Edit />
        </el-icon>
        <template #title>Comment</template>
      </el-menu-item>
      <el-divider style="border-block-color: #666;" />
      <el-menu-item index="enroll">
        <el-icon><UploadFilled /></el-icon>
        <template #title>Project Upload</template>
      </el-menu-item>
      <el-menu-item index="photo">
        <el-icon>
          <Camera />
        </el-icon>
        <template #title>Travel Photos</template>
      </el-menu-item>
      <el-menu-item index="admin" v-if="isAdmin">
        <el-icon>
          <Operation />
        </el-icon>
        <template #title>管理后台</template>
      </el-menu-item>
<!--ADD START BY WANGSHIJIE 2023/08/06-->
<!--      <el-menu-item index="search">-->
<!--        <el-icon>-->
<!--          <Search />-->
<!--        </el-icon>-->
<!--        <template #title>查找</template>-->
<!--      </el-menu-item>-->
<!--ADD END   BY WANGSHIJIE 2023/08/06-->
      <el-menu-item index="search_d" v-if="role === 'owner'">
        <el-icon>
          <Search />
        </el-icon>
        <template #title>Designer</template>
      </el-menu-item>
      <el-menu-item index="search_s" v-if="role === 'owner' || role === 'designer'">
        <el-icon>
          <Search />
        </el-icon>
        <template #title>Supplier</template>
      </el-menu-item>
<!--ADD START BY WANGSHIJIE 2023/08/16-->
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
<!--ADD END   BY WANGSHIJIE 2023/08/16-->
      <el-menu-item index="5" disabled>
        <el-icon>
          <Operation />
        </el-icon>
        <template #title>设置</template>
      </el-menu-item>
      <el-menu-item index="7" @click="onClickSignOut">
        <el-icon>
          <SwitchButton />
        </el-icon>
        <template #title>退出</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar-container {
  z-index: 2;
  position: absolute;
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  top: 45px;
  left: 70px;
  opacity: 0;
  transform: translateX(-20px);
  animation: fade_expand 0.6s ease-out;
  animation-delay: 0.1s;
  animation-fill-mode: forwards;
}

.user-avatar {
  margin: 20px 10px 10px 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.expand_logo,
.fold_logo {
  height: 28px;
  width: 28px;
  margin-top: 10px;
}

.expand_logo {
  animation: fade_fold 0.6s ease-out;
}

.fold_logo {
  animation: fade_expand 0.6s ease-out;
}

/* Chrome, Safari, Opera */
@keyframes fade_fold {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }

  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

/* Standard syntax */
@keyframes fade_expand {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }

  100% {
    transform: translateX(0px);
    opacity: 1;
  }
}

#user-name {
  margin: 10px 0px 0px 0;
}

#user-category {
  margin: 5px 0px;
  font-size: 0.8rem;
}

.el-menu {
  height: 100vh;
  z-index: 2;
  border: none;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}</style>
