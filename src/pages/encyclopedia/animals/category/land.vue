<template>
  <div class="app-container land-wiki dynamic-bg">
    <nav class="nav-header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeftOutlined /> 返回百科
      </button>
      <h1 class="page-title">陆地纲 · 深林生态</h1>
    </nav>

    <div class="floating-leaves-container">
      <div
        v-for="i in 30"
        :key="i"
        class="leaf-wrapper"
        :style="generateLeafStyle()"
      >
        <div class="leaf-body"></div>
      </div>
    </div>

    <main class="wiki-grid">
      <div
        v-for="animal in landAnimals"
        :key="animal.id"
        class="animal-card"
        :style="{ '--accent-color': animal.color }"
      >
        <div class="image-wrapper">
          <img :src="animal.image" :alt="animal.name" loading="lazy" />
          <div class="status-tag">{{ animal.status }}</div>
        </div>

        <div class="content">
          <div class="top-line">
            <h3 class="name">{{ animal.name }}</h3>
            <span class="order-tag">{{ animal.order }}</span>
          </div>
          <p class="trait">「{{ animal.trait }}」</p>
          <div class="bio-info">
            <p><span>生境：</span>{{ animal.habitat }}</p>
            <p><span>习性：</span>{{ animal.behavior }}</p>
          </div>
          <div class="footer-actions">
            <span class="latin">{{ animal.latin }}</span>
            <button class="detail-btn" @click="viewDetail(animal.id)">
              物种档案
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 陆地生物数据库
const landAnimals = computed(() => {
  const data = [
    {
      id: 1,
      name: "东北虎",
      trait: "丛林之王，威严力量",
      habitat: "针阔混交林、红松林",
      behavior: "独居，领地意识极强",
      order: "食肉目",
      latin: "Panthera tigris",
      status: "极危 (CR)",
      color: "#f57c00",
      keyword: "tiger",
    },
    {
      id: 2,
      name: "雪豹",
      trait: "雪山之灵，隐秘行者",
      habitat: "高山裸岩、草甸",
      behavior: "晨昏活动，擅长跳跃",
      order: "食肉目",
      latin: "Panthera uncia",
      status: "濒危 (EN)",
      color: "#9e9e9e",
      keyword: "leopard",
    },
    {
      id: 3,
      name: "大熊猫",
      trait: "活化石，平和谦逊",
      habitat: "高山竹林、针叶林",
      behavior: "每日取食竹子约12小时",
      order: "食肉目",
      latin: "Ailuropoda",
      status: "易危 (VU)",
      color: "#2e7d32",
      keyword: "giantpanda",
    },
    {
      id: 4,
      name: "亚洲象",
      trait: "雨林巨兽，家族记忆",
      habitat: "热带雨林、季雨林",
      behavior: "群居，由雌象领导",
      order: "长鼻目",
      latin: "Elephas maximus",
      status: "濒危 (EN)",
      color: "#795548",
      keyword: "elephant",
    },
  ];

  return data.map((item) => ({
    ...item,
    image: `https://loremflickr.com/400/300/${item.keyword},wildlife?lock=${
      item.id + 100
    }`,
  }));
});

const viewDetail = (id) => {
  // 跳转到详情页
  $router.push(`encyclopedia/animals/category/detail/${id}`);
};

// 生成符合物理重力与空气阻力的落叶样式
const generateLeafStyle = () => {
  const duration = 10 + Math.random() * 8; // 下落周期
  const delay = Math.random() * 10;
  const size = 15 + Math.random() * 20;
  const rotateDir = Math.random() > 0.5 ? 1 : -1;

  return {
    left: `${Math.random() * 100}%`,
    "--size": `${size}px`,
    "--rotate-dir": rotateDir,
    "--sway": `${30 + Math.random() * 50}px`,
    animationDuration: `${duration}s`,
    animationDelay: `-${delay}s`,
    filter: `hue-rotate(${Math.random() * 30}deg) brightness(${
      0.8 + Math.random() * 0.4
    })`,
    opacity: 0.6 + Math.random() * 0.4,
  };
};
</script>

<style scoped>
/* --- 1. 森林基调：深绿渐变与光效 --- */
.land-wiki.dynamic-bg {
  min-height: 100vh;
  /* 模拟森林由暗至明的深度感 */
  background: linear-gradient(
    180deg,
    #050a06 0%,
    #111d14 40%,
    #1b3022 80%,
    #2e4d3a 100%
  );
  color: #e8f5e9;
  padding: 40px 6%;
  position: relative;
  overflow-x: hidden;
}

@keyframes mistMove {
  from {
    background-position: 0 100%;
  }
  to {
    background-position: 2000px 100%;
  }
}

/* --- 4. 物理感落叶 --- */
.floating-leaves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.leaf-wrapper {
  position: absolute;
  top: -10%;
  width: var(--size);
  height: var(--size);
  animation: leafFall linear infinite;
}

.leaf-body {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4caf50 0%, #1b5e20 100%);
  border-radius: 100% 0; /* 典型叶片形状 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
}

/* 增加叶脉效果 */
.leaf-body::after {
  content: "";
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  transform: rotate(45deg);
}

@keyframes leafFall {
  0% {
    top: -10%;
    transform: translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  25% {
    transform: translateX(var(--sway)) rotate(90deg);
  }
  50% {
    transform: translateX(0) rotate(180deg);
  }
  75% {
    transform: translateX(calc(-1 * var(--sway))) rotate(270deg);
  }
  100% {
    top: 110%;
    transform: translateX(0) rotate(360deg);
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
  font-size: 11px;
  background: rgba(129, 199, 132, 0.2);
  color: #81c784;
  padding: 3px 10px;
  border-radius: 6px;
}
.trait {
  color: #a5d6a7;
  font-style: italic;
  font-size: 0.95rem;
  margin-bottom: 15px;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
  .page-title {
    font-size: 1.6rem;
  }
}
</style>