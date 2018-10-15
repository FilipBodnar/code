import * as THREE from 'three'
import './utils/TrackballControls'

let camera;
let controls;
let scene;
let renderer;

function render() {
  renderer.render(scene, camera)
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  controls.handleResize()
  render()
}

function init() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 800

  controls = new THREE.TrackballControls(camera)
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8
  controls.noZoom = false
  controls.noPan = false
  controls.staticMoving = false
  controls.dynamicDampingFactor = 0.3
  controls.keys = [65, 83, 68]
  controls.addEventListener('change', render)


  /* World */
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xcccccc)
  scene.fog = new THREE.FogExp2(0xcccccc, 0.002)

  const pyramid = new THREE.CylinderBufferGeometry(0, 10, 30, 4, 1)
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })

  for (let i = 0; i < 350; i++) {
    const mesh = new THREE.Mesh(pyramid, material)

    mesh.position.x = (Math.random() - 0.5) * 1000
    mesh.position.y = (Math.random() - 0.5) * 1000
    mesh.position.z = (Math.random() - 0.5) * 1000

    mesh.updateMatrix()
    mesh.matrixAutoUpdate = false

    scene.add(mesh)
  }

  const sphere = new THREE.SphereGeometry(3, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2)
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xff00ff, flatShading: true })

  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh(sphere, sphereMaterial)

    mesh.position.x = (Math.random() - 0.5) * 1000
    mesh.position.y = (Math.random() - 0.5) * 1000
    mesh.position.z = (Math.random() - 0.5) * 1000

    mesh.updateMatrix()
    mesh.matrixAutoUpdate = false

    scene.add(mesh)
  }

  /* Lights */
  let light
  light = new THREE.DirectionalLight(0xffffff)
  light.position.set(1, 1, 1)
  scene.add(light)

  light = new THREE.DirectionalLight(0x002288)
  light.position.set(-1, -1, -1)
  scene.add(light)

  light = new THREE.AmbientLight(0x222222)
  scene.add(light)

  /* Renderer */
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  document.getElementById('root').appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  render()
}

function animate() {
  window.requestAnimationFrame(animate)

  controls.update()
}

init()
animate()
