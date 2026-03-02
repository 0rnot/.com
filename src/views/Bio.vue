<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfig } from '@/composables/useConfig'

const router = useRouter()
const { configs } = useConfig()

const goBack = () => {
  router.back()
}

const bioSections = ref([
  {
    title: '关于我',
    icon: 'icon-user',
    content: '热爱技术与创作的开发者，喜欢探索新技术，致力于打造优秀的用户体验。'
  },
  {
    title: '技能栈',
    icon: 'icon-code',
    content: 'Vue.js, JavaScript, TypeScript, Node.js, Python, 以及更多前端技术。'
  },
  {
    title: '兴趣爱好',
    icon: 'icon-heart',
    content: '游戏开发, Live2D, 音乐, 以及一切有趣的技术探索。'
  },
  {
    title: '联系方式',
    icon: 'icon-email',
    content: '欢迎通过各个社交平台与我交流，一起探讨技术与创意！'
  }
])
</script>

<template>
  <div class="bio-page">
    <!-- 背景 -->
    <div class="bio-background"></div>
    
    <!-- 返回按钮 -->
    <div class="back-button" @click="goBack">
      <div class="back-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span>返回</span>
    </div>

    <!-- 主要内容 -->
    <div class="bio-container">
      <!-- 标题区域 -->
      <div class="bio-header">
        <div class="avatar-section">
          <div class="avatar">
            <img src="/favicon144.png" alt="Avatar" />
          </div>
          <div class="title-section">
            <h1>{{ configs.author || '小鱼' }}</h1>
            <p class="subtitle">个人档案</p>
          </div>
        </div>
      </div>

      <!-- 信息卡片区域 -->
      <div class="bio-content">
        <div 
          v-for="(section, index) in bioSections" 
          :key="index"
          class="bio-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="card-header">
            <div class="card-icon">
              <i :class="section.icon"></i>
            </div>
            <h3>{{ section.title }}</h3>
          </div>
          <div class="card-body">
            <p>{{ section.content }}</p>
          </div>
        </div>
      </div>

      <!-- 底部装饰 -->
      <div class="bio-footer">
        <p>「 蔚蓝档案风格个人主页 」</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bio-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  font-family: 'BlueakaBeta2GBK', sans-serif;
}

.bio-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  z-index: -1;
}

.bio-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(18, 138, 250, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(137, 213, 253, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: clamp(20px, 2vw, 40px);
  left: clamp(20px, 2vw, 40px);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: clamp(10px, 1vw, 15px) clamp(15px, 1.5vw, 25px);
  background: rgba(0, 49, 83, 0.8);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(137, 213, 253, 0.3);
}

.back-button:hover {
  background: rgba(0, 49, 83, 1);
  transform: translateX(-5px);
  box-shadow: 0 4px 15px rgba(137, 213, 253, 0.3);
}

.back-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon svg {
  width: 100%;
  height: 100%;
}

.back-button span {
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 600;
}

/* 主容器 */
.bio-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(80px, 10vw, 120px) clamp(20px, 4vw, 60px) clamp(40px, 5vw, 80px);
}

/* 头部区域 */
.bio-header {
  margin-bottom: clamp(40px, 5vw, 60px);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 40px);
  flex-wrap: wrap;
}

.avatar {
  width: clamp(80px, 10vw, 120px);
  height: clamp(80px, 10vw, 120px);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #89d5fd;
  box-shadow: 0 0 30px rgba(137, 213, 253, 0.4);
  background: linear-gradient(135deg, #003153, #2265bb);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-section h1 {
  font-size: clamp(28px, 4vw, 48px);
  color: #fff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(137, 213, 253, 0.5);
}

.subtitle {
  font-size: clamp(16px, 2vw, 24px);
  color: #89d5fd;
  margin: 0;
  font-weight: 500;
}

/* 内容卡片区域 */
.bio-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(20px, 3vw, 30px);
  margin-bottom: clamp(40px, 5vw, 60px);
}

.bio-card {
  background: rgba(0, 49, 83, 0.6);
  border-radius: 16px;
  padding: clamp(20px, 2.5vw, 30px);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(137, 213, 253, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(137, 213, 253, 0.2);
  border-color: rgba(137, 213, 253, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.card-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #89d5fd, #128AFA);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
}

.card-header h3 {
  font-size: clamp(18px, 2vw, 24px);
  color: #fff;
  margin: 0;
}

.card-body p {
  font-size: clamp(14px, 1.5vw, 16px);
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

/* 底部 */
.bio-footer {
  text-align: center;
  padding-top: clamp(20px, 3vw, 40px);
  border-top: 1px solid rgba(137, 213, 253, 0.2);
}

.bio-footer p {
  font-size: clamp(12px, 1.2vw, 14px);
  color: rgba(137, 213, 253, 0.6);
  margin: 0;
}

/* 响应式 */
@media screen and (max-width: 768px) {
  .avatar-section {
    justify-content: center;
    text-align: center;
  }
  
  .bio-content {
    grid-template-columns: 1fr;
  }
}
</style>
