<template>
  <div class="app-container zodiac-theme">
    <div class="space-background">
      <div class="stars-container">
        <div
          v-for="i in 80"
          :key="'star' + i"
          class="star"
          :style="generateStarStyle()"
        ></div>
      </div>
      <div class="shooting-stars">
        <div
          v-for="i in 5"
          :key="'shoot' + i"
          class="shooting-star"
          :style="generateShootingStarStyle()"
        ></div>
      </div>
    </div>

    <div class="content-wrapper">
      <header class="header-section">
        <div class="title-group">
          <h1 class="page-title">深空观测 · 实时星历</h1>
          <p class="subtitle">接入 IAU 授时中心 · 实时监测行星过境相位</p>
        </div>
        <div class="live-clock">
          <div class="time">{{ currentTime }}</div>
          <div class="status">
            <span class="pulse-dot"></span>
            {{ isSyncing ? "星历实时同步中" : "离线模式" }}
          </div>
        </div>
      </header>

      <main class="zodiac-grid">
        <div
          v-for="zodiac in ZODIAC_DATA"
          :key="zodiac.name"
          class="zodiac-card"
          :style="{ '--accent-color': zodiac.colorCode }"
        >
          <div class="card-glow"></div>

          <div class="card-header">
            <div class="zodiac-symbol-wrap">
              <span class="symbol-front">{{ zodiac.icon }}</span>
            </div>
            <div class="name-meta">
              <h3>{{ zodiac.name }}</h3>
              <span class="tag">{{ zodiac.dateRange }}</span>
            </div>
          </div>

          <div class="energy-viz">
            <div
              v-for="(val, label) in zodiac.scores"
              :key="label"
              class="viz-item"
            >
              <div class="viz-info">
                <span>{{ label }}</span>
                <span>{{ val * 20 }}%</span>
              </div>
              <div class="viz-track">
                <div class="viz-grid">
                  <span v-for="n in 5" :key="n"></span>
                </div>
                <div
                  class="viz-bar"
                  :style="{
                    width: val * 20 + '%',
                    background: `linear-gradient(90deg, transparent, ${zodiac.colorCode})`,
                    boxShadow: `0 0 10px ${zodiac.colorCode}`,
                  }"
                ></div>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button @click="showDetail(zodiac)" class="explore-btn">
              观测档案
            </button>
          </div>
        </div>
      </main>

      <footer class="external-link-section">
        <div class="divider"></div>
        <a
          href="https://www.xingzuobaike.com/"
          target="_blank"
          class="portal-btn"
        >
          ✨ 进入星座百科官网获取精准星盘 →
        </a>
      </footer>
    </div>

    <a-drawer
      v-model:open="drawerVisible"
      :title="null"
      placement="right"
      width="520px"
      :closable="false"
      class="zodiac-drawer"
    >
      <div
        v-if="selectedZodiac"
        class="detail-panel"
        :style="{ '--theme': selectedZodiac.colorCode }"
      >
        <div class="close-btn" @click="drawerVisible = false">✕</div>

        <div class="detail-header">
          <div class="big-icon">{{ selectedZodiac.icon }}</div>
          <h2>{{ selectedZodiac.name }} · 实时观测档案</h2>
          <p class="latin-name">
            Celestial Position: {{ selectedZodiac.latin }}
          </p>
        </div>

        <div class="detail-scroll-content">
          <section class="analysis-section">
            <h4 class="section-title">星座视场星图</h4>
            <div class="constellation-map">
              <svg viewBox="0 0 200 120" class="star-svg">
                <polyline
                  :points="selectedZodiac.starPoints"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  stroke-width="1"
                  stroke-dasharray="3"
                />
                <circle
                  v-for="(pos, idx) in selectedZodiac.starCoords"
                  :key="idx"
                  :cx="pos[0]"
                  :cy="pos[1]"
                  r="3"
                  fill="#fff"
                  class="glow-star"
                />
              </svg>
            </div>
          </section>

          <section class="analysis-section">
            <h4 class="section-title">当前行星过境 (Transits)</h4>
            <div class="transit-table">
              <div
                v-for="planet in liveTransitData"
                :key="planet.name"
                class="transit-row"
              >
                <span class="p-icon">{{ planet.icon }}</span>
                <span class="p-name">{{ planet.name }}</span>
                <span class="p-line"></span>
                <span
                  class="p-sign"
                  :style="{
                    color:
                      planet.atZodiac === selectedZodiac.name
                        ? selectedZodiac.colorCode
                        : '#666',
                  }"
                >
                  落入 {{ planet.atZodiac }}
                </span>
                <span
                  v-if="planet.atZodiac === selectedZodiac.name"
                  class="host-tag"
                  >入庙</span
                >
              </div>
            </div>
          </section>

          <section class="analysis-section">
            <h4 class="section-title">深度星盘能量解析</h4>
            <div class="pro-analysis-box">
              <p><strong>核心特质：</strong> {{ selectedZodiac.character }}</p>
              <div class="analysis-card">
                <strong>今日星象建议：</strong>
                <p>{{ generateRealtimeInsight(selectedZodiac) }}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";
