/*
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 03:50:38
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-03-09 18:11:45
 * @FilePath: /metaweb_front/src/router/index.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
 */
import { createRouter, createWebHistory } from "vue-router";


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: 'MetaWeb'
      }
    },
    {
      path: "/callback",
      name: "callback",
      component: () => import("../views/CallbackView.vue"),
    },
    {
      path: "/excellent",
      name: "优秀案例",
      component: () => import("../views/Excellent.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '元时空'
      }
    },
    {
      path: "/custom",
      name: "用户案例",
      component: () => import("../views/Custom.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '用户案例'
      }
    },
    {
      path: "/planettech",
      name: "科技追光",
      component: () => import("../views/PlanetTech.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '科技追光'
      }
    },
    {
      path: "/camping",
      name: "露营",
      component: () => import("../views/Camping.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '露营'
      }
    },
    {
      path: "/earthquakes",
      name: "地震",
      component: () => import("../views/EarthQuakes.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '地震'
      }
    },
    {
      path: "/admin",
      name: "管理后台",
      component: () => import("../views/Admin.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '管理后台'
      }
    },
    {
      path: "/enroll",
      name: "作品登记",
      component: () => import("../views/Enroll.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '作品登记'
      }
    },
    {
      path: "/photo",
      name: "照片轨迹",
      component: () => import("../views/Photo.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '照片轨迹'
      }
//MOD START BY WANGSHIJIE 2023/08/06
//    }
    },
    {
      path: "/search_d",
      name: "查找设计师",
      component: () => import("../views/Search_d.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '查找设计师'
      }
    },
    {
      path: "/search_s",
      name: "查找供应商",
      component: () => import("../views/Search_s.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '查找供应商'
      }
    },
    {
      path: "/profile_d",
      name: "修改信息(设计师)",
      component: () => import("../views/Profile_d.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '修改信息(设计师)'
      }
    },
    {
      path: "/profile_s",
      name: "修改信息(供应商)",
      component: () => import("../views/Profile_s.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: '修改信息(供应商)'
      },
    },
    {
      path: "/role",
      name: "选择角色",
      component:() => import("../views/RolePicker.vue"),
      meta: {
        content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
        title: "选择角色"
      }
    }
//MOD END   BY WANGSHIJIE 2023/08/06
  ],
});

export default router
