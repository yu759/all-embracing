<!-- 需要完善的是 保留每一次选择-->
<template>
  <div class="settings-container">
    <div class="particles-bg">
      <div
        v-for="p in 30"
        :key="p"
        class="particle"
        :style="getParticleStyle()"
      ></div>
    </div>
    <div class="page-slider" :class="{ 'is-detail': currentPage === 'detail' }">
      <div class="page main-page">
        <div class="header"><SettingOutlined />通用</div>
        <a-list
          class="setting-content glass"
          :loading="loading"
          item-layout="horizontal"
          :data-source="data"
          ><template #renderItem="{ item }"
            ><a-list-item @click="goToDetail(item)" class="click-item"
              ><template #actions><RightOutlined /></template
              ><a-list-item-meta
                :id="item.id"
                :title="item.title"
                :description="item.desc"
                ><template #avatar
                  ><component
                    :is="item.icon"
                    :style="{
                      color: item.color,
                      fontSize: '16px',
                    }" /></template></a-list-item-meta></a-list-item></template
        ></a-list>
      </div>

      <div class="page detail-page">
        <div class="header">
          <a-button type="link" @click="goBack"><LeftOutlined /></a-button>
          <span>{{ currentTool?.title }}</span>
        </div>
        <div class="detail-content">
          <component
            v-if="currentTool && componentMap[currentTool.id]"
            :is="componentMap[currentTool.id]"
          />
          <a-empty v-else description="该功能模块尚未配置" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, markRaw } from "vue";
import {
  RightOutlined,
  LeftOutlined,
  SettingOutlined,
  BellOutlined,
  ReadOutlined,
  RocketOutlined,
  SoundOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons-vue";
import notification from "./tools/notification.vue";
import visual from "./tools/visual.vue";
import reading from "./tools/reading.vue";
import sound from "./tools/sound.vue";
import privacy from "./tools/privacy.vue";

// 1. 建立 ID 到 组件的映射
// 使用 markRaw 是为了告诉 Vue 不要对组件定义本身进行响应式追踪（性能优化）
const componentMap = {
  notification: markRaw(notification),
  visual: markRaw(visual),
  reading: markRaw(reading),
  sound: markRaw(sound),
  privacy: markRaw(privacy),
};
const loading = ref(false);
const currentPage = ref("main");
const currentTool = ref(null);
const data = [
  {
    id: "visual",
    title: "视觉与性能",
    icon: RocketOutlined,
    color: "#ff9c6e", // 活力橙
    desc: "管理动态特效与页面流畅度",
  },
  {
    id: "notification",
    title: "消息通知",
    icon: BellOutlined,
    color: "#1890ff", // 科技蓝
    desc: "系统公告跑马灯与推送设置",
  },
  {
    id: "reading",
    title: "阅读偏好",
    icon: ReadOutlined,
    color: "#52c41a", // 阅读绿
    desc: "字体大小与内容过滤",
  },
  {
    id: "sound",
    title: "音效管理",
    icon: SoundOutlined,
    color: "#fadb14", // 活力黄
    desc: "花园环境音与烟花音效",
  },
  {
    id: "privacy",
    title: "隐私与安全",
    icon: SafetyCertificateOutlined,
    color: "#ff4d4f", // 警示红
    desc: "账号安全与主页可见性",
  },
];

const images = [
  { url: "https://picsum.photos/800/400?random=1", alt: "风景1" },
  { url: "https://picsum.photos/800/400?random=2", alt: "风景2" },
  { url: "https://picsum.photos/800/400?random=3", alt: "风景3" },
  { url: "https://picsum.photos/800/400?random=4", alt: "风景4" },
  { url: "https://picsum.photos/800/400?random=5", alt: "风景5" },
];

// 3. 切换函数
const goToDetail = (tool) => {
  currentTool.value = tool;
  currentPage.value = "detail";
};

const goBack = () => {
  currentPage.value = "main";
};
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
</script>

<style  lang="less" scoped>
@import "./style.less";
</style>