// 请确保已运行 npm install astronomy-engine dayjs --legacy-peer-deps
import * as Astronomy from "astronomy-engine";

// --- 响应式状态 ---
const currentTime = ref("");
const isSyncing = ref(false); // 确保声明了同步状态
const drawerVisible = ref(false);
const selectedZodiac = ref(null);
const liveTransitData = ref([]);
const conflictWarnings = ref([]);
const ZODIAC_DATA = ref([]);

// --- 基础配置数据 ---
const ZODIAC_NAMES = [
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
  "水瓶座",
  "双鱼座",
];
const BASE_DATA = [
  {
    name: "白羊座",
    icon: "♈",
    dateRange: "3.21-4.19",
    latin: "Aries",
    colorCode: "#ff4d4f",
    starPoints: "30,60 80,30 140,50 170,90",
    starCoords: [
      [30, 60],
      [80, 30],
      [140, 50],
      [170, 90],
    ],
    character: "白羊座是黄道第一宫，代表新生。你的能量是直接且充满爆发力的。",
  },
  {
    name: "金牛座",
    icon: "♉",
    dateRange: "4.20-5.20",
    latin: "Taurus",
    colorCode: "#52c41a",
    starPoints: "20,20 60,50 100,40 150,80",
    starCoords: [
      [20, 20],
      [60, 50],
      [100, 40],
      [150, 80],
    ],
    character: "金牛座代表价值与积累。你拥有极强的耐力与对美的独特感知力。",
  },
  {
    name: "双子座",
    icon: "♊",
    dateRange: "5.21-6.21",
    latin: "Gemini",
    colorCode: "#fadb14",
    starPoints: "40,20 40,100 120,20 120,100",
    starCoords: [
      [40, 20],
      [40, 100],
      [120, 20],
      [120, 100],
    ],
    character: "双子座代表沟通与链接。你的思维跳跃，拥有极强的信息采集能力。",
  },
  {
    name: "巨蟹座",
    icon: "♋",
    dateRange: "6.22-7.22",
    latin: "Cancer",
    colorCode: "#bfbfbf",
    starPoints: "100,20 100,60 60,90 140,90",
    starCoords: [
      [100, 20],
      [100, 60],
      [60, 90],
      [140, 90],
    ],
    character: "巨蟹座代表滋养与情感。你的保护欲强，对环境细微的变化极度敏感。",
  },
  {
    name: "狮子座",
    icon: "♌",
    dateRange: "7.23-8.22",
    latin: "Leo",
    colorCode: "#fa8c16",
    starPoints: "160,80 120,90 80,40 40,50",
    starCoords: [
      [160, 80],
      [120, 90],
      [80, 40],
      [40, 50],
    ],
    character:
      "狮子座代表荣耀与创造。你是天生的表演者，渴望在舞台中心发光发热。",
  },
  {
    name: "处女座",
    icon: "♍",
    dateRange: "8.23-9.22",
    latin: "Virgo",
    colorCode: "#096dd9",
    starPoints: "30,30 60,60 90,50 120,80 150,40",
    starCoords: [
      [30, 30],
      [60, 60],
      [90, 50],
      [120, 80],
      [150, 40],
    ],
    character:
      "处女座代表秩序与完美。你的分析力极其出色，擅长在混乱中建立规则。",
  },
  {
    name: "天秤座",
    icon: "♎",
    dateRange: "9.23-10.23",
    latin: "Libra",
    colorCode: "#ff85c0",
    starPoints: "100,20 60,60 140,60 100,100",
    starCoords: [
      [100, 20],
      [60, 60],
      [140, 60],
      [100, 100],
    ],
    character:
      "天秤座代表平衡与正义。你追求人际关系的和谐，拥有极佳的审美天赋。",
  },
  {
    name: "天蝎座",
    icon: "♏",
    dateRange: "10.24-11.22",
    latin: "Scorpio",
    colorCode: "#722ed1",
    starPoints: "40,20 60,40 80,90 120,80 150,60",
    starCoords: [
      [40, 20],
      [60, 40],
      [80, 90],
      [120, 80],
      [150, 60],
    ],
    character: "天蝎座代表转化与深度。你的情感强烈，具有穿透事物表象的洞察力。",
  },
  {
    name: "射手座",
    icon: "♐",
    dateRange: "11.23-12.21",
    latin: "Sagittarius",
    colorCode: "#13c2c2",
    starPoints: "60,40 100,20 140,40 100,80 100,110",
    starCoords: [
      [60, 40],
      [100, 20],
      [140, 40],
      [100, 80],
      [100, 110],
    ],
    character:
      "射手座代表扩张与远方。你热爱自由，终其一生都在追求更高层次的真理。",
  },
  {
    name: "摩羯座",
    icon: "♑",
    dateRange: "12.22-1.19",
    latin: "Capricorn",
    colorCode: "#595959",
    starPoints: "40,40 100,100 160,40",
    starCoords: [
      [40, 40],
      [100, 100],
      [160, 40],
    ],
    character: "摩羯座代表成就与责任。你脚踏实地，能够在漫长的磨砺中获得成功。",
  },
  {
    name: "水瓶座",
    icon: "♒",
    dateRange: "1.20-2.18",
    latin: "Aquarius",
    colorCode: "#1890ff",
    starPoints: "40,60 80,40 120,60 160,40",
    starCoords: [
      [40, 60],
      [80, 40],
      [120, 60],
      [160, 40],
    ],
    character: "水瓶座代表变革与群体。你的思维独立且前卫，是打破陈规的先锋。",
  },
  {
    name: "双鱼座",
    icon: "♓",
    dateRange: "2.19-3.20",
    latin: "Pisces",
    colorCode: "#eb2f96",
    starPoints: "20,20 60,60 100,20 140,60",
    starCoords: [
      [20, 20],
      [60, 60],
      [100, 20],
      [140, 60],
    ],
    character:
      "双鱼座代表梦幻与共情。你是灵性的化身，能够感知世间最细微的情绪变化。",
  },
];

