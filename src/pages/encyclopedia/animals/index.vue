<template>
  <div class="app-container animal-wiki dynamic-bg">
    <div class="floating-leaves-container">
      <div
        v-for="i in 30"
        :key="i"
        :class="['leaf', 'l' + i]"
        :style="generateLeafStyle()"
      ></div>
    </div>

    <header class="glass-header">
      <div class="glass-content">
        <h1 class="title">万类霜天 · 生态百科</h1>
        <p class="subtitle">中国生物物种名录 · 分类观测站</p>

        <div class="search-bar compact">
          <input
            v-model="searchRaw"
            type="text"
            placeholder="搜寻特定的物种..."
          />
        </div>
      </div>
    </header>

    <main class="wiki-sections">
      <section
        v-for="section in filteredSections"
        :key="section.id"
        class="category-group"
      >
        <div class="section-header">
          <span class="dot"></span>
          <h2 class="section-title">{{ section.categoryName }}</h2>
        </div>

        <div class="horizontal-layout">
          <div class="cards-container">
            <div
              v-for="animal in section.members.slice(0, 3)"
              :key="animal.name"
              class="animal-card"
              :style="{ '--accent-color': animal.color }"
            >
              <div class="image-wrapper">
                <img :src="animal.image" :alt="animal.name" />
                <div class="status-tag">{{ animal.status }}</div>
              </div>
              <div class="content">
                <h3 class="animal-name">{{ animal.name }}</h3>
                <p class="trait-text">「{{ animal.trait }}」</p>
                <div class="footer-mini">
                  <span class="latin">{{ animal.latin }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="more-side-card" @click="$router.push(section.path)">
            <div class="more-content">
              <ArrowRightOutlined />
              <p>探索更多</p>
              <span class="cat-label">{{ section.categoryName }}</span>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="control-footer">
      <a
        href="http://www.especies.cn/baike/taxon/sp2000TaxaTree_2022/Animalia"
        target="_blank"
        class="external-link-btn"
      >
        <span class="icon">🌐</span> 访问“物种2000”中国节点分类树 →
      </a>
      <p class="footer-hint">数据来源：中国生物物种名录2022年度版</p>
    </div>

    <div v-if="filteredSections.length === 0" class="empty-state">
      <p>未发现匹配物种，请尝试切换关键词</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useDebounce } from "@/composables/useDebounce";
import { ArrowRightOutlined } from "@ant-design/icons-vue";

const router = useRouter();
const searchRaw = ref("");
const searchDebounced = useDebounce(searchRaw, 300);

// 分类数据库
const CATEGORY_DATA = [
  {
    id: "land",
    categoryName: "陆地哺乳动物",
    path: "/encyclopedia/animals/category/land",
    members: [
      {
        name: "东北虎",
        trait: "丛林之王",
        latin: "P. tigris",
        status: "极危",
        color: "#f57c00",
        keyword: "tiger",
      },
      {
        name: "雪豹",
        trait: "雪山之灵",
        latin: "P. uncia",
        status: "濒危",
        color: "#9e9e9e",
        keyword: "leopard",
      },
      {
        name: "大熊猫",
        trait: "活化石",
        latin: "Ailuropoda",
        status: "易危",
        color: "#2e7d32",
        keyword: "giantpanda",
      },
    ],
  },
  {
    id: "ocean",
    categoryName: "海洋生物",
    path: "/encyclopedia/animals/category/ocean",
    members: [
      {
        name: "座头鲸",
        trait: "海洋歌手",
        latin: "Megaptera",
        status: "无危",
        color: "#0277bd",
        keyword: "whale",
      },
      {
        name: "蓝鲸",
        trait: "深海巨兽",
        latin: "B. musculus",
        status: "濒危",
        color: "#01579b",
        keyword: "bluewhale",
      },
      {
        name: "大白鲨",
        trait: "顶级猎手",
        latin: "C. carcharias",
        status: "易危",
        color: "#455a64",
        keyword: "shark",
      },
    ],
  },
  {
    id: "birds",
    categoryName: "飞禽百科",
    path: "/encyclopedia/animals/category/birds",
    members: [
      {
        name: "金雕",
        trait: "空中霸主",
        latin: "Aquila",
        status: "一级",
        color: "#bf360c",
        keyword: "eagle",
      },
      {
        name: "红鹳",
        trait: "盐湖红妆",
        latin: "Phoenicopterus",
        status: "无危",
        color: "#f06292",
        keyword: "flamingo",
      },
      {
        name: "金刚鹦鹉",
        trait: "丛林虹影",
        latin: "Ara macao",
        status: "濒危",
        color: "#d50000",
        keyword: "parrot",
      },
    ],
  },
  {
    id: "amphibia",
    categoryName: "两栖与爬行",
    path: "/encyclopedia/animals/category/amphibia",
    members: [
      {
        name: "扬子鳄",
        trait: "江河隐士",
        latin: "Alligator",
        status: "极危",
        color: "#3e2723",
        keyword: "crocodile",
      },
      {
        name: "大鲵",
        trait: "娃娃鱼",
        latin: "Andrias",
        status: "极危",
        color: "#5d4037",
        keyword: "salamander",
      },
      {
        name: "树蛙",
        trait: "雨林跳跃者",
        latin: "Rhacophoridae",
        status: "无危",
        color: "#7cb342",
        keyword: "frog",
      },
    ],
  },
];

