const canvas = document.getElementById("birthday");
const ctx = canvas.getContext("2d");

// Make canvas full screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters = "HAPPY BIRTHDAY! to You Maaz".split("");
let letterIndex = 0;

const fireworks = [];

class Firework {
  constructor(x, y, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetY = targetY;
    this.color = color;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y -= 5;
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.createParticles();
      }
    }

    for (let p of this.particles) {
      p.update();
    }

    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  draw(ctx) {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    for (let p of this.particles) {
      p.draw(ctx);
    }
  }

  createParticles() {
    const text = letters[letterIndex];
    const fontSize = 40;
    ctx.font = `${fontSize}px sans-serif`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = this.color;
    ctx.fillText(text, this.x - textWidth / 2, this.y);

    // For visuals
    for (let i = 0; i < 30; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }

    letterIndex = (letterIndex + 1) % letters.length;
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.02;
  }

  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const targetY = Math.random() * (canvas.height / 2);
    const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    fireworks.push(new Firework(x, y, targetY, color));
  }

  for (let firework of fireworks) {
    firework.update();
    firework.draw(ctx);
  }

  requestAnimationFrame(animate);
}

animate();
