document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clocktower settings
    const clocktowerWidth = 40;
    const clocktowerHeight = 300;
    const clocktowerCount = 10;
    const clocktowerSpacing = 50;
    const clocktowerColors = ['#00FFFF', '#00CCFF', '#0099FF', '#0066FF', '#0033FF'];
    const clocktowerInfo = [
        'Problem-Solving: 90%',
        'Communication: 85%',
        'Team Collaboration: 80%',
        'Adaptability: 75%',
        'Leadership: 70%',
        'Time Management: 90%',
        'Customer Service: 85%',
        'Attention to Detail: 95%',
        'Creativity: 80%',
        'Critical Thinking: 85%'
    ];

    let clocktowerOffsets = Array(clocktowerCount).fill(0);
    const rotationSpeed = 0.01;
    const skillHoverDistance = 50;

    // Particle settings
    const particleCount = 150;
    let particles = [];
    const particleBaseColor = '#00FFFF';
    const particleSizeRange = [1, 6];
    const particleSpeedRange = [-3, 3];

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * (particleSizeRange[1] - particleSizeRange[0]) + particleSizeRange[0],
                speedX: Math.random() * (particleSpeedRange[1] - particleSpeedRange[0]) + particleSpeedRange[0],
                speedY: Math.random() * (particleSpeedRange[1] - particleSpeedRange[0]) + particleSpeedRange[0],
                color: particleBaseColor
            });
        }
    }

    function drawBinaryClocktower() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const now = Date.now();
        const scaleFactor = 1 + Math.sin(now * 0.001) * 0.1;

        for (let i = 0; i < clocktowerCount; i++) {
            const color = clocktowerColors[i % clocktowerColors.length];
            const x = i * (clocktowerWidth + clocktowerSpacing) + clocktowerOffsets[i];
            const y = canvas.height / 2 - clocktowerHeight / 2;

            // Save current state
            ctx.save();
            ctx.translate(x + clocktowerWidth / 2, canvas.height / 2);
            ctx.rotate(now * rotationSpeed + i * 0.1);
            ctx.scale(scaleFactor, scaleFactor);
            ctx.fillStyle = color;
            ctx.fillRect(-clocktowerWidth / 2, -clocktowerHeight / 2, clocktowerWidth, clocktowerHeight);
            ctx.restore();

            // Update offset for animation
            clocktowerOffsets[i] -= 0.5;
            if (clocktowerOffsets[i] < -clocktowerWidth) {
                clocktowerOffsets[i] = canvas.width;
            }
        }
    }

    function drawParticles() {
        ctx.globalAlpha = 0.8;
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = particle.color;
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

    function drawDynamicBackground() {
        const now = Date.now();
        const hue = (now / 10) % 360;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `hsl(${hue}, 50%, 20%)`);
        gradient.addColorStop(1, `hsl(${(hue + 180) % 360}, 50%, 20%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function animateBackground() {
        drawDynamicBackground();
        drawBinaryClocktower();
        drawParticles();
        requestAnimationFrame(animateBackground);
    }

    function drawSkillInfo(x, y, info) {
        const radius = 10;
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(info, x, y - radius);
        ctx.restore();
    }

    function handleClocktowerInteraction(x, y) {
        const clocktowerWidthHalf = clocktowerWidth / 2;
        const clocktowerHeightHalf = clocktowerHeight / 2;

        for (let i = 0; i < clocktowerCount; i++) {
            const clocktowerX = i * (clocktowerWidth + clocktowerSpacing) + clocktowerOffsets[i] + clocktowerWidthHalf;
            const clocktowerY = canvas.height / 2;
            const dx = x - clocktowerX;
            const dy = y - clocktowerY;

            if (Math.abs(dx) < clocktowerWidthHalf && Math.abs(dy) < clocktowerHeightHalf) {
                clocktowerOffsets[i] -= dx * 0.1; // Interaction effect
                drawSkillInfo(clocktowerX, clocktowerY, clocktowerInfo[i]);
            }
        }
    }

    // Initialize
    createParticles();
    animateBackground();

    // Resize event
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Mouse interactions
    canvas.addEventListener('mousemove', (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Check for interaction with clocktowers
        handleClocktowerInteraction(mouseX, mouseY);

        // Particle effects based on proximity
        particles.forEach(particle => {
            const dx = particle.x - mouseX;
            const dy = particle.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.radius = Math.max(8, particle.radius + (100 - distance) * 0.1);
                particle.color = `hsl(${(distance / 2) % 360}, 100%, 50%)`;
            } else {
                particle.radius = Math.min(particleSizeRange[1], particle.radius);
                particle.color = particleBaseColor;
            }
        });
    });

    canvas.addEventListener('click', (event) => {
        createParticles();
    });

    // Enable/Disable clocktower interaction
    canvas.addEventListener('dblclick', () => {
        clocktowerInteraction = !clocktowerInteraction;
    });
});
