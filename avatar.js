import * as THREE from '../libs/three.module.js';
import { GLTFLoader } from '../libs/GLTFLoader.js';

const container = document.querySelector('.avatar-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(light);

let model;
const loader = new GLTFLoader();
loader.load('./assets/avatar.glb', (gltf) => {
  model = gltf.scene;
  model.scale.set(2, 2, 2);
  scene.add(model);
  animate();
});

function animate() {
  requestAnimationFrame(animate);
  if (model) {
    model.rotation.y += 0.005;
  }
  renderer.render(scene, camera);
}

let mouthInterval;

document.addEventListener('avatarSpeaking', () => {
  if (model) startMouthMovement(model);
});

document.addEventListener('avatarStopSpeaking', () => {
  if (model) stopMouthMovement(model);
});

function startMouthMovement(model) {
  const face = model;
  let scaleUp = true;
  mouthInterval = setInterval(() => {
    if (face) {
      face.scale.y = scaleUp ? 2.1 : 2.0;
      scaleUp = !scaleUp;
    }
  }, 120);
}

function stopMouthMovement(model) {
  clearInterval(mouthInterval);
  model.scale.y = 2.0;
}
