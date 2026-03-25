import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";

import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./matcap.png");

const material = new THREE.MeshMatcapMaterial({ matcap: texture });
material.side = THREE.DoubleSide;

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 2);
scene.add(ambientLight, directionalLight);

const fontLoader = new FontLoader();

fontLoader.load(
  "https://cdn.jsdelivr.net/npm/three@0.127.0/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    console.log("Font loaded");
    const textGeometry = new TextGeometry("Hello Three.js", {
      font: font,
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    textGeometry.center();

    const textMesh = new THREE.Mesh(textGeometry, material);
    scene.add(textMesh);
  },
);

console.time("donut");

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

for (let i = 0; i < 100; i++) {
  const donut = new THREE.Mesh(donutGeometry, material);

  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;

  scene.add(donut);
}

console.timeEnd("donut");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const canvas = document.querySelector(".webgl");
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const helper = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(helper);
};
helper();