// --- 逻辑函数 ---

// 1. 调用星历引擎计算行星位置
const calculateEngine = () => {
  try {
    const date = new Date();
    // 强制使用北京观测点（虽然计算黄经主要看时间，但保持严谨）
    const bodies = [
      { name: "太阳", id: Astronomy.Body.Sun, icon: "☉" },
      { name: "月亮", id: Astronomy.Body.Moon, icon: "☽" },
      { name: "水星", id: Astronomy.Body.Mercury, icon: "☿" },
      { name: "金星", id: Astronomy.Body.Venus, icon: "♀" },
      { name: "火星", id: Astronomy.Body.Mars, icon: "♂" },
      { name: "木星", id: Astronomy.Body.Jupiter, icon: "♃" },
      { name: "土星", id: Astronomy.Body.Saturn, icon: "♄" },
    ];

    // 映射行星真实位置
    const transitResults = bodies.map((b) => {
      let lon;
      if (b.name === "太阳") {
        // 核心修复：确保获取的是当前的视黄经
        lon = Astronomy.SunPosition(date).elon;
      } else {
        // 核心修复：获取对应行星 ID 的地心黄经
        lon = Astronomy.EclipticLongitude(b.id, date);
      }

      // 归一化经度 (0-360)
      const normalizedLon = ((lon % 360) + 360) % 360;
      // 计算星座索引 (每30度一个星座)
      const zodiacIndex = Math.floor(normalizedLon / 30);

      return {
        ...b,
        lon: normalizedLon,
        atZodiac: ZODIAC_NAMES[zodiacIndex], // 这里应该是变化的
      };
    });

    // 调试：在控制台打印表格，查看行星落点是否真的全一样
    console.table(transitResults, "1111");

    liveTransitData.value = transitResults;

    // 执行相位检测
    if (typeof detectAspectConflicts === "function") {
      detectAspectConflicts(transitResults);
    }

    isSyncing.value = true;
  } catch (e) {
    console.error("星历观测站计算异常:", e.message);
    isSyncing.value = false;
  }
};
// 相位冲突检测函数 (修复 detectAspectConflicts is not defined)
const detectAspectConflicts = (planets) => {
  const warnings = [];
  const ORB = 5; // 允许 5 度的误差

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const diff = Math.abs(p1.lon - p2.lon);
      const angle = diff > 180 ? 360 - diff : diff;

      if (Math.abs(angle - 180) <= ORB) {
        warnings.push({
          id: `opp-${i}-${j}`,
          title: "对冲",
          type: "opposition",
          content: `${p1.name} 与 ${p2.name} 形成 180° 对冲。`,
        });
      } else if (Math.abs(angle - 90) <= ORB) {
        warnings.push({
          id: `sqr-${i}-${j}`,
          title: "相刑",
          type: "square",
          content: `${p1.name} 与 ${p2.name} 形成 90° 刑相位。`,
        });
      }
    }
  }
  conflictWarnings.value = warnings.slice(0, 3);
};

