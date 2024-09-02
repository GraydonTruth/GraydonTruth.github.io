document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angleOffset = 0;

    function drawBinaryTree(x, y, size, angle, depth) {
        if (depth === 0) return;

        const x1 = x + size * Math.cos(angle);
        const y1 = y + size * Math.sin(angle);

        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        const newSize = size * (0.7 + 0.05 * Math.sin(angleOffset));
        drawBinaryTree(x1, y1, newSize, angle - Math.PI / 6, depth - 1);
        drawBinaryTree(x1, y1, newSize, angle + Math.PI / 6, depth - 1);
    }

    function drawParticles() {
        const particles = [];

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 50, // Start from just below the canvas
                radius: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.5
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBinaryTree(canvas.width / 2, canvas.height, canvas.height / 4, -Math.PI / 2, 10);

            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = '#0ff';
                ctx.fill();

                particle.y -= particle.speed;
                if (particle.y < 0) particle.y = canvas.height; // Reset to bottom if it goes above the canvas
            });

            angleOffset += 0.03;
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    drawParticles();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawParticles();
    });
});
