<template>
  <div class="encyclopedia-layout">
    <aside class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <router-link to="/user">
          <span v-if="!isCollapsed" class="sidebar-title">信息目录</span>
        </router-link>
        <button class="toggle-btn" @click="isCollapsed = !isCollapsed">
          {{ isCollapsed ? "▶" : "◀" }}
        </button>
      </div>

      <nav class="side-nav">
        <router-link to="/user/administrator" class="side-item">
          <span v-if="!isCollapsed" class="label">后台监测</span>
        </router-link>

        <router-link to="/user/userInfo" class="side-item">
          <span v-if="!isCollapsed" class="label">个人信息</span>
        </router-link>

        <router-link to="/user/settings" class="side-item">
          <span v-if="!isCollapsed" class="label">基础设置</span>
        </router-link>
      </nav>
    </aside>

    <main class="sub-content">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
const isCollapsed = ref(false);
</script>

<style scoped>
.encyclopedia-layout {
  display: flex;
  height: calc(100vh - 60px); /* 减去顶部导航栏的高度 */
  overflow: hidden;
  background: #020617;
}

/* 侧边栏磨砂效果 */
.sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-title {
  font-size: 1.5rem;
  color: #81c784;
  font-weight: bold;
}

.toggle-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 5px;
  opacity: 0.6;
}

.toggle-btn:hover {
  opacity: 1;
}

/* 侧边导航项 */
.side-nav {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.side-item {
  display: flex;
  align-items: center;
  padding: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: 0.3s;
  white-space: nowrap;
}

.side-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

/* 激活子路由的样式 */
.router-link-active {
  background: rgba(76, 175, 80, 0.15) !important;
  color: #81c784 !important;
  box-shadow: inset 0 0 10px rgba(76, 175, 80, 0.1);
}

.side-item .icon {
  font-size: 1.2rem;
  min-width: 30px;
  display: flex;
  justify-content: center;
}

.sub-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

/* 子页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>