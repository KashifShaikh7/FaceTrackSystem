import { startCamera } from "./camera.js";
import {
    initFaceTracking,
    drawLandmarks
} from "./faceTracking.js";
import { drawGlasses } from "./glasses.js";
import {
    initAR,
    updateGlasses
} from "./arRenderer.js";

const video = document.getElementById("camera");
const canvas = document.getElementById("overlay");
const switchButton = document.getElementById("switch-camera-btn");
const debugButton = document.getElementById("debug-btn");
const glassesButton = document.getElementById("glasses-btn");

const threeCanvas = document.getElementById("three-canvas");

const ctx = canvas.getContext("2d");

let currentFacingMode = "user";
let faceLandmarker = null;

let debugEnabled = false;
let glassesEnabled = false;

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
                const landmarks =
                    result.faceLandmarks[0];

                const leftEye =
                    landmarks[33];

                const rightEye =
                    landmarks[263];

                const leftX =
                    leftEye.x * canvas.width;

                const leftY =
                    leftEye.y * canvas.height;

                const rightX =
                    rightEye.x * canvas.width;

                const rightY =
                    rightEye.y * canvas.height;

                const centerX =
                    (leftX + rightX) / 2;

                const centerY =
                    (leftY + rightY) / 2;

                const eyeDistance =
                    Math.hypot(
                        rightX - leftX,
                        rightY - leftY
                    );

                const angle =
                    Math.atan2(
                        rightY - leftY,
                        rightX - leftX
                    );

                // PNG glasses
                if (glassesEnabled) {
                    drawGlasses(
                        canvas,
                        landmarks
                    );
                }

                // 3D glasses
                updateGlasses(
                    centerX,
                    centerY,
                    eyeDistance,
                    angle
                );

                // Debug dots
                if (debugEnabled) {
                    drawLandmarks(
                        canvas,
                        landmarks
                    );
                }
            }
        }

        // ~FrameRate FPS
        requestAnimationFrame(track);
    };

    track();
}

debugButton.addEventListener(
    "click",
    () => {

        debugEnabled =
            !debugEnabled;

        debugButton.textContent =
            debugEnabled
                ? "Hide Dots"
                : "Show Dots";

        if (!debugEnabled) {
            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );
        }
    }
);

glassesButton.addEventListener(
    "click",
    () => {

        glassesEnabled =
            !glassesEnabled;

        glassesButton.textContent =
            glassesEnabled
                ? "Hide Glasses"
                : "Show Glasses";
    }
);

window.addEventListener(
    "DOMContentLoaded",
    async () => {
        try {

            await updateCamera();

            await initAR(
                threeCanvas
            );

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