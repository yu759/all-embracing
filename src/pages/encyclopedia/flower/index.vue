<template>
  <div class="app-container flower-wiki dynamic-bg">
    <div class="floating-petals-container">
      <div class="petal p1"></div>
      <div class="petal p2"></div>
      <div class="petal p3"></div>
      <div class="petal p4"></div>
      <div class="petal p5"></div>
      <div class="petal p6"></div>
      <div class="petal p7"></div>
      <div class="petal p8"></div>
      <div class="petal p9"></div>
      <div class="petal p10"></div>
      <div class="petal p11"></div>
      <div class="petal p12"></div>
      <div class="petal p13"></div>
      <div class="petal p14"></div>
      <div class="petal p15"></div>
      <div class="petal p16"></div>
      <div class="petal p17"></div>
      <div class="petal p18"></div>
      <div class="petal p19"></div>
      <div class="petal p20"></div>
      <div class="petal p21"></div>
      <div class="petal p22"></div>
      <div class="petal p23"></div>
      <div class="petal p24"></div>
      <div class="petal p25"></div>
      <div class="petal p26"></div>
      <div class="petal p27"></div>
      <div class="petal p28"></div>
    </div>

    <header class="hero-section">
      <h1 class="title">万紫千红 · 鲜花百科</h1>
      <p class="subtitle">参考专业花卉志，收录植物特征与自然分布纪实影像</p>

      <div class="search-bar compact">
        <input
          v-model="searchRaw"
          type="text"
          placeholder="搜索花名、季节或产地..."
        />
      </div>
    </header>

    <main class="wiki-grid">
      <div
        v-for="flower in filteredProducts"
        :key="flower.id"
        class="flower-card style-photo"
        :style="{ '--accent-color': flower.color }"
      >
        <div class="image-wrapper">
          <img :src="flower.image" :alt="flower.name" loading="lazy" />
        </div>

        <div class="content">
          <div class="top-line">
            <h3 class="flower-name">{{ flower.name }}</h3>
            <span class="season-tag">{{ flower.season }}</span>
          </div>

          <div class="info-row">
            <span class="label">分布:</span>
            <span class="value">{{ flower.origin }}</span>
          </div>

          <p class="language-box">「{{ flower.language }}」</p>

          <div class="footer-actions">
            <span class="category">{{ flower.category }}</span>
            <button
              @click="
                $router.push({
                  path: '/encyclopedia/flower/detail',
                  query: { name: flower.name },
                })
              "
              class="mini-btn"
            >
              详情
            </button>
          </div>
        </div>
      </div>
      <div class="more-flowers-container">
        <button @click="handleMoreFlowers" class="more-btn">
          <span class="icon">🔍</span> 了解更多花朵
        </button>
      </div>
    </main>

    <div v-if="filteredProducts.length === 0" class="empty-state">
      <p>未找到相关花卉，尝试搜索“春季”或“中国”</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDebounce } from "@/composables/useDebounce";
import "./style.css";

const searchRaw = ref("");
const searchDebounced = useDebounce(searchRaw, 300);

// 核心科普数据 (保持不变)
const REAL_FLOWER_DATABASE = [
  {
    name: "牡丹",
    language: "圆满、富贵、端庄",
    origin: "中国中原地区",
    season: "4月-5月",
    category: "芍药科",
    color: "#e91e63",
  },
  {
    name: "梅花",
    language: "高洁、坚强、谦虚",
    origin: "中国长江流域",
    season: "1月-2月",
    category: "蔷薇科",
    color: "#f06292",
  },
  {
    name: "向日葵",
    language: "沉默的爱、忠诚",
    origin: "北美洲",
    season: "7月-9月",
    category: "菊科",
    color: "#fbc02d",
  },
  {
    name: "郁金香",
    language: "爱、荣誉、永恒",
    origin: "土耳其、中亚",
    season: "3月-5月",
    category: "百合科",
    color: "#ff5252",
  },
  {
    name: "薰衣草",
    language: "等待爱情、纯洁",
    origin: "地中海沿岸",
    season: "6月-8月",
    category: "唇形科",
    color: "#7e57c2",
  },
  {
    name: "山茶花",
    language: "理想的爱、谦让",
    origin: "中国及日本",
    season: "10月-翌年5月",
    category: "山茶科",
    color: "#c2185b",
  },
  {
    name: "荷花",
    language: "清白、纯洁、坚贞",
    origin: "中国、印度",
    season: "6月-9月",
    category: "莲科",
    color: "#f48fb1",
  },
  {
    name: "雏菊",
    language: "深藏在心底的爱",
    origin: "欧洲",
    season: "3月-6月",
    category: "菊科",
    color: "#fff176",
  },
  {
    name: "风信子",
    language: "喜悦、竞赛、忧郁",
    origin: "地中海及南非",
    season: "3月-4月",
    category: "天门冬科",
    color: "#5c6bc0",
  },
  {
    name: "绣球花",
    language: "希望、健康、美满",
    origin: "中国、日本",
    season: "6月-8月",
    category: "虎耳草科",
    color: "#4fc3f7",
  },
  {
    name: "水仙",
    language: "多情、想你、纯洁",
    origin: "中国福建、浙江",
    season: "1月-3月",
    category: "石蒜科",
    color: "#fffde7",
  },
  {
    name: "杜鹃花",
    language: "永远属于你、节制",
    origin: "中国南方",
    season: "4月-5月",
    category: "杜鹃花科",
    color: "#ff4081",
  },
];