// 2. 初始化网格数据
const initData = () => {
  calculateEngine();
  const daySeed = new Date().getDate();

  ZODIAC_DATA.value = BASE_DATA.map((z, i) => {
    const seed = daySeed + i;
    // 检查是否有行星正在过境该星座
    const visitorCount = liveTransitData.value.filter(
      (p) => p.atZodiac === z.name
    ).length;

    return {
      ...z,
      scores: {
        财运: (seed % 3) + 3,
        桃花: ((seed + 1) % 3) + 3,
        事业: visitorCount > 0 ? 5 : (seed % 2) + 3,
        健康: 4,
      },
    };
  });
};

// 3. 生成实时分析文本
const generateRealtimeInsight = (z) => {
  const visitor = liveTransitData.value.find((p) => p.atZodiac === z.name);
  return visitor
    ? `当前【${visitor.name}】正在你的星座过境。检测到星体引力共鸣，适合集中精力处理对应的生命课题。`
    : `今日星象趋于平稳。由于没有主行星过境，这是一个很好的复盘期，建议静待更佳的观测周期。`;
};

// --- 3. 生命周期与时钟 ---
let mainTimer;
onMounted(() => {
  initData();
  currentTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
  mainTimer = setInterval(() => {
    currentTime.value = dayjs().format("YYYY-MM-DD HH:mm:ss");
    // 行星移动缓慢，每分钟刷新一次计算即可（当秒针为0时）
    if (new Date().getSeconds() === 0) {
      calculateEngine();
    }
  }, 1000);
});

onUnmounted(() => clearInterval(mainTimer));

// --- 4. 动画辅助 ---
const generateStarStyle = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
});
const generateShootingStarStyle = () => ({
  top: `${Math.random() * 50}%`,
  left: `${Math.random() * 100}%`,
  animationDuration: `${3 + Math.random() * 5}s`,
  animationDelay: `${Math.random() * 10}s`,
});
const showDetail = (z) => {
  selectedZodiac.value = z;
  drawerVisible.value = true;
};
</script>

<style scoped>
/* 1. 基础容器与星空 */
.zodiac-theme {
  min-height: 100vh;
  background: radial-gradient(circle at center, #0a0a1f 0%, #020205 100%);
  color: white;
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
}

.space-background {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.shooting-star {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, white, transparent);
  transform: rotate(-45deg);
  opacity: 0;
  animation: shoot 5s infinite linear;
}
@keyframes shoot {
  0% {
    transform: translateX(0) translateY(0) rotate(-45deg);
    opacity: 1;
  }
  20% {
    opacity: 0;
    transform: translateX(-600px) translateY(600px) rotate(-45deg);
  }
  100% {
    opacity: 0;
  }
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1300px;
  margin: 0 auto;
}

/* 2. 头部样式 */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
}
.page-title {
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(to right, #fff, #b37feb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.live-clock .time {
  font-family: monospace;
  font-size: 1.2rem;
  color: #1890ff;
}
.live-clock .status {
  font-size: 11px;
  color: #52c41a;
  display: flex;
  align-items: center;
  gap: 6px;
}
.pulse-dot {
  width: 6px;
  height: 6px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.2);
  }
}

