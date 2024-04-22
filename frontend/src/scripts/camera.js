import { toSphereCoordinates, toWGSCoordinates } from './utils'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
// 相机飞向函数
// 始终 lookat 地球，飞向目标点之前先退回到与目标点中心的位置上
export const flyToWithMid = (camera, target, callback) => {
    //相机初始位置
    let camera_start_loc = toWGSCoordinates(-camera.position.x, camera.position.y, -camera.position.z)
    //中点位置
    let mid_loc = {}
    mid_loc.lon = (camera_start_loc.lon + target.lon) / 2;
    mid_loc.lat = (camera_start_loc.lat + target.lat) / 2;
    //中点的海拔高度固定
    mid_loc.alt = 800
    // 第一阶段动画，相机从当前点飞向中点
    var tween = new TWEEN.Tween({
        lon: camera_start_loc.lon,
        lat: camera_start_loc.lat,
        alt: camera_start_loc.alt
    });
    //目标为中点，耗时1000ms
    tween.to(mid_loc, 1000);
    //缓动方法：二次方
    // Linear ==> 线性匀速运动效果
    // Quadratic ==> 二次方的缓动（t^2）
    // Cubic ==> 三次方的缓动（）
    // Quartic ==> 四次方的缓动（）
    // Quintic ==> 五次方的缓动
    // Sinusoidal ==> 正弦曲线的缓动（）
    // Exponential ==> 指数曲线的缓动（）
    // Circular ==> 圆形曲线的缓动（）
    // Elastic ==> 指数衰减的正弦曲线缓动（）
    // Back ==> 超过范围的三次方的缓动
    // Bounce ==> 指数衰减的反弹缓动
    tween.easing(TWEEN.Easing.Quadratic.InOut)
    // 每次更新相机位置和朝向
    tween.onUpdate(function (pos) {
        let newPos = toSphereCoordinates(pos.lat, pos.lon, pos.alt)
        camera.position.set(-newPos.x, newPos.y, -newPos.z);
    });
    // 第二阶段动画，从中点飞向终点
    var tweenBack = new TWEEN.Tween({
        lon: mid_loc.lon,
        lat: mid_loc.lat,
        alt: mid_loc.alt
    });
    tweenBack.to(target, 1000);
    tweenBack.easing(TWEEN.Easing.Quadratic.InOut)
    tweenBack.onUpdate(function (pos) {
        let newPos = toSphereCoordinates(pos.lat, pos.lon, pos.alt)
        camera.position.set(-newPos.x, newPos.y, -newPos.z);
    });
    //全部结束后回调
    tweenBack.onComplete(() => {
        callback(target.id)
    });
    // 两个动画前后连接
    tween.chain(tweenBack);
    tween.start();
}



// 相机飞向函数
// 始终 lookat 地球，直接飞向目标点
export const flyTo = (camera, target, callback) => {
    //相机初始位置
    let camera_start_loc = toWGSCoordinates(-camera.position.x, camera.position.y, -camera.position.z)
    var tween = new TWEEN.Tween({
        lon: camera_start_loc.lon,
        lat: camera_start_loc.lat,
        alt: camera_start_loc.alt
    });
    //目标为中点，耗时1000ms
    tween.to(target, 1800);
    //缓动方法：二次方
    tween.easing(TWEEN.Easing.Quadratic.InOut)
    // 每次更新相机位置和朝向
    tween.onUpdate(function (pos) {
        let newPos = toSphereCoordinates(pos.lat, pos.lon, pos.alt)
        camera.position.set(-newPos.x, newPos.y, -newPos.z);
    });
    //全部结束后回调
    tween.onComplete(() => {
        callback(target.id)
    });
    tween.start();
}



export const flyToHeart = (camera,target,callback) => {
    //相机初始位置
    let camera_start_loc = toWGSCoordinates(-camera.position.x, camera.position.y, -camera.position.z)
    console.log('camera_start_loc',camera_start_loc)
    var tween = new TWEEN.Tween({
        lon: camera_start_loc.lon,
        lat: camera_start_loc.lat,
        alt: camera_start_loc.alt
    });
    //目标为中点，耗时1000ms
    console.log('target',target)
    tween.to(target, 1800);
    //缓动方法：二次方
    tween.easing(TWEEN.Easing.Quadratic.InOut)
    // 每次更新相机位置和朝向
    tween.onUpdate(function (pos) {
        pos.lon = pos.lon>180?pos.lon-180:pos.lon;
        let newPos = toSphereCoordinates(pos.lat, pos.lon, pos.alt)
        // console.log(pos)
        camera.position.set(-newPos.x, newPos.y, -newPos.z);
    });
    // //全部结束后回调
    tween.onComplete(() => {
        callback()
    });
    tween.start();
}