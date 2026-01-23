<template>
  <div class="app-container ocean-wiki dynamic-bg">
    <nav class="nav-header">
      <button @click="$router.back()" class="back-btn">
        <ArrowLeftOutlined />返回百科
      </button>
      <h1 class="page-title">海洋生物百科</h1>
    </nav>

    <div class="bubbles-container">
      <div
        v-for="i in 20"
        :key="i"
        class="bubble"
        :style="generateBubbleStyle()"
      ></div>
    </div>

    <main class="wiki-grid">
      <div
        v-for="animal in oceanAnimals"
        :key="animal.id"
        class="animal-card"
        :style="{ '--accent-color': animal.color }"
      >
        <div class="image-wrapper">
          <img :src="animal.image" :alt="animal.name" loading="lazy" />
          <div class="status-tag">{{ animal.status }}</div>
        </div>

        <div class="content">
          <h3 class="name">{{ animal.name }}</h3>
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
import { ref, computed } from "vue";
import "./style.css";
import { ArrowLeftOutlined } from "@ant-design/icons-vue";

// 海洋生物数据库
const oceanAnimals = computed(() => {
  const data = [
    {
      id: 1,
      name: "座头鲸",
      trait: "海洋歌手，自由洄游",
      habitat: "全球各大洋",
      behavior:
        "以复杂的歌声和跃出水面著称，有季节性迁徙行为，捕食时使用气泡网",
      latin: "Megaptera",
      status: "无危",
      color: "#0277bd",
      keyword: "whale",
    },
    {
      id: 2,
      name: "蓝鲸",
      trait: "地球史上最大的哺乳动物",
      habitat: "深海海域",
      behavior:
        "地球上最大的动物，以磷虾等小型甲壳动物为食，单独或成对活动，迁徙距离长",
      latin: "B. musculus",
      status: "濒危",
      color: "#01579b",
      keyword: "bluewhale",
    },
    {
      id: 3,
      name: "大白鲨",
      trait: "海洋中的顶级掠食者",
      habitat: "沿岸及开放海域",
      behavior: "独居，以海豹、海狮、鱼类等为食，采用伏击和突袭的捕食方式",
      latin: "C. carcharias",
      status: "易危",
      color: "#455a64",
      keyword: "shark",
    },
    {
      id: 4,
      name: "赤蠵龟",
      trait: "跨越重洋的旅行者",
      habitat: "热带及温带海域",
      behavior:
        "洄游性海龟，以底栖无脊椎动物如螃蟹、海螺等为食，产卵时会回到出生地",
      latin: "Caretta",
      status: "易危",
      color: "#2e7d32",
      keyword: "turtle",
    },
  ];

  return data.map((item) => ({
    ...item,
    image: `https://loremflickr.com/400/300/${item.keyword},wildlife?lock=${
      item.id + 300
    }`,
  }));
});

const viewDetail = (id) => {
  // 跳转到详情页
  $router.push(`/detail/${id}`);
};

// 生成气泡样式
const generateBubbleStyle = () => {
  const size = 10 + Math.random() * 20;
  return {
    left: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 5}s`,
  };
};
</script>

<style scoped>
/* 背景：深邃海洋蓝 */
.ocean-wiki.dynamic-bg {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 30%, #0d47a1 0%, #001324 100%);
  color: #e3f2fd;
  padding: 40px 6%;
  position: relative;
  overflow-x: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.6)
  );
  animation: rise linear infinite;
}

@keyframes rise {
  0% {
    transform: translateY(110vh) scale(1);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-10vh) scale(1.5);
    opacity: 0;
  }
}
</style>