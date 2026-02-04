<template>
  <div class="tool-detail-content">
    <section class="sound-section">
      <div class="setting-group glass">
        <div class="setting-row volume-control">
          <div class="label-group">
            <span class="main-label">全局主音量</span>
            <span class="sub-label">控制百科内所有音效的强度</span>
          </div>
          <div class="slider-wrapper">
            <SoundOutlined v-if="soundConfig.volume > 0" />
            <AudioMutedOutlined v-else />
            <a-slider
              v-model:value="soundConfig.volume"
              :max="100"
              @change="updateVolume"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sound-section">
      <h3 class="section-title">沉浸式环境音</h3>
      <div class="setting-group glass">
        <div class="setting-row vertical">
          <div class="label-group">
            <span class="main-label">背景氛围选择</span>
            <span class="sub-label">伴随你探索花卉与星空的静谧背景</span>
          </div>
          <a-segmented
            v-model:value="soundConfig.ambientType"
            :options="ambientOptions"
            block
            @change="handleAmbientChange"
          />
        </div>
        <div class="setting-row">
          <span class="main-label">开启自动播放</span>
          <a-switch v-model:checked="soundConfig.autoPlay" />
        </div>
      </div>
    </section>

    <section class="sound-section">
      <h3 class="section-title">交互音效</h3>
      <div class="setting-group glass">
        <div class="setting-row">
          <span class="main-label">按钮点击反馈</span>
          <a-switch v-model:checked="soundConfig.clickSound" />
        </div>
        <div class="setting-row">
          <span class="main-label">烟花绽放音效</span>
          <a-switch v-model:checked="soundConfig.featureSound" />
        </div>
      </div>
    </section>

    <audio ref="ambientPlayer" loop :src="currentAmbientUrl"></audio>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from "vue";
import { SoundOutlined, AudioMutedOutlined } from "@ant-design/icons-vue";

const ambientPlayer = ref(null);

const soundConfig = reactive({
  volume: 50,
  ambientType: "森林",
  autoPlay: false,
  clickSound: true,
  featureSound: true,
});

const ambientOptions = ["无", "森林", "雨声", "深海", "星空"];

// 模拟音源映射
const ambientMap = {
  森林: "https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-and-crickets-1210.mp3",
  雨声: "https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3",
  深海: "https://assets.mixkit.co/sfx/preview/mixkit-underwater-bubbles-loop-2365.mp3",
  星空: "https://assets.mixkit.co/sfx/preview/mixkit-dreamy-marimba-and-pad-loop-2537.mp3",
};

const currentAmbientUrl = computed(
  () => ambientMap[soundConfig.ambientType] || ""
);

// 更新音量
const updateVolume = (val) => {
  if (ambientPlayer.value) {
    ambientPlayer.value.volume = val / 100;
  }
};

// 切换背景音
const handleAmbientChange = (type) => {
  if (type === "无") {
    ambientPlayer.value.pause();
  } else {
    // 浏览器通常限制自动播放，需要用户交互
    setTimeout(() => {
      ambientPlayer.value
        .play()
        .catch((err) => console.log("等待用户激活音频"));
    }, 100);
  }
};
</script>

<style lang="less" scoped>
@import "../style.less";

.sound-section {
  margin-bottom: 24px;
  .section-title {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0 0 12px 10px;
  }
}

.setting-row {
  &.vertical {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .slider-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 150px;
    :deep(.ant-slider) {
      flex: 1;
    }
    .anticon {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);
    }
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

:deep(.ant-segmented) {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  .ant-segmented-item-selected {
    background: #81c784; // 匹配主题绿
    color: #000;
  }
}
</style>