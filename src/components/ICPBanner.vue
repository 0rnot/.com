<script setup>
import { computed } from 'vue'
import { useConfig } from '@/composables/useConfig'

// 使用配置系统
const { configs } = useConfig()
const ifICP = computed(() => configs.value?.ICP || '')
const ifGongan = computed(() => configs.value?.gongan || '')
</script>

<template>
  <div id="icp-container">
    <img class="banner" src="/img/banner.png" alt="banner">
    <div v-if="ifICP || ifGongan" class="icp-content">
      <a v-if="ifICP" href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" class="icp-link" :data-text="ifICP">
        {{ ifICP }}
      </a>
      <a v-if="ifGongan" href="https://beian.mps.gov.cn/" target="_blank" rel="noopener noreferrer" class="gongan-link" :data-text="ifGongan">
        {{ ifGongan }}
      </a>
    </div>
  </div>
</template>

<style scoped>
#icp-container {
  position: absolute;
  left: clamp(50px, 3.125vw, 100vw);
  bottom: clamp(180px, 11.25vw, 100vw);
  width: clamp(300px, 18.75vw, 100vw);
  aspect-ratio: 446 / 158;
  opacity: 0.9;
  z-index: 2;
  transition: transform 0.3s;
  background-size: contain;
  background: #f0f0f0 var(--deco1) no-repeat right !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#icp-container:active {
  transform: scale(0.95);
}

.icp-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: clamp(6px, 0.375vw, 100vw);
  height: calc(100% - clamp(12px, 0.75vw, 100vw));
}

.banner {
  width: auto;
  height: 100%;
  position: relative;
  bottom: calc(0px - clamp(12px, 0.75vw, 100vw));
  left: 0;
}

.icp-link,
.gongan-link {
  color: #FFF;
  text-decoration: none;
  font-size: clamp(18px, 1.125vw, 100vw);
  display: flex;
  align-items: flex-start;
  transition: color 0.3s;
  font-weight: bold;
}

.icp-link::before,
.gongan-link::before {
  content: attr(data-text);
  position: absolute;
  color: transparent;
  font-weight: bold;
  -webkit-text-stroke: clamp(4px, 0.25vw, 100vw) #00AEEC;
  z-index: -1;
}

.icp-link:hover,
.gongan-link:hover {
  color: #0066cc;
}

@media screen and (max-width: 600px) { 
  #icp-container {
    display: none;
  }
}
</style>