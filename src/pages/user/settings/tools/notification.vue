<template>
  <div class="tool-detail-content">
    <div>
      <a-carousel autoplay :autoplaySpeed="3000" effect="fade"
        ><div v-for="(image, index) in images" :key="index">
          <img :src="image.url" :alt="image.alt" class="carousel-img" /></div
      ></a-carousel>
    </div>

    <a-divider style="border-color: rgba(255, 255, 255, 0.1)" />

    <div class="setting-group glass">
      <div class="setting-row">
        <span :style="{ marginRight: '20px' }">开启全局通知</span>
        <a-switch v-model:checked="config.enabled" />
      </div>
      <a-divider style="border-color: rgba(255, 255, 255, 0.1)" />
      <div class="setting-row">
        <span>走马灯个性化配置</span>
        <div class="setting-control">
          <a-checkbox-group
            v-model:value="selectedContents"
            :disabled="!config.enabled"
          >
            <a-row :gutter="[0, 3]" :style="{ marginLeft: '20px' }">
              <a-col :span="8"
                ><a-checkbox value="system">系统维护通知</a-checkbox></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="encyclopedia"
                  >百科更新动态</a-checkbox
                ></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="weekly">星座周报</a-checkbox></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="feature">新功能介绍</a-checkbox></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="alert">紧急通知</a-checkbox></a-col
              >
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
      <a-divider style="border-color: rgba(255, 255, 255, 0.1)" />
      <div class="setting-row">
        <span>百科订阅列表</span>
        <div class="setting-control">
          <a-checkbox-group
            v-model:value="selectedEncContents"
            :disabled="!config.enabled"
          >
            <a-row :gutter="[0, 3]" :style="{ marginLeft: '20px' }">
              <a-col :span="8"
                ><a-checkbox value="flowers">鲜花百科</a-checkbox></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="animals">动物百科</a-checkbox></a-col
              >
              <a-col :span="8"
                ><a-checkbox value="constellation">星座百科</a-checkbox></a-col
              >
            </a-row>
          </a-checkbox-group>
        </div>
      </div>
      <a-divider style="border-color: rgba(255, 255, 255, 0.1)" />
      <div class="setting-row">
        <span :style="{ marginRight: '40px' }">免打扰时段</span>
        <div class="setting-control">
          <a-time-range-picker
            v-model:value="doNotDisturbTime"
            format="HH:mm"
            :disabled="!config.enabled"
            :placeholder="['开始时间', '结束时间']"
            style="width: 200px"
          />
          <span class="time-hint" v-if="doNotDisturbTime">
            每天 {{ formatTime(doNotDisturbTime[0]) }} 至
            {{ formatTime(doNotDisturbTime[1]) }}
          </span>
        </div>
      </div>
      <div class="setting-row">
        <div :style="{ marginRight: '20px' }">免打扰模式</div>
        <div class="setting-control">
          <a-radio-group
            v-model:value="doNotDisturbMode"
            :disabled="!config.enabled"
          >
            <a-radio value="silent">静默模式（只隐藏通知）</a-radio>
            <a-radio value="complete">完全模式（停止所有后台推送）</a-radio>
          </a-radio-group>
        </div>
      </div>

      <div v-if="config.enabled && doNotDisturbTime && isInDoNotDisturbTime">
        <a-alert
          message="当前处于免打扰时段"
          description="通知系统已静音，跑马灯已隐藏"
          type="info"
          show-icon
          :closable="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import dayjs from "dayjs";

const config = reactive({ enabled: true });
const selectedContents = ref(["system", "encyclopedia"]); // 多选框选中的值
const selectedEncContents = ref(["flowers"]); // 多选框选中的值，目前是定死了
const doNotDisturbTime = ref(null); // 免打扰时间段 [dayjs, dayjs]
const doNotDisturbMode = ref("silent"); // 单选框选中的值

const images = [
  {
    // 1. 星座/深空 (代替之前的星云)
    url: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "璀璨星空",
  },
  {
    // 2. 动物 (深海发光生物)
    url: "https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "发光水母",
  },
  {
    // 3. 花卉 (暗调微距)
    url: "https://images.pexels.com/photos/1083822/pexels-photo-1083822.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "深色郁金香",
  },
  {
    // 4. 星座/天文 (银河)
    url: "https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "银河背景",
  },
  {
    // 5. 动物 (暗夜猫头鹰)
    url: "https://images.pexels.com/photos/534129/pexels-photo-534129.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "神秘猫头鹰",
  },
];
// --- 辅助方法：格式化时间显示 ---
const formatTime = (time) => {
  if (!time) return "";
  // 如果使用的是 dayjs (AntD 默认时间对象)
  return time.format("HH:mm");
};

// --- 计算属性：判断当前是否在免打扰时间内 ---
const isInDoNotDisturbTime = computed(() => {
  if (!doNotDisturbTime.value || !doNotDisturbTime.value[0]) return false;

  const now = dayjs();
  const start = doNotDisturbTime.value[0];
  const end = doNotDisturbTime.value[1];

  // 简单逻辑判断（实际可能涉及跨天判断，这里取当前小时分钟）
  const nowVal = now.hour() * 60 + now.minute();
  const startVal = start.hour() * 60 + start.minute();
  const endVal = end.hour() * 60 + end.minute();

  return nowVal >= startVal && nowVal <= endVal;
});
</script>

<style lang="less" scoped>
@import "../style.less";
.tool-detail-content {
  padding: 20px;
}
.setting-group {
  margin-bottom: 32px;
  .setting-row {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    margin-left: 20px;
    margin-top: 20px;
    .setting-control {
      :deep(.ant-checkbox-wrapper) {
        color: #b7bcc1 !important; // 强制复写标签文字为纯白
        font-size: 14px;
        margin-bottom: 12px;
        margin-left: 0 !important; // 清除默认间距
        margin-right: 16px;
        transition: all 0.3s;

        &:hover {
          color: #81c784 !important; // 鼠标悬停变绿，增加交互感
        }
      }

      :deep(.ant-radio-wrapper) {
        color: #b7bcc1 !important; // 强制复写标签文字为纯白
        font-size: 14px;
        margin-bottom: 12px;
        margin-left: 0 !important; // 清除默认间距
        margin-right: 16px;
        transition: all 0.3s;

        &:hover {
          color: #81c784 !important; // 鼠标悬停变绿，增加交互感
        }
      }
      .time-hint {
        margin-left: 16px;
        color: rgba(255, 255, 255, 0.65);
        font-size: 14px;
      }
    }
  }
}
</style>