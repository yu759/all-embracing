<template>
  <div class="account-container">
    <div class="particles-bg">
      <div v-for="i in 15" :key="i" class="particle" :style="getStyle()"></div>
    </div>

    <div class="auth-card glass">
      <div class="auth-header">
        <h2>创建档案</h2>
        <p>加入观测总署，开启您的全维度探索之旅</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label>设定观测名</label>
          <input
            type="text"
            v-model="form.username"
            placeholder="这将显示在您的档案中"
          />
        </div>

        <div class="input-group">
          <label>联络邮箱</label>
          <input
            type="email"
            v-model="form.email"
            placeholder="用于身份恢复与通知"
          />
        </div>

        <div class="input-row">
          <div class="input-group">
            <label>安全密钥</label>
            <input
              type="password"
              v-model="form.password"
              placeholder="不少于8位"
            />
          </div>
          <div class="input-group">
            <label>确认密钥</label>
            <input
              type="password"
              v-model="form.confirmPassword"
              placeholder="再次输入"
            />
          </div>
        </div>

        <p class="agreement">
          点击“开启探索”即代表您同意
          <router-link
            type="link"
            to="/user/account/privacyAndObserve?type=observe"
            >《观测员守则》</router-link
          >
          与
          <router-link
            type="link"
            to="/user/account/privacyAndObserve?type=observe"
            >《隐私协议》</router-link
          >
        </p>

        <button type="submit" class="submit-btn primary">开启探索</button>
      </form>

      <div class="auth-footer">
        <span>已有观测权限？</span>
        <router-link to="/user/account/login">返回验证登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import "./style.css";

const router = useRouter();
const form = reactive({ username: "", password: "", remember: false });

const handleRegister = () => {
  console.log("正在验证身份...", form);
  // 模拟登录成功跳转
  router.push("/user/userInfo");
};

const getStyle = () => {
  // 随机分配粉色、绿色、紫色的粒子，象征三个百科
  const colors = ["#f472b6", "#4ade80", "#a855f7", "#38bdf8"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
    animationDuration: `${10 + Math.random() * 15}s`,
    background: color,
    boxShadow: `0 0 8px ${color}`,
    opacity: Math.random() * 0.5 + 0.2,
  };
};
</script>