<template>
  <div class="tool-detail-content">
    <section class="privacy-section">
      <h3 class="section-title">内容可见性</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <div class="label-group">
            <span class="main-label">个人花园可见性</span>
            <span class="sub-label">谁可以查看你的收藏和百科笔记</span>
          </div>
          <a-select
            v-model:value="privacy.visibility"
            style="width: 120px"
            :dropdown-match-select-width="false"
          >
            <a-select-option value="public">公开</a-select-option>
            <a-select-option value="friends">仅好友</a-select-option>
            <a-select-option value="private">私密</a-select-option>
          </a-select>
        </div>
        <div class="setting-row">
          <span class="main-label">隐藏勋章墙</span>
          <a-switch v-model:checked="privacy.hideBadges" />
        </div>
      </div>
    </section>

    <section class="privacy-section">
      <h3 class="section-title">数据管理</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <div class="label-group">
            <span class="main-label">导出个人数据</span>
            <span class="sub-label">下载所有百科收藏与偏好设置 (JSON)</span>
          </div>
          <a-button size="small" @click="handleExportData">导出</a-button>
        </div>
        <div class="setting-row">
          <div class="label-group">
            <span class="main-label">清除本地缓存</span>
            <span class="sub-label">清理已存储的离线百科图片与配置</span>
          </div>
          <a-button size="small" danger @click="handleClearCache"
            >清除</a-button
          >
        </div>
      </div>
    </section>

    <section class="privacy-section">
      <h3 class="section-title">追踪控制</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <span class="main-label">个性化推荐</span>
          <a-switch v-model:checked="privacy.allowRecommend" />
        </div>
        <div class="setting-row">
          <span class="main-label">发送匿名诊断数据</span>
          <a-switch v-model:checked="privacy.allowAnalytics" />
        </div>
      </div>
    </section>

    <section class="privacy-section">
      <h3 class="section-title danger-text">危险区域</h3>
      <div class="setting-group glass danger-border">
        <div class="setting-row">
          <div class="label-group">
            <span class="main-label">注销账号</span>
            <span class="sub-label">永久删除所有百科数据，不可恢复</span>
          </div>
          <a-button type="primary" danger @click="showDeleteConfirm"
            >注销</a-button
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { message, Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";

const privacy = reactive({
  visibility: "public",
  hideBadges: false,
  allowRecommend: true,
  allowAnalytics: true,
});

// --- 功能实现：清除缓存 ---
const handleClearCache = () => {
  Modal.confirm({
    title: "确定要清除缓存吗？",
    content: "这将重置所有本地偏好设置，包括走马灯图片。",
    onOk() {
      localStorage.clear();
      message.success("本地数据已完全清除");
      setTimeout(() => window.location.reload(), 1000); // 刷新页面使设置生效
    },
  });
};

// --- 功能实现：导出数据 ---
const handleExportData = () => {
  const data = JSON.stringify(privacy, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `encyclopedia-privacy-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
  message.success("数据准备就绪，开始下载");
};

// --- 功能实现：注销账号 (核平按钮) ---
const showDeleteConfirm = () => {
  Modal.confirm({
    title: "确定要注销账号吗？",
    icon: createVNode(ExclamationCircleOutlined),
    content: "此操作将抹除你在万象百科的所有足迹，该过程不可逆。",
    okText: "确认注销",
    okType: "danger",
    cancelText: "再想想",
    onOk() {
      message.loading("正在抹除数据...", 2).then(() => {
        message.error("账号已成功注销");
        // 这里执行注销后的跳转逻辑
      });
    },
  });
};
</script>

<style lang="less" scoped>
@import "../style.less";

.privacy-section {
  margin-bottom: 24px;
  .section-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0 0 12px 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    &.danger-text {
      color: #ff4d4f;
    }
  }
}

.setting-group {
  padding: 8px 16px;
  &.danger-border {
    border: 1px solid rgba(255, 77, 79, 0.2);
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .label-group {
      display: flex;
      flex-direction: column;
      .main-label {
        color: #f8fafc;
        font-size: 15px;
      }
      .sub-label {
        color: rgba(248, 250, 252, 0.4);
        font-size: 12px;
      }
    }
  }
}
</style>