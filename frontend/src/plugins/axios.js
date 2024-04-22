/**
 * @Author: shaojinxin shaojinxin@citorytech.com
 * @Date: 2022-10-28 11:29:54
 * @LastEditors: shaojinxin shaojinxin@citorytech.com
 * @LastEditTime: 2022-11-04 11:40:07
 * @FilePath: /data/data_local/web/population_frontend/src/plugins/axios.js
 * @Description: 
 * @
 * @Copyright (c) 2022 by shaojinxin shaojinxin@citorytech.com, All Rights Reserved. 
 */
// import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.baseURL = '/api'
axios.defaults.headers.post['content'] = 'application/json; charset=UTF-8';

let config = {
//   baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default {
  install: function (app, options) {
    console.log(options)
    // 添加全局的方法
    app.config.globalProperties.axios = _axios;
    // 添加全局的方法
    app.config.globalProperties.$translate = (key) => {
      return key
    }
  }
}