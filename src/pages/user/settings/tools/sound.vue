<template>
  <div class="tool-detail-content">
    <div class="preview-box">
      <a-carousel autoplay :autoplaySpeed="3000" effect="fade"
        ><div v-for="(image, index) in images" :key="index">
          <img :src="image.url" :alt="image.alt" class="carousel-img" /></div
      ></a-carousel>
    </div>

    <a-divider style="border-color: rgba(255, 255, 255, 0.1)" />

    <div class="setting-group">
      <div class="setting-row">
        <span>开启全局通知</span>
        <a-switch v-model:checked="config.enabled" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
const config = reactive({ enabled: true });

const images = [
  { url: "https://picsum.photos/800/400?random=1", alt: "风景1" },
  { url: "https://picsum.photos/800/400?random=2", alt: "风景2" },
  { url: "https://picsum.photos/800/400?random=3", alt: "风景3" },
  { url: "https://picsum.photos/800/400?random=4", alt: "风景4" },
  { url: "https://picsum.photos/800/400?random=5", alt: "风景5" },
];
</script>

<style lang="less" scoped>
@import "../style.less";
.tool-detail-content {
  padding: 20px;
}
</style>