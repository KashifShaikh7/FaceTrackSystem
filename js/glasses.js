const glassesImage = new Image();
glassesImage.src = "./assets/images/glasses.png";

export function drawGlasses(canvas, landmarks) {
    if (!glassesImage.complete) return;

    const ctx = canvas.getContext("2d");

    const leftEye = landmarks[33];
    const rightEye = landmarks[263];

    const leftX = leftEye.x * canvas.width;
    const leftY = leftEye.y * canvas.height;

    const rightX = rightEye.x * canvas.width;
    const rightY = rightEye.y * canvas.height;

    const centerX = (leftX + rightX) / 2;
    const centerY = (leftY + rightY) / 2;

    const eyeDistance = Math.hypot(
        rightX - leftX,
        rightY - leftY
    );

    const angle = Math.atan2(
        rightY - leftY,
        rightX - leftX
    );

    const width = eyeDistance * 2.2;
    const height =
        width *
        (glassesImage.height / glassesImage.width);

    ctx.save();

    ctx.translate(centerX, centerY);
    ctx.rotate(angle);

    ctx.drawImage(
        glassesImage,
        -width / 2,
        -height / 2,
        width,
        height
    );

    ctx.restore();
}