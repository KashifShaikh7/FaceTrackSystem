import {
    FaceLandmarker,
    FilesetResolver
}
from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm";

let faceLandmarker;

let previousLandmarks = null;

// 0 = no smoothing
// 1 = extremely smooth but laggy
const SMOOTHING = 0.2;

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

export function drawLandmarks(canvas, landmarks) {

    const ctx = canvas.getContext("2d");

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (!landmarks) {
        previousLandmarks = null;
        return;
    }

    const smoothedLandmarks = [];

    for (let i = 0; i < landmarks.length; i++) {

        const current = landmarks[i];

        let x = current.x;
        let y = current.y;

        if (previousLandmarks) {

            x =
                previousLandmarks[i].x * SMOOTHING +
                current.x * (1 - SMOOTHING);

            y =
                previousLandmarks[i].y * SMOOTHING +
                current.y * (1 - SMOOTHING);
        }

        smoothedLandmarks.push({
            x,
            y
        });

        ctx.beginPath();

        ctx.arc(
            x * canvas.width,
            y * canvas.height,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#00ff00";
        ctx.fill();
    }

    previousLandmarks = smoothedLandmarks;
}