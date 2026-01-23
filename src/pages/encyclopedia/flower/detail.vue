<template>
  <div class="app-container flower-detail dynamic-bg">
    <div class="floating-petals-container">
      <div v-for="i in 28" :key="i" :class="['petal', 'p' + i]"></div>
    </div>

    <nav class="nav-header">
      <button @click="$router.back()" class="back-btn">← 返回百科</button>
    </nav>

    <main v-if="currentFlower" class="detail-content">
      <section class="hero-card">
        <div class="hero-image">
          <img :src="getImageUrl(flowerName)" :alt="flowerName" />
          <div class="title-overlay">
            <h1>{{ flowerName }} · {{ currentFlower.enName || "Flower" }}</h1>
            <p class="honor-tag">“{{ currentFlower.honor }}”</p>
          </div>
        </div>
        <div class="quick-facts">
          <div class="fact-item">
            <span>科属：</span>{{ currentFlower.scientificName }}
          </div>
          <div class="fact-item">
            <span>花期：</span>{{ currentFlower.season }}
          </div>
          <div class="fact-item">
            <span>地位：</span>{{ currentFlower.status }}
          </div>
        </div>
      </section>

      <section class="info-section">
        <h2 class="section-title">🌿 生长习性</h2>
        <div class="habit-grid">
          <div class="habit-card" v-for="(val, key) in habitMapping" :key="key">
            <span class="icon">{{ val.icon }}</span>
            <h4>{{ val.label }}</h4>
            <p>{{ currentFlower.habits[key] }}</p>
          </div>
        </div>
      </section>

      <section class="info-section">
        <h2 class="section-title">🌸 名优品种鉴赏</h2>
        <div class="variety-list">
          <div
            v-for="v in currentFlower.varieties"
            :key="v.name"
            class="variety-item"
          >
            <div class="v-img">
              <img
                :src="`https://loremflickr.com/200/200/${flowerName},flower?lock=${v.name.length}`"
              />
            </div>
            <div class="v-info">
              <h3>{{ v.name }}</h3>
              <p class="v-tag" :style="{ color: v.color }">{{ v.type }}</p>
              <p class="v-desc">{{ v.desc }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { FLOWER_DETAILS } from "./data.js"; // 导入刚才的数据

const route = useRoute();
const flowerName = computed(() => route.query.name || "牡丹"); // 从 URL 获取名字

const currentFlower = computed(() => FLOWER_DETAILS[flowerName.value]);

const habitMapping = {
  light: { label: "光照", icon: "☀️" },
  temp: { label: "温度", icon: "🌡️" },
  water: { label: "水分", icon: "💧" },
  soil: { label: "土壤", icon: "🌱" },
};

const getImageUrl = (name) => {
  return `https://loremflickr.com/800/400/${name},nature?lock=50`;
};
</script>

<style scoped>
/* 引入之前一致的动态背景样式 */
.flower-detail.dynamic-bg {
  min-height: 100vh;
  background: radial-gradient(
      circle at 50% 30%,
      rgba(255, 245, 250, 0.6) 0%,
      transparent 60%
    ),
    linear-gradient(to bottom, #ffd1ff 0%, #fad0c4 50%, #ff9a9e 100%);
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

/* 导航栏 */
.nav-header {
  max-width: 900px;
  margin: 0 auto 20px;
  position: relative;
  z-index: 10;
}
.back-btn {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  color: #d63384;
  cursor: pointer;
  font-weight: bold;
}

/* 详情卡片主布局 */
.detail-content {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
}

/* 顶部 Banner 卡片 */
.hero-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(214, 51, 132, 0.1);
  margin-bottom: 30px;
}
.hero-image {
  position: relative;
  height: 350px;
}
.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 40px 30px 20px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
}
.title-overlay h1 {
  margin: 0;
  font-size: 2.4rem;
}
.honor-tag {
  font-style: italic;
  opacity: 0.9;
  margin-top: 5px;
}

.quick-facts {
  display: flex;
  padding: 20px;
  justify-content: space-around;
  background: white;
}
.fact-item span {
  color: #d63384;
  font-weight: bold;
}

/* 习性网格 */
.info-section {
  margin-bottom: 40px;
}
.section-title {
  color: #d63384;
  margin-bottom: 20px;
  border-left: 5px solid #d63384;
  padding-left: 15px;
}
.habit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}
.habit-card {
  background: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  transition: 0.3s;
}
.habit-card:hover {
  transform: translateY(-5px);
  background: white;
}
.habit-card .icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 10px;
}
.habit-card h4 {
  margin: 5px 0;
  color: #333;
}
.habit-card p {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

/* 品种列表 */
.variety-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.variety-item {
  display: flex;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  overflow: hidden;
  align-items: center;
}
.v-img {
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}
.v-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.v-info {
  padding: 20px;
}
.v-info h3 {
  margin: 0;
}
.v-tag {
  font-size: 0.8rem;
  font-weight: bold;
  margin: 5px 0;
}
.v-desc {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
}

/* 复用花瓣雨动画 (需要把之前的 .petal p1...p28 的样式也贴进来，由于篇幅原因此处缩写) */
.floating-petals-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}
</style>