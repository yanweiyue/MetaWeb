import * as THREE from 'three'
import { config, elements, groups, animations } from './config'
import { Globe } from './globe';
import { Markers } from './markers';
import { Heart } from './heart';
import { shaders } from './shaders';
import Stats from '../jsm/libs/stats.module.js';
import { GUI } from '../jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from '../jsm/controls/OrbitControls.js';
import { EffectComposer } from '../jsm/postprocessing/EffectComposer.js';// EffectComposer（效果组合器）对象
import { RenderPass } from '../jsm/postprocessing/RenderPass.js';// RenderPass/该通道在指定的场景和相机的基础上渲染出一个新场景
import { CopyShader } from '../jsm/shaders/CopyShader.js'; // 传入了CopyShader着色器，用于拷贝渲染结果
import { ShaderPass } from '../jsm/postprocessing/ShaderPass.js';// ShaderPass/使用该通道你可以传入一个自定义的着色器，用来生成高级的、自定义的后期处理通道
import { UnrealBloomPass } from '../jsm/postprocessing/UnrealBloomPass.js';// BloomPass/形成泛光的效果
import TWEEN from '@tweenjs/tween.js'
export class App {
  constructor(markerdata, containerId) {
    this.markerdata = markerdata
    this.globeContainer = document.getElementById(containerId);
    // console.log(this.markerdata)
    window.app = this;
  }

  init = async () => {
    this.params = {
      exposure: 1,
      bloomStrength: 1,
      bloomThreshold: 0,
      bloomRadius: 0,
      heart_rx:0,
      heart_ry:0,
      heart_rz:0
    };
    this.updateContainer();
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initControls();
    // this.initLight();
    this.initBloom();
    // this.initGUI();

    await this.preload();

    this.setup();
    this.update();

  }

  updateContainer = () => {
    this.width = this.globeContainer.clientWidth;
    this.height = this.globeContainer.clientHeight;
  }

  // 动画
  animate = () => {

    if (animations.breathingLight) {
      if(this.bloomPass.strength<0.6){
        this.arc = true;
      }
      if(this.bloomPass.strength>2.5){
        this.arc = false;
      }
      if(this.arc){
        this.bloomPass.strength += 0.008;
      }else{
        this.bloomPass.strength -= 0.008;
      }

    }
    if (animations.rotateGlobe) {
      groups.globe.rotation.y -= 0.0025;
    }
    TWEEN.update();
  }

  // 预加载
  preload = async () => {
    try {
      const globeTexture = await fetch(config.urls.globeTexture);
      const galaxyTexture = await fetch(config.urls.galaxyTexture);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
  initScene = () => {
    this.scene = new THREE.Scene();
    const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;
    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(BLOOM_SCENE);
  }

  initCamera = () => {
    this.ratio = this.width / this.height;
    this.camera = new THREE.PerspectiveCamera(60, this.ratio, 0.1, 10000);
    this.camera.lookAt(this.scene.position);
    this.camera.position.set(-0.75 * config.sizes.globe * config.sizes.camera_distance_scale, 1.25 * config.sizes.globe * config.sizes.camera_distance_scale, -2 * config.sizes.globe * config.sizes.camera_distance_scale);
  }

  initRenderer = () => {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
    this.renderer.setSize(this.width, this.height);
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.autoClear = false;
    this.renderer.domElement.id = 'globeThree';
    this.globeContainer.appendChild(this.renderer.domElement);
  }

  initControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.enableRotate = true;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 1
    this.controls.dampingFactor = 1
    // console.log(this.controls)
  }

  initLight = () => {
    this.scene.add(new THREE.AmbientLight(0x404040));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    this.camera.add(pointLight);
  }

  initBloom = () => {
    // 初始化效果组合器
    this.bloomComposer = new EffectComposer(this.renderer);
    this.bloomComposer.renderToScreen = false;
    // 添加基本的渲染通道
    this.renderScene = new RenderPass(this.scene, this.camera);
    // 添加辉光通道
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.5, 0.4, 0.85);
    this.bloomPass.threshold = this.params.bloomThreshold;
    this.bloomPass.strength = this.params.bloomStrength;
    this.bloomPass.radius = this.params.bloomRadius;
    // 把基本通道加入到组合器
    this.bloomComposer.addPass(this.renderScene);
    // 把辉光通道加入到组合器
    this.bloomComposer.addPass(this.bloomPass);
    // 初始化最终效果组合器
    this.finalComposer = new EffectComposer(this.renderer);
    this.finalPass = new ShaderPass(new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
      },
      vertexShader: shaders.bloom.vertexShader,
      fragmentShader: shaders.bloom.fragmentShader,
      defines: {}
    }), "baseTexture");
    this.finalPass.needsSwap = true;
    this.finalComposer.addPass(this.renderScene);
    this.finalComposer.addPass(this.finalPass);

  }

  initGUI = () => {
    const gui = new GUI();
    let that = this;
    gui.add(this.params, 'exposure', 0.1, 2).onChange(function (value) {
      that.renderer.toneMappingExposure = Math.pow(value, 4.0);
    });

    gui.add(this.params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
      that.bloomPass.threshold = Number(value);
    });

    gui.add(this.params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
      that.bloomPass.strength = Number(value);
    });

    gui.add(this.params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
      that.bloomPass.radius = Number(value);
    });

    gui.add(config.timeline, 'maxDistance', config.sizes.globe, config.sizes.globe * 5).onChange(function (value) {
      config.timeline.maxDistance = Number(value);
    });
    gui.add(this.params, 'heart_rx', 0.0, 2).onChange(function (value) {
      elements.heart.rotation.set(-Math.PI*value, Math.PI*that.params.heart_ry ,-Math.PI*that.params.heart_rz);
    });
    gui.add(this.params, 'heart_ry', 0.0, 2).onChange(function (value) {
      elements.heart.rotation.set(-Math.PI*that.params.heart_rx, Math.PI*value ,-Math.PI*that.params.heart_rz);
    });
    gui.add(this.params, 'heart_rz', 0.0, 2).onChange(function (value) {
      elements.heart.rotation.set(-Math.PI*that.params.heart_rx, Math.PI*that.params.heart_ry ,-Math.PI*value);
    });
  }
  setup = () => {
        // 添加地球
        groups.main = new THREE.Group();
        groups.main.name = 'Main';
        const globe = new Globe();
        groups.main.add(globe);
        // 添加数据光点
        const markers = new Markers(this.markerdata);
        groups.globe.add(groups.markerPoint);
        groups.globe.add(groups.markerPlumbline);
        const heart = new Heart();
        // 需不需要加爱心
        groups.globe.add(groups.heart);
        app.scene.add(groups.main);
  }

  update = () => {
    this.animate();
    this.controls.update();

    this.renderer.autoClear = false;
    this.renderer.clear();

    this.camera.layers.set(config.scene.BLOOM_SCENE);
    if (this.bloomComposer) { this.bloomComposer.render() };

    this.renderer.clearDepth();

    this.camera.layers.set(config.scene.ENTIRE_SCENE)
    this.finalComposer.render(this.scene, this.camera)

    this.camera.layers.set(config.scene.BLOOM_SCENE);

    requestAnimationFrame(this.update);

    TWEEN.update();
  }


  handleResize = () => {
    this.updateContainer();
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.bloomComposer.setSize(this.width, this.height);
    this.finalComposer.setSize(this.width, this.height);
  }

}