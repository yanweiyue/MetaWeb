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
import SideBarHorizontal from '../components/SideBarHorizontal.vue';
import SideBarVertical from '../components/SideBarVertical.vue';
import axios from "axios";
import { ElNotification, ElLoading } from 'element-plus'
import { api } from "../api/api";
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))

const userinfo = ref(JSON.parse(sessionStorage.getItem('userInfo')));


//测试用示例图片 user.img?
var avatarUrl = "";

// 获取数据
const designer_data = ref({
  id: 0,
  name: "",
  birthday: "",
  email: "",
  area: "",
  age: 0,
  style: "",
  tel: "",
  url: "",
  company: "",
  degree: "",
  address: "",
  avatar: ""
})
const showCase = () => {
  axios(api.queryUserId({userid: userinfo.value.id})).then(
      (response) => {
        if (response.status == 200) {
            designer_data.value = response.data[1]
        }
    }
    );
}

//测试数据
designer_data.value = {
  id: 1,
  name: "AAA",
  birthday: "1992-05-01",
  email: "1234566@tongji.edu.cn",
  area: "ShangHai China",
  age: 40,
  style: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  tel: "11111111111",
  url: "https://www.orientalpearltower.com",
  company: "None",
  degree: "Bachelor",
  address: "None"
}

const isEditable = ref(true);
const isEditableSwitch = () =>{
  isEditable.value = !isEditable.value;
}

const changeAge = () =>{
  var birthdays = new Date(designer_data.value.birthday.replace(/-/g, "/"));
  var d = new Date();
  var age =
    d.getFullYear() -
    birthdays.getFullYear() -
    (d.getMonth() < birthdays.getMonth() ||
    (d.getMonth() == birthdays.getMonth() &&
      d.getDate() < birthdays.getDate())
      ? 1
      : 0);
  designer_data.value.age = age;
}

const saveDesignerMsg = () =>{
  axios(api.updateDesigner(designer_data.value)).then(
        (response) => {
            if (response.status == 200) {
              isEditableSwitch();
              ElNotification({
                title: 'Success',
                message: 'Profile updated',
                type: 'success',
              })
            }
        }
    );
}

const cancelDesignerMsg = () =>{
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
              <el-avatar :size="200" :src="designer_data.avatar" />
            </div>
          </el-col>
          <el-col id="messageArea" :span="18">
            <div class="showMsg">
              <h3 id="userName">{{ designer_data.name }}</h3>
              <el-row gutter="120">
                <el-col id="leftArea" :span="12">
                  <div class="msg"><span class="msgTitle">Area:</span><span>{{ designer_data.area }}</span></div>
                  <div class="msg"><span class="msgTitle">Birthday:</span><span>{{ designer_data.birthday }}</span></div>
                  <div class="msg"><span class="msgTitle">Age:</span><span>{{ designer_data.age }}</span></div>
                </el-col>
                <el-col id="rightArea" :span="12">
                  <div class="msg"><span class="msgTitle">Email:</span><span>{{ designer_data.email }}</span></div>
                  <div class="msg"><span class="msgTitle">Tel:</span><span>{{ designer_data.tel }}</span></div>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <div class="msg">
                    <div class="msgTitle">Style:</div>
                    <el-input type="textarea" v-model="designer_data.style" autosize 
                          disabled="false" ></el-input>
                    <!-- <el-text size="larger" >{{ designer_data.style }}</el-text> -->
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="profileBody">
        <h3 class="eidtCheck">Basic Information</h3><button id="editBtn" @click="isEditableSwitch">edit</button>
        <div class="editArea">
          <el-row id="leftArea" gutter="120">
            <el-col :span="12">
              <div class="msg">
                <span class="msgTitle">Name:</span>
                <el-input v-model="designer_data.name" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Area:</span>
                <el-input v-model="designer_data.area" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Birthday:</span>
                <el-date-picker v-model="designer_data.birthday" :disabled="isEditable" editable="false"
                    type="date" size="large" value-format="YYYY-MM-DD" @change="changeAge"/>
              </div>
              <div class="msg">
                <span class="msgTitle">Age:</span>
                <el-input v-model="designer_data.age" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Degree:</span>
                <el-input v-model="designer_data.degree" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Address:</span>
                <el-input v-model="designer_data.address" :disabled="isEditable"></el-input>
              </div>
            </el-col>
            <el-col id="rightArea" :span="12">
              <div class="msg">
                <span class="msgTitle">Company:</span>
                <el-input v-model="designer_data.company" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Tel:</span>
                <el-input v-model="designer_data.tel" :disabled="isEditable"></el-input>
              </div>
              <div class="msg">
                <span class="msgTitle">Email:</span>
                <el-input v-model="designer_data.email" :disabled="isEditable"></el-input>
              </div>
              <div class="msg"><span class="msgTitle">Style:</span></div>
              <div class="msg">
                <el-input type="textarea" v-model="designer_data.style" autosize 
                          :disabled="isEditable"></el-input>
                <!-- <span id="styleText">{{ designer_data.style }}</span> -->
              </div>
            </el-col>
          </el-row>
        </div>
        <h3>Personal Page</h3>
        <div id="personalPage">
          <el-input v-model="designer_data.url" :disabled="isEditable"></el-input>
        </div>
        <el-row gutter="120">
          <el-col :span="12">
            <button id="saveBtn" @click="saveDesignerMsg">Save</button>
          </el-col>
          <el-col :span="12">
            <button id="cancelBtn" @click="cancelDesignerMsg">Cancel</button>
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
.eidtCheck{
  display: inline;
}
#editBtn{
  color: blue;
  font-size: 110%;
  background-color: black;
  border-width: 0;
  border-block-color: black;
  padding: 0 10px;
  margin-left: 5px;
}

.msg {
  font-size: 20px;
  white-space: nowrap;
  margin-bottom: 10px;
}

.msgTitle {
  font-weight: bolder;
  margin-right: 10px;
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

.editArea {
  padding: 5px 20px 0 20px;
  border-style: solid;
  border-radius: 10px;
  border-width: 2px;
  border-color: white;
  margin-bottom: 20px;
  overflow: hidden;
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
  background-color: transparent !important;
}
:deep(.el-input__inner){
  color:white;
  background-color: black;
  font-size: 20px;
  white-space: nowrap;
  height:100%;
  width: 100%;
}
:deep(.el-input__suffix-inner){
  color:white;
  background-color: black;
  font-size: 20px;
  white-space: nowrap;
  height:100%;
  width: 100%;
}

:deep(.el-input__prefix){
  color:white;
  background-color: black;
}
:deep(.el-textarea__inner){
  color:white;
  background-color: black;
  font-size: 20px;
  padding: 0 5px;
  border: 0;
  resize: none;
}


:deep(textarea:disabled ){
  background-color: black !important;
}
</style>
