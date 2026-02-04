<template>
  <a-config-provider :locale="locale">
    <div class="main-layout">
      <!-- 顶部导航栏 -->
      <nav class="top-nav">
        <router-link to="/encyclopedia">百科全书</router-link> |
        <router-link to="/fireworks/heart">烟花展示</router-link> |
        <router-link to="/user">用户管理</router-link> |
        <router-link to="/garden/butterflyGarden">蝴蝶花园</router-link>|
        <router-link to="/eth">ETH</router-link>|
        <router-link to="/css">CSS</router-link>
      </nav>

      <!-- 页面内容区域 -->
      <div class="content-wrapper">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { useAppStore } from "./stores/app";

const locale = zhCN;
const appStore = useAppStore();

// 初始化应用
appStore.initApp();
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.top-nav {
  padding: 16px 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #e8e8e8;
}

.top-nav a {
  margin: 0 15px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.top-nav a:hover {
  color: #1890ff;
  background-color: #f0f7ff;
}

.top-nav a.router-link-active {
  color: #1890ff;
  background-color: #e6f7ff;
  position: relative;
}

.top-nav a.router-link-active::after {
  content: "";
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background-color: #1890ff;
  border-radius: 2px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 20px;
  min-height: calc(100vh - 120px);
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 12px;
  }

  .top-nav a {
    margin: 0 8px;
    padding: 6px 12px;
    font-size: 14px;
  }

  .content-wrapper {
    padding: 0 12px;
    margin: 16px auto;
  }
}
</style>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>