import { startCamera } from "./camera.js";
import {
    initFaceTracking,
    drawLandmarks
} from "./faceTracking.js";

const video = document.getElementById("camera");
const canvas = document.getElementById("overlay");
const switchButton = document.getElementById("switch-camera-btn");

const ctx = canvas.getContext("2d");

let currentFacingMode = "user";
let faceLandmarker = null;

async function updateCamera() {
    await startCamera(video, currentFacingMode);

    if (currentFacingMode === "user") {
        video.style.transform = "scaleX(-1)";
        canvas.style.transform = "scaleX(-1)";
    } else {
        video.style.transform = "scaleX(1)";
        canvas.style.transform = "scaleX(1)";
    }

    console.log(`Using ${currentFacingMode} camera`);
}

async function startFaceTracking() {
    faceLandmarker = await initFaceTracking();

    const track = async () => {
        if (
            video.readyState >= 2 &&
            faceLandmarker
        ) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const result =
                faceLandmarker.detectForVideo(
                    video,
                    performance.now()
                );

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            if (
                result.faceLandmarks &&
                result.faceLandmarks.length > 0
            ) {
                drawLandmarks(
                    canvas,
                    result.faceLandmarks[0]
                );
            }
        }

        // ~FrameRate FPS
        requestAnimationFrame(track);
    };

    track();
}

window.addEventListener(
    "DOMContentLoaded",
    async () => {
        try {
            await updateCamera();
            await startFaceTracking();
        }
        catch (error) {
            console.error(
                "Startup failed:",
                error
            );
        }
    }
);

switchButton.addEventListener(
    "click",
    async () => {
        try {
            currentFacingMode =
                currentFacingMode === "user"
                    ? "environment"
                    : "user";

            await updateCamera();
        }
        catch (error) {
            console.error(
                "Failed to switch camera:",
                error
            );
        }
    }
);