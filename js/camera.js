let currentStream = null;

export async function startCamera(video, facingMode = "user") {
    try {
        stopCamera();

        currentStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode
            },
            audio: false
        });

        video.srcObject = currentStream;

        console.log(`Camera started: ${facingMode}`);
    }
    catch (error) {
        console.error("Camera error:", error);
    }
}

export function stopCamera() {
    if (!currentStream) return;

    currentStream.getTracks().forEach(track => {
        track.stop();
    });

    currentStream = null;
}