<template>
  <div class="app-container birds-wiki dynamic-bg">
    <div class="clouds-layer"></div>

    <nav class="nav-header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeftOutlined />返回百科
      </button>
      <h1 class="page-title">飞禽纲 · 云端生态</h1>
    </nav>

    <div class="feathers-container">
      <div
        v-for="i in 30"
        :key="i"
        class="feather-wrapper"
        :style="generateFeatherStyle()"
      >
        <div class="feather-body"></div>
      </div>
    </div>

    <main class="wiki-grid">
      <div
        v-for="bird in birdAnimals"
        :key="bird.id"
        class="animal-card"
        :style="{ '--accent-color': bird.color }"
      >
        <div class="image-wrapper">
          <img :src="bird.image" :alt="bird.name" loading="lazy" />
          <div class="status-tag">{{ bird.status }}</div>
        </div>

        <div class="content">
          <div class="top-line">
            <h3 class="name">{{ bird.name }}</h3>
            <span class="order-tag">{{ bird.order }}</span>
          </div>
          <p class="trait">「{{ bird.trait }}」</p>
          <div class="bio-info">
            <p><span>生境：</span>{{ bird.habitat }}</p>
            <p><span>习性：</span>{{ bird.behavior }}</p>
          </div>
          <div class="footer-actions">
            <span class="latin">{{ bird.latin }}</span>
            <button class="detail-btn" @click="viewDetail(animal.id)">
              档案详情
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import "./style.css";

// 飞禽纲数据库
const birdAnimals = computed(() => {
  const data = [
    {
      id: 1,
      name: "金雕",
      trait: "空中霸主，猛禽之首",
      habitat: "高山悬崖、荒漠",
      order: "鹰形目",
      behavior:
        "独居或成对活动，领地意识极强；高空翱翔时发现猎物后俯冲捕捉，时速可达200公里；有固定的巢域，会在同一地点多年筑巢繁殖",
      latin: "Aquila chrysaetos",
      status: "一级保护",
      color: "#bf360c",
      keyword: "eagle",
    },
    {
      id: 2,
      name: "大火烈鸟",
      trait: "优雅共舞，盐湖红妆",
      habitat: "咸水湖泊、滩涂",
      order: "红鹳目",
      behavior:
        "集群生活，数量可达上万只；通过求偶舞蹈同步繁殖周期；独特的长颈和喙部结构使其能够倒立水中滤食藻类和小型甲壳动物",
      latin: "Phoenicopterus",
      status: "无危",
      color: "#f06292",
      keyword: "flamingo",
    },
    {
      id: 3,
      name: "金刚鹦鹉",
      trait: "丛林虹影，智慧模仿",
      habitat: "热带雨林",
      order: "鹦形目",
      behavior:
        "有复杂的社交行为，通常成对或小群活动；以强大的喙部啃食坚果和水果；能模仿人类语言和各种声音，寿命可达50年以上",
      latin: "Ara macao",
      status: "濒危",
      color: "#d50000",
      keyword: "parrot",
    },
    {
      id: 4,
      name: "帝企鹅",
      trait: "极寒之地的忠诚守护",
      habitat: "南极冰架",
      order: "企鹅目",
      behavior:
        "在极端寒冷环境中通过集群取暖生存，轮流处于群体外围；雄性在冬季负责孵化蛋，期间长达两个月不进食；潜水能力强，可下潜500多米捕食鱼类和鱿鱼",
      latin: "Aptenodytes",
      status: "近危",
      color: "#37474f",
      keyword: "penguin",
    },
  ];
  return data.map((item) => ({
    ...item,
    image: `https://loremflickr.com/400/300/${item.keyword},bird?lock=${
      item.id + 400
    }`,
  }));
});

const viewDetail = (id) => {
  // 跳转到详情页
  $router.push(`/detail/${id}`);
};

// 生成符合空气阻力物理感的羽毛样式
const generateFeatherStyle = () => {
  const duration = 15 + Math.random() * 10; // 极慢下落速度
  const delay = Math.random() * 15;
  const size = 25 + Math.random() * 30;
  const rotateDir = Math.random() > 0.5 ? 1 : -1; // 随机翻转方向

  return {
    left: `${Math.random() * 100}%`,
    "--size": `${size}px`,
    "--rotate-dir": rotateDir,
    animationDuration: `${duration}s`,
    animationDelay: `-${delay}s`,
    filter: `blur(${Math.random() * 1.2}px)`, // 增加景深感
    opacity: 0.5 + Math.random() * 0.5,
  };
};
</script>

<style scoped>
/* --- 1. 大气层视觉基调 --- */
.birds-wiki.dynamic-bg {
  min-height: 100vh;
  /* 模拟平流层至对流层的色彩过渡 */
  background: linear-gradient(
    180deg,
    #001f3f 0%,
    #0066cc 35%,
    #80d8ff 75%,
    #ffffff 100%
  );
  color: #fff;
  padding: 40px 6%;
  position: relative;
  overflow-x: hidden;
}

/* 动态云层：使用 SVG 制造朦胧感 */
.clouds-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400"><path fill="rgba(255,255,255,0.12)" d="M150 230c-30 0-50-20-55-45-25-10-35-40-20-65 10-15 25-25 40-25 10-40 40-75 85-75 35 0 65 20 80 45 15-10 40-10 55 10 25-25 65-30 90-15 20-25 45-40 75-35 35 5 60 35 70 70 25 5 40 35 40 60 0 25-15 50-40 60-10 35-45 55-80 55-20 0-35-5-45-15-20 25-45 35-80 35-25 0-50-10-65-25-20 15-40 25-70 25-25 0-50-10-75-25-10 15-30 25-50 25z"/></svg>');
  background-size: 1200px auto;
  opacity: 0.5;
  pointer-events: none;
  z-index: 1;
  animation: cloudDrift 80s linear infinite;
}

@keyframes cloudDrift {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 1200px 0;
  }
}

/* --- 3. 细腻羽毛系统 --- */
.feathers-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.feather-wrapper {
  position: absolute;
  top: -15%;
  width: var(--size);
  height: calc(var(--size) * 0.35);
  animation: featherPhysics 20s infinite ease-in-out;
}

.feather-body {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 85% 15% 85% 15% / 50% 50% 50% 50%;
  position: relative;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

/* 增加羽轴细节 */
.feather-body::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -5%;
  width: 110%;
  height: 1px;
  background: rgba(200, 230, 255, 0.6);
  transform: translateY(-50%);
}

@keyframes featherPhysics {
  0% {
    top: -15%;
    transform: translateX(0) rotate(calc(20deg * var(--rotate-dir)));
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    transform: translateX(calc(60px * var(--rotate-dir)))
      rotate(calc(60deg * var(--rotate-dir)));
  }
  60% {
    transform: translateX(calc(-40px * var(--rotate-dir)))
      rotate(calc(-40deg * var(--rotate-dir)));
  }
  100% {
    top: 115%;
    transform: translateX(calc(20px * var(--rotate-dir)))
      rotate(calc(100deg * var(--rotate-dir)));
    opacity: 0;
  }
}

.top-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.order-tag {
  font-size: 12px;
  background: rgba(0, 0, 0, 0.25);
  padding: 3px 10px;
  border-radius: 6px;
  color: #e1f5fe;
}

.detail-btn:hover {
  background: #e1f5fe;
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 1.5rem;
  }
}
</style>