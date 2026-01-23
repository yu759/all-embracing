<template>
  <div class="app-container monitor-layout dynamic-obsidian-bg">
    <div class="particles-bg">
      <div
        v-for="i in 30"
        :key="i"
        class="particle"
        :style="generateMixedParticleStyle()"
      ></div>
    </div>

    <div class="content-wrapper">
      <header class="header-section glass">
        <div class="title-group">
          <h1 class="page-title">万象 · 实时观测阵列</h1>
          <div class="status-controls">
            <a-switch
              :checked="!isPaused"
              @change="togglePause"
              checked-children="实时"
              un-checked-children="挂起"
              class="custom-switch"
            />
            <a-badge
              :status="isPaused ? 'default' : 'processing'"
              :text="isPaused ? '阵列已锁定' : '链路同步中'"
              class="status-text"
            />
          </div>
        </div>
        <a-segmented
          v-model:value="activeSegment"
          :options="segmentOptions"
          class="custom-segmented-dark"
        />
      </header>

      <main class="main-content">
        <transition name="fade-slide" mode="out-in">
          <div
            v-if="activeSegment === 'Operation Record'"
            :key="'op'"
            class="segment-card glass"
          >
            <div class="action-bar">
              <div class="stats-row-header">
                <div class="stat-unit">
                  <span class="stat-label">今日累计请求</span>
                  <span class="stat-val cyan-text"
                    >{{ liveStats.todayOps }} <i class="up-icon">↑</i></span
                  >
                </div>
                <div class="divider-v"></div>
                <div class="stat-unit">
                  <span class="stat-label">异常拦截率</span>
                  <span
                    class="stat-val"
                    :class="
                      liveStats.errorRate > 0.7 ? 'red-text' : 'green-text'
                    "
                  >
                    {{ liveStats.errorRate }}%
                  </span>
                </div>
              </div>

              <div class="btn-group">
                <a-button
                  @click="isTableVisible = !isTableVisible"
                  class="obsidian-btn ghost"
                  size="large"
                >
                  <template #icon
                    ><EyeOutlined v-if="!isTableVisible" /><EyeInvisibleOutlined
                      v-else
                  /></template>
                  {{ isTableVisible ? "隐藏报文" : "显示报文" }}
                </a-button>
                <a-button
                  @click="handleExport"
                  class="obsidian-btn primary"
                  size="large"
                >
                  <template #icon><DownloadOutlined /></template>导出核心数据
                </a-button>
              </div>
            </div>

            <transition name="expand">
              <div v-if="isTableVisible" class="table-frame">
                <a-table
                  :columns="columns"
                  :data-source="liveTableData"
                  :pagination="false"
                  size="small"
                  class="dark-table"
                >
                  <template #bodyCell="{ column, text }">
                    <template v-if="column.dataIndex === 'status'">
                      <span
                        :class="text === '成功' ? 'success-dot' : 'error-dot'"
                        >{{ text }}</span
                      >
                    </template>
                  </template>
                </a-table>
              </div>
            </transition>
          </div>

          <div v-else :key="activeSegment" class="segment-card glass">
            <div class="dashboard-header">
              <h3>{{ activeSegment }} 维度波谱分析</h3>
              <span class="timestamp">最后脉冲：{{ lastUpdate }}</span>
            </div>

            <a-row :gutter="20" class="stat-grid">
              <a-col :span="8" v-for="(val, key) in dashboardStats" :key="key">
                <div
                  class="inner-stat-box glass"
                  :style="{
                    '--c': val.value > val.prev ? '#2dd4bf' : '#f87171',
                  }"
                >
                  <div class="box-label">{{ key }}</div>
                  <div class="box-main">
                    <span class="box-num">{{ val.value }}{{ val.suffix }}</span>
                    <span
                      class="box-trend"
                      :class="val.value > val.prev ? 'up' : 'down'"
                    >
                      {{ val.value > val.prev ? "▲" : "▼" }}
                    </span>
                  </div>
                </div>
              </a-col>
            </a-row>

            <div class="spectral-chart">
              <p class="chart-tag">数据下行波谱 (Flux Spectrum)</p>
              <div class="bars">
                <div
                  v-for="(h, i) in liveBarHeights"
                  :key="i"
                  class="bar-item"
                  :style="{ height: h + 'px', '--delay': i * 0.1 + 's' }"
                ></div>
              </div>
            </div>
          </div>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
// [逻辑部分保持原有逻辑，颜色变量微调以匹配 UI]
import { ref, reactive, onUnmounted } from "vue";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons-vue";
import dayjs from "dayjs";

