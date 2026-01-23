<template>
  <div class="app-container">
    <canvas ref="canvasRef"></canvas>
    <div class="overlay-text">Welcome to 2026</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const canvasRef = ref(null);
let ctx = null;
let animationId = null;
let particles = [];
let fireworks = [];
let stars = [];
let flashAlpha = 0;

// 1. 爆炸粒子类
class Particle {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
    this.friction = 0.93;
    this.gravity = 0.15;
    this.decay = Math.random() * 0.01 + 0.005;
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.velocity.y += this.gravity;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= this.decay;
  }

  draw() {
    if (this.alpha < 0.3 && Math.random() > 0.8) return; // 闪烁效果
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// 2. 升空烟火类
class Firework {
  constructor(targetX, targetY) {
    this.x = targetX;
    this.y = window.innerHeight;
    this.targetY = targetY;
    // 计算升空速度：距离越远速度越快，保证节奏感
    const distance = window.innerHeight - targetY;
    this.velocity = -Math.sqrt(distance * 0.25);
    this.friction = 0.99;
    this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
    this.dead = false;
  }

  update() {
    this.velocity *= this.friction;
    this.y += this.velocity;
    // 到达目标高度或速度耗尽时爆炸
    if (this.velocity > -1.5 || this.y <= this.targetY) {
      this.dead = true;
      createHeart(this.x, this.y, this.color);
    }
  }

  draw() {
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const shakeCanvas = () => {
  if (!canvasRef.value) return;
  canvasRef.value.style.transform = `translate(${Math.random() * 6 - 3}px, ${
    Math.random() * 6 - 3
  }px)`;
  setTimeout(() => {
    if (canvasRef.value) canvasRef.value.style.transform = "translate(0, 0)";
  }, 50);
};

const createHeart = (x, y, baseColor) => {
  flashAlpha = 0.15; // 降低瞬间闪光，避免刺眼
  shakeCanvas();

  const count = 220;
  // 使用传入的颜色，但加入色相偏移让心形色彩丰富
  const baseHue = parseInt(baseColor.match(/\d+/)[0]);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const vx = 16 * Math.pow(Math.sin(angle), 3);
    const vy = -(
      13 * Math.cos(angle) -
      5 * Math.cos(2 * angle) -
      2 * Math.cos(3 * angle) -
      Math.cos(4 * angle)
    );

    const stretch = Math.random() * 0.3 + 0.85;
    const color = `hsl(${baseHue + (Math.random() * 30 - 15)}, 100%, 75%)`;

    particles.push(
      new Particle(x, y, color, {
        x: vx * 0.38 * stretch,
        y: vy * 0.38 * stretch,
      })
    );
  }
};

const animate = () => {
  // 背景拖尾：色值与 CSS 渐变底色一致
  ctx.fillStyle = "rgba(9, 10, 15, 0.2)";
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  // 1. 绘制星空
  stars.forEach((s) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    // 恒星微弱闪烁
    if (Math.random() > 0.98) s.opacity = Math.random();
  });

  // 2. 处理爆炸闪光
  if (flashAlpha > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
    ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    flashAlpha -= 0.02;
  }

  // 3. 更新升空烟火
  fireworks = fireworks.filter((f) => !f.dead);
  fireworks.forEach((f) => {
    f.update();
    f.draw();
  });

  // 4. 更新爆炸粒子
  particles = particles.filter((p) => p.alpha > 0);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  animationId = requestAnimationFrame(animate);
};

const handleResize = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
    createStars(); // 重新调整时刷新星空
  }
};

const createStars = () => {
  stars = [];
  for (let i = 0; i < 180; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2,
      opacity: Math.random(),
    });
  }
};

onMounted(() => {
  ctx = canvasRef.value.getContext("2d");
  handleResize();
  createStars();

  window.addEventListener("resize", handleResize);

  // 交互：点击发射
  window.addEventListener("mousedown", (e) => {
    fireworks.push(new Firework(e.clientX, e.clientY));
  });

  // 自动触发逻辑：发射烟火而不是直接产生心形
  const timer = setInterval(() => {
    const tx = Math.random() * window.innerWidth;
    const ty = Math.random() * (window.innerHeight * 0.5);
    fireworks.push(new Firework(tx, ty));
  }, 1400);

  animate();

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(animationId);
    clearInterval(timer);
  });
});
</script>

<style scoped>
:global(body, html) {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  /* overflow: hidden; 防止出现任何滚动条 */
}
.app-container {
  position: fixed; /* 改为 fixed 定位，确保相对于视口 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: radial-gradient(circle at center, #1b2735 0%, #090a0f 100%);
  touch-action: none; /* 防止移动端缩放和滚动 */
}

canvas {
  display: block;
  transition: transform 0.05s linear; /* 平滑震动 */
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-family: "Playfair Display", serif;
  font-size: 3rem;
  letter-spacing: 4px;
  pointer-events: none;
  z-index: 10;
  text-align: center;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #ff69b4, 0 0 40px #ff69b4;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    text-shadow: 0 0 20px #fff, 0 0 40px #ff1493, 0 0 60px #ff1493;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

@media (max-width: 768px) {
  .overlay-text {
    font-size: 1.8rem;
    letter-spacing: 2px;
  }
}
</style>