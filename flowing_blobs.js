const canvas = document.getElementById('flowingBlobsCanvas');
const ctx = canvas.getContext('2d');
// --- SETTINGS ---
const numberOfBlobs = 10; // Number of blobs
const minBlobRadius = 30; // Minimum blob radius
const maxBlobRadius = 70; // Maximum blob radius
const minBlobSpeed = 0.2; // Minimum movement speed
const maxBlobSpeed = 0.8; // Maximum movement speed
const baseColorHue = 220; // Base hue for the color (bluish)
const hueVariation = 30; // Variation in hue
const colorSaturation = 70; // Color saturation
const colorLightness = 60; // Color lightness
const opacity = 0.6; // Base opacity of the blobs
const blurAmount = 2; // Amount of blur to create soft edges
// --- END SETTINGS ---
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const blobs = [];
function random(min, max) {
    return Math.random() * (max - min) + min;
}
class Blob {
    constructor(x, y, radius, color, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
    }
    draw() {
        ctx.beginPath();
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.filter = 'none'; // Reset filter
        ctx.closePath();
    }
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        // Bounce off the edges with some damping
        const dampingFactor = 0.8;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocityX = -this.velocityX * dampingFactor;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocityY = -this.velocityY * dampingFactor;
        }
        this.draw();
    }
}
function createBlobs() {
    for (let i = 0; i < numberOfBlobs; i++) {
        const radius = random(minBlobRadius, maxBlobRadius);
        const x = random(radius, canvas.width - radius);
        const y = random(radius, canvas.height - radius);
        const hue = baseColorHue + random(-hueVariation, hueVariation);
        const color = `hsla(${hue}, ${colorSaturation}%, ${colorLightness}%, ${opacity})`;
        const speed = random(minBlobSpeed, maxBlobSpeed);
        const velocityX = (Math.random() - 0.5) * speed;
        const velocityY = (Math.random() - 0.5) * speed;
        blobs.push(new Blob(x, y, radius, color, velocityX, velocityY));
    }
}
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blobs.forEach(blob => {
        blob.update();
    });
}
createBlobs();
animate();
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Re-initialize blobs on resize for a better effect
    blobs.length = 0;
    createBlobs();
});