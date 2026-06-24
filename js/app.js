import { startCamera } from "./camera.js";

const video = document.getElementById("camera");
const switchButton = document.getElementById("switch-camera-btn");

let currentFacingMode = "user";

window.addEventListener("DOMContentLoaded", async () => {
    await startCamera(video, currentFacingMode);
});

switchButton.addEventListener("click", async () => {
    currentFacingMode =
        currentFacingMode === "user"
            ? "environment"
            : "user";

    await startCamera(video, currentFacingMode);

    console.log("Switched to:", currentFacingMode);
});