<!--
 * @Author: wangshijie
 * @Date: 2023-08-16 18:31:29
 * @LastEditors: wangshijie
 * @LastEditTime: 
 * @FilePath: frontend/src/components/Search_s.vue
 * @Description: 
 * 
-->
<script setup>
/* eslint-disable */
import { defineComponent, onMounted, nextTick, watchEffect, reactive, ref, getCurrentInstance, computed } from 'vue'
import { redirectUrl } from "../consts";
import { UploadFilled } from "@element-plus/icons-vue";
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import axios from "axios";
import { api } from "../api/api";
import { ElNotification, ElLoading } from 'element-plus'

// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))

const userinfo = ref(JSON.parse(sessionStorage.getItem('userInfo')));

//测试用示例图片 user.img?
var avatarUrl = "";

//获取数据
const supplier_data = ref({
  id: 0,
  name: "",
  direction: "",
  attachment: [],
  url: ""
})

const attachments = ref([])
const showCase = () => {
  axios(api.queryUserId({userid: userinfo.value.id})).then(
      (response) => {
        if (response.status == 200) {
          supplier_data.value = response.data[1]
          if (!supplier_data.value.attachment) {
            supplier_data.value.attachment = [];
          }
        }
    }
    );
}
//测试数据
supplier_data.value = {
  id: 1,
  name: "AAA",
  direction: "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  attachment: [],
  url: "https://www.orientalpearltower.com"
}

// const product_form_data = ref({
//   end_file: []
// })

const handleChange = (file) => {
  attachments.value.push(file.raw);
}

const handleFile = (file) => {
  window.open(window.location.origin + file);
}

const saveSupplierMsg = () =>{
  let form = new FormData();
  for (let [key, val] of Object.entries(supplier_data.value)) {
    form.append(key, val);
  }
  form.delete('attachment');
  for(let i = 0; i < attachments.value.length; i++) {
      form.append('attachment', attachments.value[i]);
  }
  axios(api.updateSupplier(form)).then(
        (response) => {
            if (response.status == 200) {
              ElNotification({
                title: 'Success',
                message: 'Profile updated',
                type: 'success',
              })
            }
        }
    );
}

const cancelSupplierMsg = () =>{
  showCase()
}

onMounted(async () => {
  showCase()
})

</script>
<template>
  <div id="vue">
    <SideBarHorizontal v-if="ismobile" />
    <SideBarVertical v-else />
    <div id="profileMain">
      <div class="profileHead">
        <el-row gutter="60">
          <el-col id="avatarArea" :span="6">
            <div class="showAvatar">
              <el-avatar :size="200" :src="supplier_data.avatar" />
            </div>
          </el-col>
          <el-col id="messageArea" :span="18">
            <div class="showMsg">
              <h3 id="userName">{{ supplier_data.name }}</h3>
              <div class="msg"><span class="msgTitle">Main Business Direction:</span></div>
              <div class="msg"><span id="styleText">{{ supplier_data.direction }}</span></div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="profileBody">
        <h3>附件上传</h3>
        <!-- <el-form-item prop="end_file"> -->
        <!-- <el-upload class="fileUpload" drag action="MetaWebApi/web/enroll/upload" :file-list="product_form_data.end_file"
           :on-success="handleSuccess"> -->
        <el-upload class="fileUpload" drag :on-change="handleChange" :limit="5" :auto-upload="false">
          <el-icon class="el-icon--upload">
            <UploadFilled />
          </el-icon>
          <span class="el-upload__text">
            Click or drag to upload the file
          </span>
        </el-upload>
        <div class="margin-fb">
          <h3>已上传附件</h3>
          <div v-for="attach in supplier_data.attachment" class="file" @click="handleFile(attach)">
            {{attach.substring(14)}}
          </div>
        </div>
        <!-- </el-form-item> -->
        <h3>Personal Page</h3>
        <div id="personalPage">
          <el-input v-model="supplier_data.url"></el-input>
        </div>
        <el-row gutter="120">
          <el-col :span="12">
            <button id="saveBtn" @click="saveSupplierMsg">Save</button>
          </el-col>
          <el-col :span="12">
            <button id="cancelBtn" @click="cancelSupplierMsg">Cancel</button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
#vue {
  margin: 0;
  background-color: black;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  color: black;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

#profileMain {
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  overflow-y: scroll;
}


.profileHead {
  margin: 20px 50px 0 200px;
  color: white;
}

.showAvatar {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

.showMsg {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: left;
  text-align: left;
}

h3 {
  font-size: 200%;
  margin: 0 0 20px 0;
}

.msg {
  font-size: 20px;
  white-space: nowrap;
}

.msgTitle {
  font-weight: bolder;
}

#styleText {
  width: 100%;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}

.profileBody {
  margin: 20px 50px 0 200px;
  text-align: left;
  color: white;
}

/* .fileUpload {
  padding: 0 10px 0 10px;
  border-style: solid;
  border-radius: 10px;
  border-width: 2px;
  border-color: white;
} */


.el-icon--upload{
  font-size: 35px;
  margin: 0;
}
.el-upload__text {
  font-size: 30px;
}

#personalPage {
  padding: 5px 20px;
  border-style: solid;
  border-radius: 10px;
  border-width: 2px;
  border-color: white;
  font-size: larger;
  margin-bottom: 20px;
}

#saveBtn,
#cancelBtn {
  font-size: 200%;
  color: white;
  background-color: #444;
  height: fit-content;
  width: 100%;
  padding: 5px;
  border-radius: 10px;
  border-width: 2px;
  border-color: #444;
  margin-bottom: 20px;
}

:deep(.el-input__wrapper){
  padding: 0;
  margin-bottom: 5px;
}
:deep(.el-input__inner){
  color:white;
  background-color: black;
  font-size: 20px;
  white-space: nowrap;
}

:deep(.el-upload-dragger){
  padding:5px;
  background-color:black;
  text-align:left;
  border:solid;
  border-width:2px;
}
.margin-fb {
  margin: 20px 0;
}

.file:hover {
  background-color: green;
  cursor: pointer;
}
</style>

