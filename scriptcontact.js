document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Wave and particle settings
    const waveCount = 5;
    const waveSpeed = [0.03, 0.04, 0.05, 0.06, 0.07];
    const waveHeight = [40, 50, 60, 70, 80];
    const colors = ['#00FFFF', '#00CCFF', '#0099FF', '#0066FF', '#0033FF'];

    let waveOffsets = Array(waveCount).fill(0);
    let particles = [];

    // Create particles
    function createParticles() {
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2
            });
        }
    }

    // Draw wave layers
    function drawBinaryWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let layer = 0; layer < waveCount; layer++) {
            const height = waveHeight[layer];
            const speed = waveSpeed[layer];
            const color = colors[layer];

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + height * Math.sin((x + waveOffsets[layer]) * 0.05);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();

            // Update offset for animation
            waveOffsets[layer] -= speed;
            if (waveOffsets[layer] < -canvas.width) {
                waveOffsets[layer] = 0;
            }
        }
    }

    // Draw particles
    function drawParticles() {
        ctx.globalAlpha = 0.8;
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = '#00FFFF';
            ctx.fill();

            // Update particle position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off walls
            if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
            if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;
        });
        ctx.globalAlpha = 1.0;
    }

    // Draw dynamic background
    function drawDynamicBackground() {
        const now = Date.now();
        const hue = (now / 10) % 360;
        ctx.fillStyle = `hsl(${hue}, 50%, 20%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Animate background
    function animateBackground() {
        drawDynamicBackground();
        drawBinaryWave();
        drawParticles();
        requestAnimationFrame(animateBackground);
    }

    // Initialize
    createParticles();
    animateBackground();

    // Resize event
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Mousemove event for ripple effect
    document.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        waveHeight.forEach((_, index) => {
            waveHeight[index] = 40 + 30 * Math.sin(x * 0.01 + index);
        });
    });

    // Click event for creating ripples
    document.addEventListener('click', (event) => {
        const rippleX = event.clientX;
        const rippleY = event.clientY;
        particles.push({
            x: rippleX,
            y: rippleY,
            radius: 5,
            speedX: 0,
            speedY: 0
        });
    });
});
