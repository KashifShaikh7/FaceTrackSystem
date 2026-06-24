import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { GLTFLoader } from "https://unpkg.com/three@0.170.0/examples/jsm/loaders/GLTFLoader.js?module";

let scene;
let camera;
let renderer;
let glasses;

export async function initAR(canvas) {


scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;

renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        2
    );

scene.add(ambientLight);

const loader =
    new GLTFLoader();

const gltf =
    await loader.loadAsync(
        "./assets/models/sunglass1.glb"
    );

glasses = gltf.scene;

// Initial scale
glasses.scale.set(
    0.5,
    0.5,
    0.5
);

scene.add(glasses);

console.log("GLB Loaded");

window.addEventListener(
    "resize",
    onResize
);

animate();


}

function onResize() {


camera.aspect =
    window.innerWidth /
    window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


}

function animate() {


requestAnimationFrame(
    animate
);

renderer.render(
    scene,
    camera
);


}

export function updateGlasses(
centerX,
centerY,
eyeDistance,
angle
) {
if (!glasses) return;


// Convert screen coordinates to Three.js coordinates

const x =
    -((centerX / window.innerWidth) * 2 - 1);

const y =
    -(centerY / window.innerHeight) * 2 + 1;

glasses.position.set(
    x * 3,
    y * 2,
    0
);

// Scale based on eye distance

const scale =
    eyeDistance * 0.01;

glasses.scale.setScalar(
    scale
);

// Rotate based on head tilt

glasses.rotation.z =
    -angle;


}
