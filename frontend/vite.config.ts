/*
 * @Author: Gitea gitea@fake.local
 * @Date: 2022-10-25 03:50:38
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2023-02-22 20:24:13
 * @FilePath: /metaweb_front/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2022 by Gitea gitea@fake.local, All Rights Reserved. 
 */
import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({reactivityTransform: true})],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["@logto/vue"],
  },
  build: {
    commonjsOptions: {
      include: [/vue/, /node_modules/],
    },
  },
  server: {
    disableHostCheck: true,
    host:'0.0.0.0',
    port: 3000,
    proxy: { // 配置如下代码
      '/anyregion': {
        target: 'https://api.citory.tech', // 你请求的第三方接口
        // target:'https://api.shaojin.xin/beautyserver', // 你请求的第三方接口
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/anyregion': ''  // 替换target中的请求地址，也就是说以后你在请求https://xxxxxx/dictionary/data_dictionary_front.json这个地址的时候直接写成/api即可。
        }
      },
      '/api': {
        // target: 'https://metaweb.citory.tech', // 你请求的第三方接口
        target: 'http://0.0.0.0:6614',
        // target:'https://api.shaojin.xin/beautyserver', // 你请求的第三方接口
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/api': ''  // 替换target中的请求地址，也就是说以后你在请求https://xxxxxx/dictionary/data_dictionary_front.json这个地址的时候直接写成/api即可。
        }
      },
      '/static': {
        // target: 'https://metaweb.citory.tech', // 你请求的第三方接口
        target: 'http://0.0.0.0:6614',
        // target:'https://api.shaojin.xin/beautyserver', // 你请求的第三方接口
        secure: false,  // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/static': ''  // 替换target中的请求地址，也就是说以后你在请求https://xxxxxx/dictionary/data_dictionary_front.json这个地址的时候直接写成/api即可。
        }
      }
    },
  },
});
