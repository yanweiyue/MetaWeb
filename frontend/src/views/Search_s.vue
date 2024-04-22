 <!--
 * @Author: wangshijie
 * @Date: 2023-08-06 08:51:59
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
import { api } from "../api/api";
// 是否是移动端
const ismobile = ref(JSON.parse(sessionStorage.getItem('ismobile')))


const designer_data = ref([])

// 获取数据
const showCase = () => {
  axios(api.queryUser({role: "supplier"})).then(
      (response) => {
        if (response.status == 200) {
            designer_data.value = response.data.slice(1);
          for(let i=0;i<pageSize&&i<designer_data.value.length;i++){
            showData.value[i]=designer_data.value[i];
          }
        }
    }
    );
}

//测试数据
designer_data.value = [
{
    id:1,
    name:"AAA",
    email:"1234566@tongji.edu.cn",
    area:"ShangHai",
    age:40,
    style:"china",
    tel:"11111111111",
    url:"https://www.orientalpearltower.com"
},
{
    id:2,
    name:"BBB",
    email:"1234566@tongji.edu.cn",
    area:"ShangHai",
    age:40,
    style:"china",
    tel:"11111111111",
    url:"https://www.orientalpearltower.com"
},
{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
            

// 页面显示数据个数：
const pageSize=12;

//初始化
const showData = ref([]);


const changePage = reactive({
    currentPage: 1,
    total: designer_data.value.length
    
});
const handelCurrentChange = (value) =>{
    changePage.currentPage = value;
    
        var i = (value -1) * pageSize;
        var end = value * pageSize;
        var j = 0;
        var arry = [];
        while(i < end){
            if(designer_data.value[i] !=null){
                arry[j++]=designer_data.value[i++];
                continue;
            }
            break;
        }
        showData.value = arry;
}

const jumpToDetail = (url) => {
  window.open(url);
}

onMounted(async () => {
  console.log('onMounted test')
	showCase()
});
</script>

<template>
    <div id="vue">
        <SideBarHorizontal v-if="ismobile" />
        <SideBarVertical v-else />
        <div id="searchMain">
            <div class="searchHead">
                <div class="searchSort">
                    <button id="latest">Lastest Entry</button>
                    <button id="comprehensive">Comprehensive Sorting</button>
                    <button id="hot">Hot Click</button>
                </div>
            </div>
            <div class="searchContent">
                <div class="searchPage">
                    <div class="pageList">
                        <div class="page" v-for="item in showData" :key="item.id">
                            <div class="displayMsg">
                                <el-row>
                                    <el-col id="avatarArea" :span="12">
                                        <div class="showAvatar">
                                            <el-avatar :size="150" :src="item.avatar" />
                                        </div>
                                    </el-col>
                                    <el-col id="messageArea" :span="12">
                                        <div class="showMsg">
                                            <h3 id="userName">{{item.name}}</h3>
                                            <div class="msg"><span>Email:</span><span>{{item.email}}</span></div>
                                            <div class="msg"><span>Area:</span><span>{{item.area}}</span></div>
                                            <div class="msg"><span>Age:</span><span>{{item.age}}</span></div>
                                            <div class="msg"><span>Style:</span><span>{{item.style}}</span></div>
                                            <div class="msg"><span>Tel:</span><span>{{item.tel}}</span></div>
                                            <button id="userBtn" @click="jumpToDetail(item.url)">View Talent</button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentPagination">
                    <el-pagination
                    background 
                    layout="prev, pager, next" 
                    :page-size="pageSize"
                    :total="changePage.total"
                    v-model:current-page="changePage.currentPage"
                    @current-change="handelCurrentChange"
                    hide-on-single-page
                    /> 
                </div>
            </div>
        </div>
    </div>
</template> 

<style scoped>
#vue {
    margin: 0;
    background-color: #444;
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    color: #444;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}

#searchMain {
    width: 100%;
    height:100%;
    background-color: #444;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow-y: scroll;
}

.searchHead {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;
    margin-left: 120px;
}
.searchSort {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* padding-top: 20px;
    padding-bottom: 20px; */
}
#latest,#comprehensive,#hot {
    font-size: large;
    color: white;
    background-color: #a39c9c;
    height: fit-content;
    width: fit-content;
    padding: 5px;
    margin-right: 10px;
}

.searchContent {
    width: 100%;
    min-height: 200px;
}
.searchPage {
    width: 100%;
    padding: 0 0 0 120px;
}
.pageList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

}
.page {
    width: 400px;
    height: 200px;
    background-color: #444;
    border-style:solid;
    border-width: 1px;
    border-color: white;
    margin: 10px 10px 0 0;
}

.showAvatar{
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center; 
    margin: auto;
}
.showMsg{
    width: 100%;
    height: 100%;
    color:white;
    display:grid;
    justify-content: left; 
    text-align: left;
}
.msg{
    white-space: nowrap;
    overflow: hidden;
}
#userName{
    margin: 10px 0 0 0;
}
#userBtn{
    font-size: large;
    color: white;
    background-color: #a39c9c;
    height: fit-content;
    width: fit-content;  
    
}

.contentPagination {
    width: 100%;
    display: flex;
    margin-top: 20px;
    margin-bottom: 10px;
    justify-content: center;
    align-items: center;
}

</style>