<template>
  <div class="app-container amphibia-wiki dynamic-bg">
    <nav class="nav-header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeftOutlined /> 返回百科
      </button>
      <h1 class="page-title">两栖与爬行纲 · 生态百科</h1>
    </nav>

    <div class="rain-container">
      <div
        v-for="i in 60"
        :key="i"
        class="drop"
        :style="generateRainStyle()"
      ></div>
    </div>

    <main class="wiki-grid">
      <div
        v-for="animal in amphibiaAnimals"
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
              查看档案
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

// 两栖/爬行类数据库
const amphibiaAnimals = computed(() => {
  const data = [
    {
      id: 1,
      name: "扬子鳄",
      trait: "史前遗民，江河隐士",
      habitat: "长江中下游湿地、沼泽",
      order: "鳄目",
      behavior:
        "肉食性，主要捕食鱼类、鸟类和小型哺乳动物。夜间活动，善于潜伏偷袭",
      latin: "Alligator sinensis",
      status: "极危",
      color: "#3e2723",
      keyword: "crocodile",
    },
    {
      id: 2,
      name: "中国大鲵",
      trait: "活化石，鸣声如婴",
      habitat: "清澈、低温的山间溪流",
      order: "有尾目",
      behavior:
        "肉食性，以水生昆虫、鱼、虾等为食。夜间活动，视力差，依靠嗅觉和触觉捕食",
      latin: "Andrias davidianus",
      status: "极危",
      color: "#5d4037",
      keyword: "salamander",
    },
    {
      id: 3,
      name: "华西树蛙",
      trait: "雨林跳跃者，绿背红腹",
      habitat: "热带、亚热带森林叶片",
      order: "无尾目",
      behavior:
        "以昆虫为食，白天隐蔽在树叶背面，夜间活跃。繁殖期在雨季，雄性鸣叫吸引雌性",
      latin: "Rhacophorus",
      status: "无危",
      color: "#7cb342",
      keyword: "frog",
    },
    {
      id: 4,
      name: "金钱龟",
      trait: "三线闭壳，福寿象征",
      habitat: "丘陵地带、溪流、池塘",
      order: "龟鳖目",
      behavior:
        "杂食性，吃植物、昆虫、小鱼等。白天活动，性情温和，遇到危险时将头尾四肢缩入壳中",
      latin: "Cuora trifasciata",
      status: "极危",
      color: "#8d6e63",
      keyword: "turtle",
    },
  ];

  return data.map((item) => ({
    ...item,
    image: `https://loremflickr.com/400/300/${item.keyword},nature?lock=${
      item.id + 600
    }`,
  }));
});

const viewDetail = (id) => {
  // 跳转到详情页
  $router.push(`/detail/${id}`);
};

// 生成雨滴随机样式
const generateRainStyle = () => {
  const speed = 0.5 + Math.random() * 1; // 雨下得很快
  return {
    left: `${Math.random() * 100}%`,
    height: `${15 + Math.random() * 20}px`, // 雨滴是长条状
    animationDuration: `${speed}s`,
    animationDelay: `${Math.random() * 2}s`,
    opacity: 0.1 + Math.random() * 0.4,
  };
};
</script>

<style scoped>
/* 背景：潮湿沼泽般的暗绿/灰黑色 */
.amphibia-wiki.dynamic-bg {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 30%, #263238 0%, #000a12 100%);
  color: #cfd8dc;
  padding: 40px 6%;
  position: relative;
  overflow-x: hidden;
}

.content {
  padding: 20px;
}
.top-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-tag {
  font-size: 11px;
  color: #81c784;
  border: 1px solid #81c784;
  padding: 1px 6px;
  border-radius: 4px;
}

.detail-btn:hover {
  background: #388e3c;
}

/* 雨滴动画 */
.rain-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.drop {
  position: absolute;
  width: 1px; /* 雨滴很细 */
  background: linear-gradient(
    to bottom,
    rgba(129, 199, 132, 0),
    rgba(129, 199, 132, 0.5)
  );
  animation: rainDrop linear infinite;
  top: -50px;
}

@keyframes rainDrop {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(110vh);
  }
}
</style>