// 处理展示数据，包含图片生成
const processedData = computed(() => {
  return CATEGORY_DATA.map((section) => ({
    ...section,
    members: section.members.map((m, i) => ({
      ...m,
      image: `https://loremflickr.com/400/300/${m.keyword},wildlife?lock=${
        i + 500
      }`,
    })),
  }));
});

// 搜索过滤逻辑
const filteredSections = computed(() => {
  const kw = searchDebounced.value?.toLowerCase();
  if (!kw) return processedData.value;

  return processedData.value.filter(
    (section) =>
      section.categoryName.includes(kw) ||
      section.members.some((m) => m.name.includes(kw))
  );
});

// 背景叶子样式生成
const generateLeafStyle = () => {
  const duration = 5 + Math.random() * 5;
  return {
    left: `${Math.random() * 100}%`,
    width: `${20 + Math.random() * 20}px`,
    height: `${15 + Math.random() * 15}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${Math.random() * 5}s`,
  };
};
</script>

<style scoped>
/* 容器与背景 */
.animal-wiki.dynamic-bg {
  min-height: 100vh;
  background: radial-gradient(circle at 50% 30%, #111d14 0%, #050a06 100%);
  color: #e8f5e9;
  padding-bottom: 60px;
  overflow-x: hidden;
}

/* 玻璃头 */
.glass-header {
  padding: 50px 20px;
  display: flex;
  justify-content: center;
}
.glass-content {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  padding: 30px 50px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  width: 100%;
  max-width: 700px;
}
.title {
  font-size: 2.2rem;
  background: linear-gradient(to right, #a5d6a7, #4caf50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
}
.subtitle {
  color: #81c784;
  font-size: 0.9rem;
}

/* 搜索框 */
.search-bar input {
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  padding: 12px 25px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  outline: none;
}

/* 分类组布局 */
.wiki-sections {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 40px;
}
.category-group {
  margin-bottom: 60px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}
.dot {
  width: 10px;
  height: 10px;
  background: #4caf50;
  border-radius: 50%;
  box-shadow: 0 0 10px #4caf50;
}
.section-title {
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
}

/* 横向排列：3卡片 + 1更多按钮 */
.horizontal-layout {
  display: flex;
  gap: 20px;
  align-items: stretch;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  flex: 1;
}

/* 动物卡片样式 */
.animal-card {
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: 0.3s;
}
.animal-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.07);
}
.image-wrapper {
  height: 160px;
  position: relative;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.status-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-color);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
}
.content {
  padding: 15px;
}
.animal-name {
  font-size: 1.2rem;
  margin: 0 0 8px;
}
.trait-text {
  font-size: 0.85rem;
  color: #a5d6a7;
  font-style: italic;
}
.latin {
  font-size: 10px;
  color: #666;
}

/* 侧边更多按钮 */
.more-side-card {
  width: 120px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px dashed rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}
.more-side-card:hover {
  background: rgba(76, 175, 80, 0.2);
  border-style: solid;
  transform: translateX(5px);
}
.more-content {
  text-align: center;
}
.arrow {
  font-size: 2rem;
  color: #4caf50;
  display: block;
}
.cat-label {
  font-size: 12px;
  color: #81c784;
  display: block;
  margin-top: 5px;
}

/* 底部按钮 */
.control-footer {
  text-align: center;
  margin-top: 50px;
}
.external-link-btn {
  text-decoration: none;
  background: linear-gradient(135deg, #2e7d32, #1b5e20);
  color: white;
  padding: 15px 40px;
  border-radius: 50px;
  display: inline-flex;
  gap: 10px;
  font-weight: bold;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* 落叶动画 */
.floating-leaves-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
.leaf {
  position: absolute;
  background: #2e7d32;
  border-radius: 100% 0;
  opacity: 0.4;
  animation: fall linear infinite;
}
@keyframes fall {
  0% {
    transform: translateY(-10%) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(100vh) rotate(360deg) translateX(50px);
    opacity: 0;
  }
}

/* 适配移动端 */
@media (max-width: 900px) {
  .horizontal-layout {
    flex-direction: column;
  }
  .cards-container {
    grid-template-columns: 1fr;
  }
  .more-side-card {
    width: 100%;
    padding: 20px;
  }
}
</style>