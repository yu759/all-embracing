<template>
  <div class="tool-detail-content">
    <section class="preview-section glass">
      <div class="preview-text" :style="previewStyle">
        <h4>🌻 鲜花百科：向日葵</h4>
        <p>
          向日葵（学名：Helianthus
          annuus）是一种大型一年生草本植物。其花盘随太阳转动的特性，使其成为了生命力与希望的象征...
        </p>
      </div>
    </section>

    <section class="reading-section">
      <h3 class="section-title">字号与间距</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <span class="main-label">字体大小</span>
          <div class="slider-wrapper">
            <span :style="{ fontSize: '12px' }">A</span>
            <a-slider
              v-model:value="reading.fontSize"
              :min="12"
              :max="24"
              :step="1"
            />
            <span :style="{ fontSize: '18px' }">A</span>
          </div>
        </div>
        <div class="setting-row">
          <span class="main-label">行高倍数</span>
          <a-segmented
            v-model:value="reading.lineHeight"
            :options="[1.2, 1.5, 1.8, 2.0]"
          />
        </div>
      </div>
    </section>

    <section class="reading-section">
      <h3 class="section-title">阅读环境</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <div class="label-group">
            <span class="main-label">护眼模式</span>
            <span class="sub-label">降低蓝光，模拟纸质书的淡黄色调</span>
          </div>
          <a-switch v-model:checked="reading.eyeCare" />
        </div>
        <div class="setting-row">
          <span class="main-label">背景底色</span>
          <a-radio-group v-model:value="reading.theme" button-style="solid">
            <a-radio-button value="default">默认</a-radio-button>
            <a-radio-button value="parchment">羊皮纸</a-radio-button>
            <a-radio-button value="midnight">深夜</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </section>

    <section class="reading-section">
      <h3 class="section-title">百科专属优化</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <span class="main-label">隐藏植物学名</span>
          <a-switch v-model:checked="reading.hideLatin" />
        </div>
        <div class="setting-row">
          <span class="main-label">自动展开专业术语</span>
          <a-switch v-model:checked="reading.autoExpand" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";

const reading = reactive({
  fontSize: 16,
  lineHeight: 1.5,
  eyeCare: false,
  theme: "default",
  hideLatin: false,
  autoExpand: true,
});

// 计算预览区的样式
const previewStyle = computed(() => {
  const styles = {
    fontSize: `${reading.fontSize}px`,
    lineHeight: reading.lineHeight,
    transition: "all 0.3s ease",
  };

  // 护眼模式滤镜
  if (reading.eyeCare) {
    styles.filter = "sepia(0.4) saturate(0.8)";
  }

  // 主题颜色映射
  const themeColors = {
    default: { bg: "rgba(255,255,255,0.05)", text: "#f8fafc" },
    parchment: { bg: "#f4e4bc", text: "#5d4037" },
    midnight: { bg: "#0f172a", text: "#94a3b8" },
  };

  const currentTheme = themeColors[reading.theme];
  styles.backgroundColor = currentTheme.bg;
  styles.color = currentTheme.text;

  return styles;
});
</script>

<style lang="less" scoped>
@import "../style.less";

.preview-section {
  padding: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  .preview-text {
    padding: 15px;
    border-radius: 12px;
    min-height: 120px;
    h4 {
      margin-top: 0;
      color: inherit;
    }
    p {
      margin-bottom: 0;
      font-size: 0.9em;
      opacity: 0.8;
    }
  }
}

.reading-section {
  margin-bottom: 24px;
  .section-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0 0 12px 10px;
  }
}

.setting-row {
  .slider-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 200px;
    :deep(.ant-slider) {
      flex: 1;
    }
  }
}

:deep(.ant-radio-button-wrapper) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
  &.ant-radio-button-wrapper-checked {
    background: #81c784;
    color: #000;
  }
}
</style>