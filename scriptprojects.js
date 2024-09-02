document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let angleOffset = 0;
    let colorOffset = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let spiralDepth = 10;
    let spiralAngleChange = Math.PI / 12;

    // 3D Rotation Transformation
    function apply3DRotation(x, y, z, rotationX, rotationY) {
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;

        return {
            x: x1 + canvas.width / 2,
            y: y1 + canvas.height / 2
        };
    }

    // Create a gradient effect for the background
    function drawBackground() {
        const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, `hsl(${(colorOffset + 180) % 360}, 50%, 20%)`);
        gradient.addColorStop(1, '#000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawBinarySpiral(x, y, size, angle, depth, rotationX, rotationY) {
        if (depth === 0) return;

        const perspective = 1 - (depth / spiralDepth);
        const scaledSize = size * perspective;

        const rotatedAngle = angle + rotationX;
        const x1 = x + scaledSize * Math.cos(rotatedAngle);
        const y1 = y + scaledSize * Math.sin(rotatedAngle);
        const z = depth * 10; // Depth as z-coordinate for 3D effect

        const { x: px1, y: py1 } = apply3DRotation(x1, y1, z, rotationX, rotationY);
        const { x: px0, y: py0 } = apply3DRotation(x, y, z, rotationX, rotationY);

        const color = `hsl(${colorOffset % 360}, 100%, 50%)`;
        const lineWidth = 2 + (depth / 10) * perspective;

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(px0, py0);
        ctx.lineTo(px1, py1);
        ctx.stroke();

        drawBinarySpiral(px1, py1, scaledSize, rotatedAngle + spiralAngleChange, depth - 1, rotationX, rotationY);
        drawBinarySpiral(px1, py1, scaledSize, rotatedAngle - spiralAngleChange, depth - 1, rotationX, rotationY);
    }

    function drawParticles() {
        const particles = [];
        const numParticles = 400; // Increased particle count for denser effect

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.5,
                trail: [],
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                dx: Math.random() * 2 - 1,
                dy: Math.random() * 2 - 1,
                gravity: Math.random() * 0.05,
                attractor: Math.random() * 1000 // Random attractor force
            });
        }

        function animateParticles() {
            drawBackground();

            // Draw multiple binary spirals with rotation and perspective
            const numSpirals = 5;
            const rotationIncrement = Math.PI / numSpirals;
            for (let i = 0; i < numSpirals; i++) {
                drawBinarySpiral(
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.height / 4,
                    angleOffset + i * rotationIncrement,
                    spiralDepth,
                    angleOffset + i * rotationIncrement,
                    angleOffset
                );
            }

            particles.forEach(particle => {
                // Draw particle trail with varying alpha
                ctx.beginPath();
                for (let i = 0; i < particle.trail.length; i++) {
                    const alpha = 1 - (i / particle.trail.length);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
                }
                ctx.stroke();

                // Add new trail point
                particle.trail.push({ x: particle.x, y: particle.y });
                if (particle.trail.length > 20) particle.trail.shift(); // Limit trail length

                // Draw particle
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Update particle position with collision detection, wind effect, and gravity
                particle.x += particle.dx;
                particle.y += particle.dy;
                particle.dy += particle.gravity;

                // Bounce particles off canvas edges
                if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

                // Wind effect
                particle.dx += (Math.random() - 0.5) * 0.01;
                particle.dy += (Math.random() - 0.5) * 0.01;

                // Particle attraction
                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (particle.attractor - dist) / 200;
                    particle.dx += (dx / dist) * force;
                    particle.dy += (dy / dist) * force;
                }
            });

            angleOffset += 0.03;
            colorOffset += 0.5;
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

    canvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
});
