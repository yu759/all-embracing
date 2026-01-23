<template>
  <div class="page-wrapper">
    <div class="protocol-card">
      <div class="protocol-header">
        <h2>{{ type === "privacy" ? "隐私协议" : "观测员守则" }}</h2>
        <button class="close-btn" @click="$router.back()">×</button>
      </div>

      <div class="protocol-content">
        <div class="markdown-body" v-html="renderedHtml"></div>
      </div>

      <div class="protocol-footer">
        <button
          class="confirm-btn"
          :disabled="!canConfirm"
          :class="{ 'is-disabled': !canConfirm }"
          @click="$router.back()"
        >
          {{ canConfirm ? "我已阅读并知晓" : `请阅读全文 (${countdown}s)` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import MarkdownIt from "markdown-it";
// 如果你安装了 github-markdown-css，可以保留，否则我们将自定义样式
import "github-markdown-css/github-markdown-light.css";

import privacyContent from "@/assets/agreement/privacy.md?raw";
import observeContent from "@/assets/agreement/observe.md?raw";

const route = useRoute();
const md = new MarkdownIt();

// 获取路由参数 ?type=privacy 或 ?type=observe
const type = computed(() => route.query.type || "privacy");

const countdown = ref(5); // 初始秒数
const canConfirm = ref(false); // 按钮是否可点击
let timer = null;

// 开始倒计时的函数
const startTimer = () => {
  canConfirm.value = false;
  countdown.value = 5;

  // 清除已有定时器（防止切换协议时叠加）
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      canConfirm.value = true;
      clearInterval(timer);
    }
  }, 1000);
};
const renderedHtml = computed(() => {
  const content = type.value === "observe" ? observeContent : privacyContent;
  return md.render(content);
});

// 页面加载时启动
onMounted(() => {
  startTimer();
});

// 关键：当用户切换协议（type 变化）时，重新开始倒计时
watch(
  () => route.query.type,
  () => {
    startTimer();
  }
);

// 销毁组件时清除定时器，防止内存泄漏
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
/* 1. 全屏背景（与登录页一致） */
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* 这里的背景色建议换成你登录页真实的背景图或渐变色 */
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding: 20px;
}

/* 2. 协议窗体：固定大小 + 磨砂玻璃效果 */
.protocol-card {
  width: 100%;
  max-width: 800px; /* 限制最大宽度 */
  height: 80vh; /* 限制高度为屏幕的 80% */
  background: rgba(255, 255, 255, 0.05); /* 半透明背景 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

/* 3. 头部固定 */
.protocol-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.protocol-header h2 {
  color: #2dd4bf; /* 你之前的青色 */
  margin: 0;
  font-size: 1.25rem;
}
.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
}

/* 4. 内容滚动区 */
.protocol-content {
  flex: 1;
  overflow-y: auto; /* 关键：超出部分内部滚动 */
  padding: 30px;
  color: #e2e8f0; /* 浅灰色文字适配暗色背景 */
  line-height: 1.8;
  text-align: left;
}

/* 5. 底部固定按钮 */
.protocol-footer {
  padding: 16px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.confirm-btn {
  background: #2dd4bf;
  color: #0f172a;
  border: none;
  padding: 10px 32px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 180px; /* 固定宽度，防止文字变化时按钮抖动 */
}
.confirm-btn:hover {
  background: #5eead4;
  transform: translateY(-1px);
}
/* 禁用状态的样式 */
.confirm-btn:disabled {
  background: rgba(255, 255, 255, 0.1); /* 变暗变透 */
  color: #64748b; /* 文字变灰 */
  cursor: not-allowed; /* 禁用手势 */
  transform: none !important; /* 取消悬浮位移 */
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* 只有在非禁用状态下才有 hover 效果 */
.confirm-btn:not(:disabled):hover {
  background: #5eead4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3);
}

/* 6. 自定义滚动条样式 (美化) */
.protocol-content::-webkit-scrollbar {
  width: 6px;
}
.protocol-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

/* 7. 覆盖 Markdown 默认样式以适配深色模式 */
:deep(.markdown-body) {
  background: transparent !important;
  color: #cbd5e1 !important;
  font-family: inherit;
}
:deep(.markdown-body h1, .markdown-body h2, .markdown-body h3) {
  color: #f8fafc;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.markdown-body blockquote) {
  border-left: 4px solid #2dd4bf;
  background: rgba(45, 212, 191, 0.1);
  color: #94a3b8;
}
</style>