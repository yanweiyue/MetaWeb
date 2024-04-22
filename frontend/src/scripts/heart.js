import * as THREE from 'three'
import { config, elements, groups, products, animations } from './config'
import { toSphereCoordinates, returnCurveCoordinates, coordinateToPosition, getSplineFromCoords, toWGSCoordinates } from './utils'
import { OBJLoader } from '../jsm/loaders/OBJLoader.js';
// import { Marker } from './_marker'
import { shaders } from './shaders'
import TWEEN from '@tweenjs/tween.js'
export class Heart {
    constructor() {
        this.createHeart();
    }
    createHeart() {
        groups.heart = new THREE.Group();
        groups.heart.name = 'Heart';
        let heart = null;
        new OBJLoader().load('https://metaweb.cdn.citory.tech/heart.obj', obj => {
            heart = obj.children[0];
            heart.geometry.rotateX(-Math.PI * 0.3);
            //   heart.geometry.translate(0, 0, -40);
            heart.material = new THREE.MeshBasicMaterial({
                color: 0xff5555,
                wireframe: true
            });
            heart.layers.set(config.scene.BLOOM_SCENE);
            heart.position.set(0, 0, -40);
            groups.heart.add(heart);
            elements.heart = heart;
            elements.heart.visible = false
        });
    }
}



export const heartBeat = () => {
    //初始位置
    let a_scale_radio = 1.2;
    let a_coors = {lon:90,lat:0,alt:40}
    elements.heart.position.set(0, 0, -40);
    elements.heart.rotation.set(0, 0, 0);
    // 第一阶段动画，相机从当前点飞向中点
    let tween_a = new TWEEN.Tween({ x: 1, y: 1, z: 1 });
    //目标为中点，耗时1000ms
    tween_a.to({ x: a_scale_radio, y: a_scale_radio, z: a_scale_radio }, 1500);
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
    tween_a.easing(TWEEN.Easing.Back.InOut)
    // 每次更新相机位置和朝向
    tween_a.onUpdate(function (scale) {
        elements.heart.scale.set(scale.x, scale.y, scale.z);

    });
    // 第二阶段动画，从中点飞向终点
    console.log("a_coors", a_coors);
    let tween_b = new TWEEN.Tween({ sx: a_scale_radio, sy: a_scale_radio, sz: a_scale_radio, lon: a_coors.lon, lat: a_coors.lat, alt: a_coors.alt });
    let target_pos = { lat: 31.049286678360613, lon: 121.51305540555364, alt: 24.999703322796016 }
    let end_scale = 0.05
    console.log("target_pos", target_pos);

    tween_b.to({ sx: end_scale, sy: end_scale, sz: end_scale, lon: target_pos.lon, lat: target_pos.lat, alt: target_pos.alt }, 1200);
    tween_b.easing(TWEEN.Easing.Back.In)
    tween_b.onUpdate(function (res) {
        // console.log(res.lat, res.lon, res.alt)
        elements.heart.scale.set(res.sx, res.sy, res.sz);
        let newPos = toSphereCoordinates(res.lat, res.lon, res.alt)
        elements.heart.position.set(-newPos.x, newPos.y, -newPos.z);
    });
    // //全部结束后回调
    tween_b.onComplete(() => {
        console.log("tweening back");
        console.log('end_pos', elements.heart.position)
        elements.heart.rotation.set(-Math.PI * 1.98, Math.PI * 0.088, 0);
    });
    // // 两个动画前后连接
    tween_a.chain(tween_b);
    tween_a.start();
}