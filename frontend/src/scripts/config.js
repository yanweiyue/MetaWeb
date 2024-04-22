export const config = {
	urls: {
		globeTexture: 'https://metaweb.cdn.citory.tech/textures/earth_alpha_noise.png',
		pointTexture: '../assets/imgs/disc.png',
		galaxyTexture: 'https://metaweb.cdn.citory.tech/textures/starmap_2020_4k_gal.webp'
	},
	sizes: {
		globe: 20,
		camera_distance_scale:1.4
		// globeDotSize: 0.2,
		// markers: 0.5,
	},
	scale: {
		points: 0.025,
		markers: 0.015,
		globeScale: 1
	},
	rotation: {
		globe: 0.01
	},
	colors: {
		globeLandColor:'#409EFF',
		atmosphereColor:'rgb(0,155,203)',
	},
	timeline:{
		startDate:new Date('2019-01-01'),
		surfaceDate:new Date('2022-01-01'),
		minDistance:15,
		maxDistance:25,
		markscount:20,
		monthinterval:1
	},
	scene:{
		ENTIRE_SCENE:0,
		BLOOM_SCENE:1
	}
}

export const elements = {
	globe: null,
	atmosphere: null,
	globePoints: null,
	markerPoint: [],
	markerPlumbline:[],
	heart:null
}


export const groups = {
	map: null,
	main: null,
	globe: null,
	atmosphere: null,
	markerPoint:null,
	markerPlumbline:null,
	heart:null
}

export const products = {
	interval: 20000,
	selected: null,
	index: 0
}

export const animations = {
  rotateGlobe: false,
  breathingLight:true
}