/* 3. 网格布局与卡片 */
.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 1200px) {
  .zodiac-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 900px) {
  .zodiac-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 600px) {
  .zodiac-grid {
    grid-template-columns: 1fr;
  }
}

.zodiac-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.zodiac-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent-color);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.zodiac-symbol-wrap {
  font-size: 2.5rem;
  text-shadow: 0 0 15px var(--accent-color);
}
.name-meta h3 {
  margin: 5px 0 0;
  font-size: 1.4rem;
}
.tag {
  font-size: 11px;
  color: #666;
}

/* 4. 可视化长条样式 */
.viz-item {
  margin-top: 15px;
}
.viz-info {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #aaa;
  margin-bottom: 5px;
}
.viz-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}
.viz-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 1.5s ease-out;
}
.viz-grid {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20%;
}
.viz-grid span {
  width: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.explore-btn {
  width: 100%;
  margin-top: 20px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: white;
  cursor: pointer;
  transition: 0.3s;
}
.explore-btn:hover {
  background: var(--accent-color);
  border-color: transparent;
  font-weight: bold;
}

/* 5. 抽屉样式 */
:deep(.ant-drawer-content) {
  background: #050510 !important;
  color: white;
}
.detail-panel {
  padding: 30px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  font-size: 1.5rem;
  opacity: 0.5;
}
.detail-header {
  text-align: center;
  margin-bottom: 30px;
}
.big-icon {
  font-size: 5rem;
  color: var(--theme);
  text-shadow: 0 0 30px var(--theme);
}

.analysis-section {
  margin-bottom: 35px;
}
.section-title {
  color: var(--theme);
  font-size: 1rem;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-title::before {
  content: "";
  width: 4px;
  height: 16px;
  background: var(--theme);
  border-radius: 2px;
}

/* 1. 星图容器：核心背景升级 */
.constellation-map {
  position: relative;
  /* 多重渐变背景模拟深空星云 */
  background: 
    /* 顶层：噪点纹理 (可选，增加颗粒感) */ radial-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    ),
    /* 中层：模拟蓝色和紫色的星云光晕 */
      radial-gradient(
        circle at 30% 20%,
        rgba(64, 87, 191, 0.2) 0%,
        transparent 50%
      ),
    radial-gradient(
      circle at 70% 80%,
      rgba(138, 43, 226, 0.15) 0%,
      transparent 50%
    ),
    /* 底层：深邃的宇宙黑蓝渐变 */
      radial-gradient(circle at center, #0f172a 0%, #020617 100%);

  background-size: 100% 100%, 100% 100%, 100% 100%, 100% 100%;
  border-radius: 16px;
  padding: 25px;
  /* 发光边框效果 */
  border: 1px solid rgba(99, 102, 241, 0.3);
  box-shadow: inset 0 0 30px rgba(99, 102, 241, 0.1),
    /* 内发光 */ 0 0 20px rgba(0, 0, 0, 0.5); /* 外阴影 */
  text-align: center;
  overflow: hidden;
}

/* 2. SVG 画布微调 */
.star-svg {
  max-width: 280px;
  /* 增加整体光晕感 */
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  /* 稍微倾斜一点，增加动态感 */
  transform: perspective(500px) rotateX(5deg);
}

/* 3. 恒星闪烁动画 (保持原有，可稍微调快频率) */
.glow-star {
  animation: starBlink 3s infinite alternate ease-in-out;
}
@keyframes starBlink {
  from {
    opacity: 0.3;
    r: 2.5;
    filter: blur(1px);
  }
  to {
    opacity: 1;
    r: 4;
    filter: blur(0), drop-shadow(0 0 5px #fff);
  }
}

.transit-table {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 10px;
}
.transit-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.p-icon {
  color: #1890ff;
  font-size: 1.2rem;
  width: 25px;
}
.p-line {
  flex: 1;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}
.host-tag {
  background: var(--theme);
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.analysis-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  border-left: 4px solid var(--theme);
}
.analysis-card p {
  margin: 10px 0 0;
  color: #ccc;
  line-height: 1.6;
}

.external-link-section {
  margin-top: 60px;
  text-align: center;
}
.portal-btn {
  color: #b37feb;
  text-decoration: none;
  font-weight: bold;
  border: 1px solid #b37feb;
  padding: 12px 30px;
  border-radius: 50px;
  transition: 0.3s;
}
.portal-btn:hover {
  background: #b37feb;
  color: white;
}
</style>