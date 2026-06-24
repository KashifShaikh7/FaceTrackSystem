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

    glasses.scale.set(
        1,
        1,
        1
    );

    scene.add(glasses);

    console.log("GLB Loaded");

    animate();
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
    x,
    y,
    scale,
    rotation
) {
    if (!glasses) return;

    glasses.position.set(
        x,
        y,
        0
    );

    glasses.scale.setScalar(
        scale
    );

    glasses.rotation.z =
        rotation;
}