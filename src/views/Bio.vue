<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useConfig } from '@/composables/useConfig'
import Header from '@/components/Header.vue'

const { configs } = useConfig()

const currentConfig = computed(() => configs.value)

const exp = computed(() => {
  if (!currentConfig.value || currentConfig.value.exp === undefined) return 0
  return currentConfig.value.exp
})

const nextExp = computed(() => {
  if (!currentConfig.value || currentConfig.value.nextExp === undefined) return 100
  return currentConfig.value.nextExp
})

const level = computed(() => {
  if (!currentConfig.value || currentConfig.value.level === undefined) return 1
  return currentConfig.value.level
})

const author = computed(() => {
  if (!currentConfig.value || !currentConfig.value.author) return 'Unknown'
  return currentConfig.value.author
})

const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

const strokeWidth = computed(() => {
  return Math.max(4, Math.round(windowWidth.value * 0.0025))
})
</script>

<template>
  <div class="bio-page">
    <!-- 头栏 -->
    <Header />
    <!-- 背景 -->
    <div class="bio-background"></div>
    <!-- 主容器 -->
    <div class="bio-container">
      <div id="left">
        <div class="level-box">
          <div class="container">
            <div class="level">
              <span>Lv.</span>
              <p>{{ level }}</p>
            </div>
            <div class="right">
              <span class="name">{{ author }}</span>
              <div>
                <a-progress
                  :percent="exp / nextExp"
                  :show-text="false"
                  :color="exp >= nextExp ? '#ffe433' : '#89d5fd'"
                  :stroke-width="strokeWidth"
                  trackColor="#535E67"
                >
                </a-progress>
                <p :style="{ color: exp >= nextExp ? '#ffe433' : '#66E0FE' }">
                  {{ exp >= nextExp ? 'MAX' : exp + '/' + nextExp }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="right">
        <div class="intro-title">
          <div class="title">自我介绍</div>
        </div>
        <div class="intro-content">
          <p>
            点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本点击输入文本
          </p>
        </div>
        <div class="btn-container">
          <a-button class="btn" type="primary">关于我</a-button>
          <a-button class="btn">关于我</a-button>
          <a-button class="btn" type="primary">关于我</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bio-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 背景 */
.bio-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/shitim/Event_Main_Stage_Bg.png');
  background-position: center;
  background-size: cover;
  z-index: -1;
}

.bio-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  padding-top: clamp(60px, 3.75vw, 100vw);
}

.bio-container #left,
.bio-container #right {
  flex: 1;
}

#left {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

/* Level.vue 样式复刻 */
.level-box {
  width: 40%;
  height: clamp(96px, 6vw, 100vw);
  background: #003153dd;
  position: absolute;
  bottom: clamp(40px, 2.5vw, 100vw);
  border-radius: clamp(8px, 0.5vw, 100vw);
  transform: skewX(-10deg);
  display: flex;
  z-index: 2;
}

.level-box .container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: auto 0 auto clamp(26px, 1.625vw, 100vw);
  width: 100%;
  height: calc(100% - clamp(26px, 1.625vw, 100vw));
  transform: skewX(10deg);
}

.level {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.1s;
}

.level-box:active .level {
  transform: scale(0.85);
}

.container .level p {
  color: #fff;
  font-size: clamp(42px, 2.625vw, 100vw);
  font-weight: 600;
  transform: skewX(-10deg);
}

.container .name {
  color: #fff;
  font-size: clamp(24px, 1.5vw, 100vw);
  font-weight: 600;
}

.container .level span {
  color: #ffe433;
  font-size: clamp(24px, 1.5vw, 100vw);
  font-weight: 600;
  transform: skewX(-10deg);
}

.right {
  align-self: flex-start;
  margin: 0 clamp(20px, 1.25vw, 100vw);
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  height: 100%;
}

.right p {
  font-size: clamp(20px, 1.25vw, 100vw);
  font-weight: 600;
}

#right {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-title {
  width: 80%;
  color: #fff;
  background-color: #003153;
  transform: skewX(-10deg);
  padding: clamp(10px, 0.625vw, 100vw) clamp(20px, 1.25vw, 100vw);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: clamp(8px, 0.5vw, 100vw);
}

.intro-title .title {
  font-size: clamp(32px, 2.0625vw, 100vw);
  transform: skewX(10deg);
}

#right .intro-content {
  width: 80%;
  margin-top: clamp(20px, 1.25vw, 100vw);
  padding: clamp(20px, 1.25vw, 100vw);
  background-color: #fff;
  border-radius: clamp(8px, 0.5vw, 100vw);
  font-size: clamp(20px, 1.25vw, 100vw);
}

#right .btn-container {
  width: 40%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  direction: rtl;
  gap: clamp(10px, 0.625vw, 100vw);
  position: absolute;
  bottom: clamp(40px, 2.5vw, 100vw);
}

#right .btn {
  width: 100%;
  padding: clamp(30px, 1.875vw, 100vw) 0 !important;
  font-size: clamp(24px, 1.5vw, 100vw) !important;
}

@media screen and (max-width: 768px) {

}
</style>
