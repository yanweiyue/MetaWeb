import * as THREE from 'three' 
import { shaders } from './shaders'
import { config, elements, groups, products, animations } from './config'
const loader = new THREE.TextureLoader();
export class Globe {
  constructor(radius) {
    this.radius = config.sizes.globe;
    this.geometry = new THREE.SphereGeometry(this.radius, 64, 64);

    groups.globe = new THREE.Group();
    groups.globe.name = 'Globe';

    this.initGlobe();
    this.initBackGlobe();
    // this.initAtmosphere();

    this.initGalaxy();
    return groups.globe;
  }

  initGlobe() {
    const scale = config.scale.globeScale;
    this.globeMaterial = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 1,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      color:config.colors.globeLandColor
    })
    this.globe = new THREE.Mesh(this.geometry, this.globeMaterial);
    this.globe.scale.set(scale, scale, scale);
    this.globe.layers.set(config.scene.ENTIRE_SCENE);
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    let that = this
    textureLoader.load(
      config.urls.globeTexture,
      function (texture) {
        that.globeMaterial.map = texture;
        elements.globe = that.globe;
        groups.map = new THREE.Group();
        groups.map.name = 'Map';
        groups.map.add(that.globe);
        groups.globe.add(groups.map);
      }
    );
  }

  initBackGlobe() {
    const scale = config.scale.globeScale;
    let scaleIndex = 1.01;
    this.backGlobeMaterial = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 0.8, 
      // blending: THREE.AdditiveBlending,
      color:config.colors.globeLandColor
    })
    this.backGlobe = new THREE.Mesh(this.geometry, this.backGlobeMaterial);
    this.globe.layers.set(config.scene.ENTIRE_SCENE);
    this.backGlobe.scale.set(scale * scaleIndex, scale * scaleIndex, scale * scaleIndex);
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    let that = this
    textureLoader.load(
      config.urls.globeTexture,
      function (texture) {
        that.backGlobeMaterial.map = texture;
        elements.backGlobe = that.backGlobe;
        groups.backGlobe = new THREE.Group();
        groups.backGlobe.name = 'backGlobe';
        groups.backGlobe.add(that.backGlobe);
        groups.globe.add(groups.backGlobe);
      }
    );
  }

  initAtmosphere() {
    this.atmosphereMaterial = this.createGlobeAtmosphere();
    this.atmosphere = new THREE.Mesh(this.geometry, this.atmosphereMaterial)
    this.globe.layers.set(config.scene.ENTIRE_SCENE);
    this.atmosphere.scale.set(1.2, 1.2, 1.2);
    elements.atmosphere = this.atmosphere;

    groups.atmosphere = new THREE.Group();
    groups.atmosphere.name = 'Atmosphere';

    groups.atmosphere.add(this.atmosphere);
    groups.globe.add(groups.atmosphere);
  }

  initGalaxy() {
    // Galaxy
    let radius = config.sizes.globe * 20;
    let galaxyGeometry = new THREE.SphereGeometry(radius, 32, 32);
    let galaxyMaterial = new THREE.MeshBasicMaterial({
      side: THREE.BackSide
    });
    let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
    let textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = true;
    textureLoader.load(
      config.urls.galaxyTexture,
      function (texture) {
        galaxyMaterial.map = texture;

        elements.galaxy = galaxy;

        groups.galaxy = new THREE.Group();
        groups.galaxy.name = 'galaxy';

        groups.galaxy.add(galaxy);
        groups.globe.add(groups.galaxy);
      }
    );
  }

  createGlobeAtmosphere() {
    return new THREE.ShaderMaterial({
      vertexShader: shaders.atmosphere.vertexShader,
      fragmentShader: shaders.atmosphere.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(config.colors.atmosphereColor) },
      }
    });
  }
}