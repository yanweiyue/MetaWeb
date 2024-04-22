import * as THREE from 'three'
import { config, elements, groups, products, animations } from './config'
import { toSphereCoordinates, returnCurveCoordinates, coordinateToPosition, getSplineFromCoords } from './utils'
// import { Marker } from './_marker'
import { shaders } from './shaders'
export class Markers {
  constructor(products) {
    this.products = products;
    this.createPoint();
    this.createPlumbLine();
  }
  createPoint() {
    groups.markerPoint = new THREE.Group();
    groups.markerPoint.name = 'MarkerPoint';
    // 创建实例
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const geometry = new THREE.IcosahedronGeometry(0.5, 15);
    this.point = new THREE.InstancedMesh(geometry, material, this.products.length);
    this.point.layers.set(config.scene.BLOOM_SCENE)
    this.point.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); 
    this.point.instanceMatrix.needsUpdate = true;
    // 遍历给每个实例修改坐标和颜色
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.latitude && product.longitude) {
        let { x, y, z } = toSphereCoordinates(+product.latitude, +product.longitude, +product.altitude);
        matrix.makeTranslation(-x, y, -z);
        matrix.scale(new THREE.Vector3(product.scale, product.scale, product.scale))
        this.point.setMatrixAt(i, matrix);
        let color = new THREE.Color(product.color.substr(0, 7).toLowerCase());
        this.point.setColorAt(i, color);
      }
    }
    groups.markerPoint.add(this.point);
    elements.markerPoint.push(this.point);
    // console.log(this.point);
  }

  createPlumbLine() {
    groups.markerPlumbline = new THREE.Group();
    groups.markerPlumbline.name = 'MarkerPoint';
    for (let i = 0; i < this.products.length; i++) {
      const product = this.products[i];
      if (product.latitude && product.longitude) {
        let { x, y, z } = toSphereCoordinates(+product.latitude, +product.longitude, +product.altitude);
        let scale = (config.sizes.globe / product.altitude)
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0))
        points.push(new THREE.Vector3(x-scale*x, scale*y-y, z-scale*z))
        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        let material = new THREE.LineBasicMaterial({ color:0x999999, linewidth: 1, vertexColors: false, fog: false });
        let plumbline = new THREE.Line(geometry, material);
        plumbline.position.set(-x, y, -z)
        groups.markerPlumbline.add(plumbline);
        elements.markerPlumbline.push(plumbline);
      }
    }
  }
}