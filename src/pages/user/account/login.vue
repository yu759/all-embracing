<template>
  <div class="account-container dynamic-bg">
    <div class="particles-bg">
      <div v-for="i in 15" :key="i" class="particle" :style="getStyle()"></div>
    </div>

    <div class="auth-card glass">
      <div class="auth-header">
        <h2>验证登录 / Sign In</h2>
        <p>请输入您的观测员密钥以同步数据库</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>观测员账号</label>
          <input
            type="text"
            v-model="form.username"
            placeholder="UID / 邮箱地址"
            required
          />
        </div>

        <div class="input-group">
          <label>访问密钥</label>
          <input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            required
          />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.remember" /> 保持连接
          </label>
          <a-button type="link"> 找回密钥? </a-button>
        </div>

        <button type="submit" class="submit-btn primary">验证身份</button>
      </form>

      <div class="auth-footer">
        <span>还没有档案？</span>
        <router-link to="/user/account/registration"
          >立即创建探索档案</router-link
        >
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

const handleLogin = () => {
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