const products = ref([]);

const initData = () => {
  products.value = REAL_FLOWER_DATABASE.map((item, index) => {
    const flowerEng =
      {
        牡丹: "peony",
        梅花: "plum-blossom",
        向日葵: "sunflower",
        郁金香: "tulip",
        薰衣草: "lavender",
        山茶花: "camellia",
        荷花: "lotus",
        雏菊: "daisy",
        风信子: "hyacinth",
        绣球花: "hydrangea",
        水仙: "narcissus",
        杜鹃花: "azalea",
      }[item.name] || "flower";

    return {
      ...item,
      id: index,
      image: `https://loremflickr.com/400/300/${flowerEng},nature?lock=${
        index + 50
      }`,
    };
  });
};

onMounted(() => {
  initData();
});

const filteredProducts = computed(() => {
  const kw = searchDebounced.value?.toLowerCase();
  if (!kw) return products.value;
  return products.value.filter(
    (p) => p.name.includes(kw) || p.season.includes(kw) || p.origin.includes(kw)
  );
});

// const viewDetail = (flower) => {
//   window.open(`https://baike.baidu.com/item/${flower.name}`, "_blank");
// };

const handleMoreFlowers = () => {
  // 可以是跳转到专业花卉百科网站
  window.open("https://www.baikehua.cn/", "_blank");
  // 或者在此处编写加载更多本地数据的逻辑
};
</script>

<style scoped>
/* --- 其他样式 (保持不变) --- */
.hero-section {
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  text-align: center;
  border-bottom: none;
  position: relative;
  z-index: 1;
}

.title {
  font-size: 2rem;
  color: #d63384;
  margin-bottom: 8px;
  font-family: "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  text-shadow: 1px 1px 4px rgba(255, 255, 255, 0.8);
}

.subtitle {
  color: #8a6d6d;
  font-size: 0.9rem;
  margin-bottom: 25px;
}

.search-bar.compact input {
  width: 100%;
  max-width: 400px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.3s;
}
.search-bar.compact input:focus {
  border-color: #d63384;
  background: white;
  box-shadow: 0 4px 15px rgba(214, 51, 132, 0.15);
}

.wiki-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 30px 6%;
  position: relative;
  z-index: 1;
}
@media (max-width: 1024px) {
  .wiki-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .wiki-grid {
    grid-template-columns: 1fr;
  }
}

.flower-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.08);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 235, 240, 0.6);
}
.flower-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(233, 30, 99, 0.15);
}
.style-photo .image-wrapper img {
  filter: saturate(1.05);
}
.image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f0f0f0;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.content {
  padding: 15px;
  flex-grow: 1;
}
.top-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.flower-name {
  font-size: 1.15rem;
  margin: 0;
  color: #333;
}
.season-tag {
  font-size: 0.75rem;
  color: #d63384;
  background: #ffeef5;
  padding: 2px 6px;
  border-radius: 4px;
}
.info-row {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 8px;
}
.label {
  font-weight: bold;
  margin-right: 4px;
  color: #999;
}
.language-box {
  font-size: 0.85rem;
  color: #d63384;
  font-style: italic;
  margin: 10px 0;
  padding: 8px;
  background: #fff0f5;
  border-radius: 6px;
  border-left: 3px solid var(--accent-color);
}
.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #ffeef5;
}
.category {
  font-size: 0.75rem;
  color: #999;
}
.mini-btn {
  background: linear-gradient(to right, #d63384, #ff8da1);
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.3s;
}
.mini-btn:hover {
  opacity: 0.9;
  box-shadow: 0 4px 10px rgba(214, 51, 132, 0.3);
}
.empty-state {
  text-align: center;
  padding: 50px;
  color: #d63384;
}

/* --- 了解更多按钮样式 --- */
.more-flowers-footer {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  padding: 40px 0;
  position: relative;
  z-index: 10;
}

.more-btn {
  background: linear-gradient(135deg, #ff8da1 0%, #d63384 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(214, 51, 132, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  gap: 10px;
}

.more-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 35px rgba(214, 51, 132, 0.4);
  filter: brightness(1.1);
}

.more-btn:active {
  transform: scale(0.95);
}

.more-btn .icon {
  font-size: 1.2rem;
}

/* 增加一个简单的呼吸动画，让按钮更吸引眼球 */
@keyframes buttonPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(214, 51, 132, 0.4);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(214, 51, 132, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(214, 51, 132, 0);
  }
}

.more-btn {
  animation: buttonPulse 2s infinite;
}
</style>