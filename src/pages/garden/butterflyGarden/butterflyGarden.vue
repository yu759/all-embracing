<template>
  <div class="garden-wrapper">
    <div class="full-grass-bg"></div>

    <div class="vegetation-layer">
      <div
        v-for="(grass, i) in grassBlades"
        :key="'g' + i"
        class="grass-blade"
        :style="grassStyle(grass)"
      ></div>
      <div
        v-for="(flower, i) in flowers"
        :key="'f' + i"
        class="flower-item css-flower"
        :style="flowerStyle(flower)"
      >
        <div
          class="flower-stem"
          :style="{ height: flower.stemHeight + 'px' }"
        ></div>
        <div
          class="flower-head"
          :style="{
            bottom: flower.stemHeight + 'px',
          }"
        >
          <div
            v-for="n in flower.petalCount"
            :key="n"
            class="petal"
            :style="{
              transform: `rotate(${(360 / flower.petalCount) * (n - 1)}deg)`,
            }"
          ></div>
          <div class="flower-center"></div>
        </div>
      </div>
    </div>

    <div class="butterfly-master-container">
      <div
        v-for="(bf, index) in butterflies"
        :key="'bf-' + index"
        class="butterfly-3d"
        :style="{
          left: bf.x + 'px',
          top: bf.y + 'px',
          transform: `rotate(${bf.angle}deg) scale(${bf.scale})`,
          zIndex: 9999,
        }"
      >
        <div class="bf-body-wrapper" :style="{ '--flap-speed': bf.flapSpeed }">
          <div class="wing left">
            <svg viewBox="0 0 100 100">
              <path
                d="M100 100 Q 50 100 10 50 Q 0 0 50 20 Q 100 50 100 100"
                :fill="bf.colors.base1"
                stroke="black"
                stroke-width="2"
              />
              <circle cx="50" cy="50" r="10" :fill="bf.colors.spot1" />
            </svg>
          </div>

          <div class="bf-central-body"></div>

          <div class="wing right">
            <svg viewBox="0 0 100 100">
              <path
                d="M100 100 Q 50 100 10 50 Q 0 0 50 20 Q 100 50 100 100"
                :fill="bf.colors.base1"
                stroke="black"
                stroke-width="2"
              />
              <circle cx="50" cy="50" r="10" :fill="bf.colors.spot1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const flowers = ref([]);
const butterflies = ref([]);
const grassBlades = ref([]);
let animationId = null;

const getRandomColor = (hMin, hMax) =>
  `hsl(${Math.random() * (hMax - hMin) + hMin}, 80%, 60%)`;

const initGarden = () => {
  // 生成花草
  for (let i = 0; i < 60; i++) {
    flowers.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.4 + Math.random() * 0.6,
      stemHeight: 40 + Math.random() * 40,
      petalCount: Math.floor(Math.random() * 4) + 5,
      color: { main: getRandomColor(0, 360), center: "#FFD700" },
    });
  }
  for (let i = 0; i < 100; i++) {
    grassBlades.value.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      height: 40 + Math.random() * 60,
      rotation: -20 + Math.random() * 40,
      delay: Math.random() * -5,
      color: `hsl(120, 60%, ${20 + Math.random() * 20}%)`,
    });
  }
  // 生成蝴蝶 (重点检查此处数据)
  for (let i = 0; i < 15; i++) {
    butterflies.value.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      scale: 0.6 + Math.random() * 0.4,
      angle: 0,
      flapSpeed: 0.15 + Math.random() * 0.1 + "s",
      phase: Math.random() * Math.PI * 2,
      colors: {
        base1: getRandomColor(0, 360, 90, 65), // 基底色：高饱和
        spot1: getRandomColor(0, 360, 80, 50), // 斑点色：稍深
      },
    });
  }
};

const updatePhysics = () => {
  butterflies.value.forEach((bf) => {
    bf.phase += 0.04;
    bf.x += bf.vx + Math.sin(bf.phase) * 2;
    bf.y += bf.vy + Math.cos(bf.phase) * 1;

    if (Math.random() < 0.02) {
      bf.vx += (Math.random() - 0.5) * 2;
      bf.vy += (Math.random() - 0.5) * 2;
    }

    const targetAngle = Math.atan2(bf.vy, bf.vx) * (180 / Math.PI) + 90;
    bf.angle += (targetAngle - bf.angle) * 0.1;

    // 边界检查
    if (bf.x < -50) bf.x = window.innerWidth + 50;
    if (bf.x > window.innerWidth + 50) bf.x = -50;
    if (bf.y < -50) bf.y = window.innerHeight + 50;
    if (bf.y > window.innerHeight + 50) bf.y = -50;
  });
};

const loop = () => {
  updatePhysics();
  animationId = requestAnimationFrame(loop);
};

onMounted(() => {
  initGarden();
  loop();
});

onUnmounted(() => cancelAnimationFrame(animationId));

const flowerStyle = (f) => ({
  left: f.x + "%",
  top: f.y + "%",
  zIndex: Math.floor(f.y),
  position: "absolute",
  // 移除 transform rotation，改用 CSS 动画
  transform: `scale(${f.scale})`,
  "--petal-color": f.color.main,
  "--center-color": f.color.center,
});
const grassStyle = (g) => ({
  left: g.x + "%",
  top: g.y + "%",
  height: g.height + "px",
  transform: `rotate(${g.rotation}deg)`,
  "--grass-color": g.color,
  animationDelay: g.delay + "s",
  zIndex: Math.floor(g.y),
});
</script>

<style scoped>
@import "./style.css";
</style>