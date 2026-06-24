import {
    FaceLandmarker,
    FilesetResolver
}
from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm";

let faceLandmarker;

export async function initFaceTracking() {

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(
        vision,
        {
            baseOptions: {
                modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
            },

            runningMode: "VIDEO",

            numFaces: 1
        }
    );

    console.log("Face tracker ready");

    return faceLandmarker;
}

export function drawLandmarks(
    canvas,
    landmarks
) {

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!landmarks) return;

    ctx.fillStyle = "#00ff00";

    for (const point of landmarks) {

        const x =
            point.x * canvas.width;

        const y =
            point.y * canvas.height;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}