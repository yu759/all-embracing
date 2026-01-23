<template>
  <div class="app-container visitor-gateway dynamic-bg">
    <div class="floating-particles-container">
      <div
        v-for="i in 30"
        :key="i"
        class="particle"
        :style="generateMixedParticleStyle()"
      ></div>
    </div>

    <div class="gateway-card glass-panel">
      <div class="header-section">
        <div class="logo-symbol">◈</div>
        <h1 class="title">万象 · 观测总署</h1>
        <p class="subtitle">汇集自然、生灵与星空的智慧终端</p>
      </div>

      <div class="action-zones">
        <section v-if="!userState.hasAccount" class="zone">
          <div class="zone-content">
            <h3>建立连接</h3>
            <p>创建一个统一的观测员档案，同步您的所有百科记录。</p>
            <router-link
              to="/user/account/registration"
              class="action-btn primary"
              >开启探索</router-link
            >
            <button class="text-link" @click="userState.hasAccount = true">
              已有通行权限
            </button>
          </div>
        </section>

        <section v-else class="zone">
          <div class="zone-content">
            <h3>身份验证</h3>
            <p>请输入您的观测员密钥以继续。</p>
            <router-link to="/user/account/login" class="action-btn secondary"
              >验证登录</router-link
            >
            <button class="text-link" @click="userState.hasAccount = false">
              返回初始化
            </button>
          </div>
        </section>

        <section class="zone guest-zone">
          <div class="divider"><span>NEUTRAL ACCESS</span></div>
          <button @click="continueAsGuest" class="action-btn ghost">
            匿名快速预览
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userState = reactive({ hasAccount: false });

const continueAsGuest = () => {
  localStorage.setItem("user_role", "guest");
  router.push("/encyclopedia/flower");
};

const generateMixedParticleStyle = () => {
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

<style scoped>
.visitor-gateway {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* 使用中性的黑曜石深灰色 */
  background: radial-gradient(circle at center, #1e293b 0%, #020617 100%);
  overflow: hidden;
  position: relative;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  padding: 60px;
  width: 90%;
  max-width: 460px;
  text-align: center;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
}

.logo-symbol {
  font-size: 3rem;
  color: #2dd4bf;
  margin-bottom: 10px;
}
/* --- 标题与描述：提亮，确保清晰 --- */
.zone-content h3 {
  color: #5eead4; /* 明亮青色 */
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 15px;
  /* 增加一点点光晕，让文字更“浮”出来 */
  text-shadow: 0 0 15px rgba(94, 234, 212, 0.4);
}

.zone-content p {
  color: #e2e8f0; /* 高亮蓝灰色，接近白但不刺眼 */
  font-size: 0.95rem;
  line-height: 1.7;
  opacity: 1; /* 确保不透明 */
  margin-bottom: 30px;
}

/* --- 分割线：提亮并增加质感 --- */
.divider {
  margin: 40px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
}

.divider span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #020617; /* 必须匹配你的背景深色 */
  padding: 0 15px;
  color: #5eead4; /* 与主题色一致，更清晰 */
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 2px;
}

/* --- 次要按钮：调淡，降低视觉权重 --- */
.text-link {
  background: none;
  border: none;
  /* 核心修改：使用暗蓝灰色，不使用白色 */
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 15px;
  display: inline-block;
  /* 下划线也调淡 */
  border-bottom: 1px solid rgba(100, 116, 139, 0.3);
  padding-bottom: 2px;
}

.text-link:hover {
  /* 鼠标悬停时才稍微变亮，给用户反馈 */
  color: #94a3b8;
  border-bottom-color: rgba(148, 163, 184, 0.8);
}

.title {
  color: #fff;
  font-size: 2rem;
  letter-spacing: 2px;
  /* 标题使用银白色到青色的微弱渐变，显得非常中性且专业 */
  background: linear-gradient(to right, #ffffff, #2dd4bf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 40px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  font-weight: bold;
  transition: all 0.3s;
  cursor: pointer;
  border: none;
  margin-bottom: 15px;
}

.primary {
  background: #2dd4bf;
  color: #020617;
}
.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.ghost {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.action-btn:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}

/* 粒子动画 */
.particle {
  position: absolute;
  border-radius: 50%;
  top: -5%;
  animation: fall linear infinite;
}
@keyframes fall {
  to {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}
</style>