const isPaused = ref(true);
const activeSegment = ref("Operation Record");
const isTableVisible = ref(true);
const liveStats = reactive({ todayOps: 1250, errorRate: 0.45 });
const lastUpdate = ref(dayjs().format("HH:mm:ss"));
const segmentOptions = ["Operation Record", "Weekly", "Monthly", "Quarterly"];

const dashboardStats = reactive({
  活跃观测: { value: 854, prev: 850, suffix: "人" },
  响应脉冲: { value: 42.5, prev: 44.0, suffix: "ms" },
  处理负载: { value: 31.2, prev: 30.0, suffix: "%" },
});

const liveBarHeights = ref(
  Array.from({ length: 32 }, () => Math.random() * 100 + 40)
);
const columns = [
  { title: "观测员", dataIndex: "user" },
  { title: "指令", dataIndex: "action" },
  { title: "时间", dataIndex: "time" },
  { title: "状态", dataIndex: "status" },
];
const liveTableData = ref([
  {
    key: 1,
    user: "SYSTEM",
    action: "HEARTBEAT",
    time: dayjs().format("HH:mm:ss"),
    status: "成功",
  },
]);

// 生成混合色粒子的样式（同步 visitor 页面）
const generateMixedParticleStyle = () => {
  const colors = ["#f472b6", "#4ade80", "#a855f7", "#2dd4bf"];
  return {
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 2}px`,
    height: `${Math.random() * 3 + 2}px`,
    animationDuration: `${8 + Math.random() * 12}s`,
    animationDelay: `${Math.random() * 5}s`,
    background: colors[Math.floor(Math.random() * colors.length)],
    boxShadow: `0 0 10px rgba(45, 212, 191, 0.4)`,
    opacity: Math.random() * 0.4 + 0.2,
  };
};

const togglePause = () => {
  isPaused.value = !isPaused.value; /* 定时器逻辑... */
};
const handleExport = () => alert("加密档案正在导出...");
onUnmounted(() => {});
</script>

<style scoped>
/* --- 1. 黑曜石基础背景 --- */
.monitor-layout {
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  color: #f8fafc;
  position: relative;
  overflow-x: hidden;
}

/* --- 2. 玻璃拟态基类 --- */
.glass {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}

/* --- 3. 粒子动画 --- */
.particles-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.particle {
  position: absolute;
  border-radius: 50%;
  top: -5%;
  animation: fall linear infinite;
}
@keyframes fall {
  to {
    transform: translateY(110vh) rotate(360deg);
  }
}

/* --- 4. 头部布局与文字 --- */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  z-index: 1;
  position: relative;
}
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 40px;
  margin-bottom: 30px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(to right, #ffffff, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-text {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-left: 10px;
}

/* --- 5. 统计与操作栏 --- */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.stats-row-header {
  display: flex;
  align-items: center;
  gap: 40px;
}
.stat-label {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin-bottom: 5px;
}
.stat-val {
  font-size: 1.5rem;
  font-weight: bold;
}
.cyan-text {
  color: #2dd4bf;
}
.red-text {
  color: #f87171;
}
.green-text {
  color: #4ade80;
}
.divider-v {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

/* --- 6. 按钮与表格定制 --- */
.obsidian-btn.primary {
  background: #2dd4bf;
  color: #020617;
  border: none;
  font-weight: bold;
}
.obsidian-btn.ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.obsidian-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.table-frame {
  margin-top: 20px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
}
:deep(.dark-table .ant-table) {
  background: transparent !important;
  color: #cbd5e1;
}
:deep(.dark-table .ant-table-thead > tr > th) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #2dd4bf;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.dark-table .ant-table-cell) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* --- 7. 趋势卡片与波谱图 --- */
.inner-stat-box {
  padding: 25px;
  border-left: 4px solid var(--c);
}
.box-label {
  color: #64748b;
  font-size: 0.85rem;
}
.box-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: #fff;
}
.box-trend {
  margin-left: 10px;
  font-size: 0.9rem;
}
.box-trend.up {
  color: #4ade80;
}
.box-trend.down {
  color: #f87171;
}

.spectral-chart {
  margin-top: 40px;
  background: rgba(0, 0, 0, 0.3);
  padding: 30px;
  border-radius: 20px;
}
.bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 180px;
}
.bar-item {
  width: 8px;
  border-radius: 4px;
  background: linear-gradient(to top, #2563eb, #2dd4bf);
  transition: height 0.4s ease;
  box-shadow: 0 0 15px rgba(45, 212, 191, 0.3);
}

/* --- 8. 辅助样式 --- */
.success-dot::before {
  content: "●";
  color: #4ade80;
  margin-right: 5px;
}
.error-dot::before {
  content: "●";
  color: #f87171;
  margin-right: 5px;
}
</style>