<template>
  <div class="user-layout">
    <div class="particles-bg">
      <div
        v-for="i in 30"
        :key="i"
        class="particle"
        :style="getParticleStyle()"
      ></div>
    </div>

    <aside class="sidebar-container glass">
      <div class="user-profile">
        <div class="avatar-glow">👤</div>
        <div class="user-titles">
          <h2>高级观测员</h2>
          <code>ID: OBS-2026-X12</code>
        </div>
      </div>

      <div class="stats-grid">
        <div
          v-for="s in stats"
          :key="s.lab"
          class="stat-tile"
          :style="{ '--color': s.color }"
        >
          <span class="stat-num">{{ s.num }}</span>
          <span class="stat-label">{{ s.lab }}</span>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <div class="settings-card glass">
        <h3 class="section-title">系统配置 · System</h3>
        <nav class="settings-list">
          <div v-for="item in menuItems" :key="item" class="setting-row">
            <span>{{ item }}</span>
            <span class="arrow">→</span>
          </div>
        </nav>
        <button class="logout-action" @click="handleLogout">
          注销连接 / Terminate
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
const stats = [
  { num: 12, lab: "花卉收藏", color: "#f472b6" },
  { num: 24, lab: "物种图鉴", color: "#4ade80" },
  { num: 88, lab: "星图探测", color: "#a855f7" },
];

const menuItems = [
  "账号安全性管理",
  "界面偏好与主题",
  "数据同步设置",
  "观测点权限申请",
];

const getParticleStyle = () => {
  const colors = ["#f472b6", "#4ade80", "#a855f7", "#2dd4bf"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 3 + 2}px`,
    height: `${Math.random() * 3 + 2}px`,
    animationDuration: `${10 + Math.random() * 10}s`,
    animationDelay: `${Math.random() * 5}s`,
    background: color,
    boxShadow: `0 0 12px ${color}`,
    opacity: Math.random() * 0.5 + 0.3,
  };
};

const handleLogout = () => {
  console.log("正在断开观测连接...");
};
</script>

<style scoped>
/* --- 全局布局 --- */
.user-layout {
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  padding: 40px;
  gap: 30px;
  position: relative;
  overflow: hidden;
  color: #f8fafc;
}

/* --- 磨砂玻璃通用基类 --- */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  z-index: 1;
}

/* --- 侧边栏样式 --- */
.sidebar-container {
  width: 360px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.user-profile {
  text-align: center;
}

.avatar-glow {
  font-size: 3.5rem;
  background: rgba(255, 255, 255, 0.05);
  width: 100px;
  height: 100px;
  line-height: 100px;
  border-radius: 50%;
  margin: 0 auto 20px;
  box-shadow: 0 0 20px rgba(45, 212, 191, 0.2);
}

.user-titles h2 {
  font-size: 1.4rem;
  color: #fff;
  margin-bottom: 5px;
}
.user-titles code {
  color: #94a3b8;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  gap: 15px;
}

.stat-tile {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 16px;
  border-left: 4px solid var(--color);
  transition: 0.3s;
}

.stat-num {
  display: block;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--color);
}
.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

/* --- 主内容区样式 --- */
.main-content {
  flex: 1;
}

.settings-card {
  padding: 40px;
  height: 100%;
}

.section-title {
  color: #2dd4bf;
  font-size: 1.1rem;
  margin-bottom: 30px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid transparent;
}

.setting-row:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(45, 212, 191, 0.3);
  transform: translateX(5px);
}

.arrow {
  color: #2dd4bf;
  opacity: 0.5;
}

.logout-action {
  width: 100%;
  margin-top: 40px;
  padding: 16px;
  background: rgba(239, 68, 68, 0.05);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.logout-action:hover {
  background: #f87171;
  color: #fff;
}

/* --- 背景动画 --- */
.particles-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
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

/* 响应式适配 */
@media (max-width: 1024px) {
  .user-layout {
    flex-direction: column;
    padding: 20px;
  }
  .sidebar-container {
    width: 100%;
  }
}
</style>