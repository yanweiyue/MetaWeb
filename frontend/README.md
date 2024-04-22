<!--
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-10-25 08:50:16
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-04-24 17:34:14
 * @FilePath: /metopia/front/README.md
 * @Description: 
 * 
 * Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
-->
[回到首页](../README.md)

## 仓库基本情况
### 相关背景
> 本工程为元宇宙信息平台（metopia）的 web 页面

### 安装使用
```
1. 环境
```shell
node==v16.15.0;
npm==8.19.2;
pnpm==7.14.0;
```
2. 安装依赖

```shell
pnpm i
```
3.启动开发 server
```
pnpm start
```

4.打包
```
pnpm build
```
## 接口方法定义
- api/api.js

## 路由方法定义
- router/index.js

## plugins
- axios


## 登录
### 城室-登录器
- 地址: logto.citory.tech
### 自定义登录器
> 如果要使用自定义的登录器，请参考[logto](https://git.citory.tech/mirror/logto.git)安装使用，并修改`src/consts/index.ts`中的`appId`和`endpoint`的值；

### 配置注意事项
- 参照 logto 上的[教程](https://docs.logto.io/zh-cn/docs/recipes/integrate-logto/vue)配置
- router的history一定要是createWebHistory，不能是createWebHashHistory，不然会出错
- 官方 sample 用了watchEffect，这个函数会不停调用。我改成了在页面onMounted的时候做一次验证。
- logto 有三种用户方式，用户密码，手机，邮箱。其他的社交媒体登录第一次登录的时候可以选择附加到某个已有的账号上，但是手机注册的时候就直接注册新用户了，不能附加。需要单独写一个用户名和手机、邮箱绑定的后端才行。
- 项目部署完成后必须在 [logto 管理](logto.citory.tech)上重新定义redirectUrl