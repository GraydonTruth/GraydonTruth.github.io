// scriptmybadges.js

// Background Animation
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gradient;
function createGradient() {
    gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00ffcc');
    gradient.addColorStop(0.5, '#ff00ff');
    gradient.addColorStop(1, '#ff6600');
}

function drawBackground() {
    createGradient();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animateBackground() {
    drawBackground();
    requestAnimationFrame(animateBackground);
}

animateBackground();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Badge Hover Animation
const badges = document.querySelectorAll('.badge');

badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.boxShadow = '0 0 20px #ff00ff';
        badge.style.transform = 'rotate(10deg)';
    });
    badge.addEventListener('mouseleave', () => {
        badge.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.3)';
        badge.style.transform = 'rotate(0deg)';
    });
});

// Scroll Animation
const sections = document.querySelectorAll('section');

function checkScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

window.addEventListener('scroll', checkScroll);
checkScroll();
