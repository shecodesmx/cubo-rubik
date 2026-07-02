let canvas, ctx, cursor, particlesContainer;
let mouseX, mouseY;
let clickEffect = [];
let trail = [];
let rotation = 0;
const maxTrail = 15;

class ClickParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.hue = Math.random() * 60 + 280;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= 0.02;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function drawCube(x, y, size, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-size/2, -size/2, size, size);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-size/2, -size/2, size, size);
    
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-size/2 + (size/3) * i, -size/2);
        ctx.lineTo(-size/2 + (size/3) * i, size/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2 + (size/3) * i);
        ctx.lineTo(size/2, -size/2 + (size/3) * i);
        ctx.stroke();
    }

    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(size/2, -size/2);
    ctx.lineTo(size/2 + size/3, -size/2 + size/4);
    ctx.lineTo(size/2 + size/3, size/2 + size/4);
    ctx.lineTo(size/2, size/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0066ff';
    ctx.beginPath();
    ctx.moveTo(-size/2, -size/2);
    ctx.lineTo(-size/2 + size/3, -size/2 - size/4);
    ctx.lineTo(size/2 + size/3, -size/2 - size/4);
    ctx.lineTo(size/2, -size/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    cursor = document.querySelector('.cursor');
    particlesContainer = document.getElementById('particles');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mouseX = canvas.width / 2;
    mouseY = canvas.height / 2;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particlesContainer.appendChild(particle);
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    canvas.addEventListener('click', (e) => {
        for (let i = 0; i < 20; i++) {
            clickEffect.push(new ClickParticle(e.clientX, e.clientY));
        }
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    });

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        rotation += 0.03;

        trail.push({ x: mouseX, y: mouseY, rotation: rotation });
        if (trail.length > maxTrail) {
            trail.shift();
        }

        for (let i = 0; i < trail.length; i++) {
            const t = trail[i];
            const alpha = (i / trail.length) * 0.6;
            const size = 40 + (i / trail.length) * 10;
            drawCube(t.x, t.y, size, t.rotation, alpha);
        }

        clickEffect = clickEffect.filter(p => {
            p.update();
            p.draw();
            return p.life > 0;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.addEventListener('DOMContentLoaded', init);