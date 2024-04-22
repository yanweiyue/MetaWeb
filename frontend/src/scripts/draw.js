import * as THREE from 'three'
import { config, elements, groups, animations } from './config'
import { numToDate, toSphereCoordinates } from '../scripts/utils'
import axios from "axios";
import { api } from "../api/api";
export function drawGlobeThree(app) {
    let c = document.getElementById("globeThree"); // 获取html的canvas对象
    if (c == null) {
        app.init()// 如果页面內没有 c 就初始化 canvas 
    } else {
        location.reload() // 页面内有了，就刷新
    }
    window.onresize = () => {
        app.handleResize()
    }
    app.update()
}


// 鼠标点选相关
export function onClick(event, containerId) {
    let globeContainer = document.getElementById(containerId);
    if (!globeContainer) {
        return ;
    }
    let width = globeContainer.clientWidth, height = globeContainer.clientHeight;
    // 点击屏幕创建一个向量
    var vector = new THREE.Vector3((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1, 0.5);
    // 将屏幕的坐标转换成三维场景中的坐标
    vector = vector.unproject(app.camera);
    // console.log(vector)
    // console.log(app.camera)
    var ray = new THREE.Raycaster(app.camera.position, vector.sub(app.camera.position).normalize());
    // 选取发光层的点
    ray.layers.set(config.scene.BLOOM_SCENE);
    var intersects = ray.intersectObjects(elements.markerPoint);
    // console.log(intersects);
    if (intersects.length > 0) {
        const instance = intersects[0];
        return instance
    }
    if(elements.heart){
        var intersects_heart = ray.intersectObject(elements.heart);
        // console.log(intersects_heart);
        if (intersects_heart.length > 0) {
            console.log('click heart')
            return 1290
        }
    }
    return null;
}


export async function get_dashboard_content_detail(instanceId, dashboard_content_data) {
    if (instanceId) {
        let id = dashboard_content_data[instanceId]['name']
        // console.log(dashboard_content_data[instanceId])
        // console.log(`id: ${id}`)
        return new Promise((resolve, reject) => {
            axios(api.dashboard_detail_content({ id: id })).then(
                (response) => {
                    if (response.status == 200 && response.data.status) {
                        // console.log(response.data.data)
                        resolve(response.data.data)
                    }
                }
            ).catch(error => { reject(error) });
        })
    }
}


export function timeSliderInput(val, dashboard_content_data) {
    let point = elements.markerPoint[0];
    const matrix = new THREE.Matrix4();
    let startDate = numToDate(val[0])
    let endDate = numToDate(val[1])
    for (let i = 0; i < dashboard_content_data.length; i++) {
        const product = dashboard_content_data[i];
        if (product.latitude && product.longitude) {
            if (product.date < startDate || product.date > endDate) {
                matrix.scale(new THREE.Vector3(0, 0, 0))
                point.setMatrixAt(i, matrix);
                point.instanceMatrix.needsUpdate = true;
                elements.markerPlumbline[i].visible = false;
            }
            else {
                let { x, y, z } = toSphereCoordinates(+product.latitude, +product.longitude, +product.altitude);
                matrix.makeTranslation(-x, y, -z);
                matrix.scale(new THREE.Vector3(product.scale, product.scale, product.scale))
                point.setMatrixAt(i, matrix);
                point.instanceMatrix.needsUpdate = true;
                elements.markerPlumbline[i].visible = true;
            }
        }
    }
}

