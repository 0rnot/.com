<script setup>
import { Modal } from '@arco-design/web-vue'
import { h, ref, computed } from 'vue'

import { useConfig } from '@/composables/useConfig'
import { useAp } from '@/composables/useAp'

const { configs } = useConfig()
const { ap, maxAp } = useAp()

const emit = defineEmits(['switch'])
const props = defineProps(['l2dOnly', 'canskip'])

const currentConfig = computed(() => configs.value)
const img = ref('/img/max.png')
const showMin = ref(false)
const hover = ref(window.matchMedia('(hover: none)').matches)

// 【カスタム】ポップアップの中身を生成する関数
const about = () => {
  if (!currentConfig.value || !currentConfig.value.translate) {
    console.warn('配置未准备好，无法显示关于对话框')
    return
  }

  Modal.open({
    title: currentConfig.value.translate.about, // ja-JP.yamlの「about:」のテキスト
    content: () => [
      h('p', {}, `© ${new Date().getFullYear()} ${currentConfig.value.author}`), // configのauthor
      h('p', {}, 'Made by 0rnot'), // ← ★好きな文字に変更可能
      h('span', {}, currentConfig.value.translate.projectWebsite), // ja-JP.yamlの「projectWebsite:」のテキスト
      h('a', { href: 'https://github.com/0rnot/BA-style-homepage', target: '_blank' }, 'GitHub') // ← ★リンク先も変更済み
    ],
    footer: false
  })
}

const change = () => {
  if (!props.canskip) {
    img.value = img.value === '/img/min.png' ? '/img/max.png' : '/img/min.png'
    emit('switch')
  }
}

document.body.addEventListener('click', () => {
  if (props.l2dOnly && hover.value) {
    showMin.value = !showMin.value
  } else {
    showMin.value = true
  }
})

window.matchMedia('(hover: none)').addListener((e) => {
  hover.value = e.matches
})

// Gold 和 Pyroxene 从配置读取（万が一の読み込みエラー防止も追加）
const gold = computed(() => {
  const val = currentConfig.value?.gold
  return val !== undefined ? Number(val) : 0
})

const pyroxene = computed(() => {
  const val = currentConfig.value?.pyroxene
  return val !== undefined ? Number(val) : 0
})
</script>

<template>
  <div class="toolbox-box">
    <div
      class="toolbox"
      :class="{ 'toolbox-l2d': props.l2dOnly }"
    >
      <img src="/img/ap.png" alt="" />
      <span>{{ ap + '/' + maxAp }}</span>
    </div>
    <div
      class="toolbox"
      :class="{ 'toolbox-l2d': props.l2dOnly }"
    >
      <img src="/img/gold.png" alt="" />
      <span>{{ gold.toLocaleString() }}</span>
    </div>
    <div
      class="toolbox"
      :class="{ 'toolbox-l2d': props.l2dOnly }"
    >
      <img src="/img/pyroxene.png" alt="" />
      <span>{{ pyroxene.toLocaleString() }}</span>
    </div>
    <a
      class="about toolbox"
      :class="{ 'toolbox-l2d': props.l2dOnly }"
      @click="about"
    >
      <icon-info-circle class="css-cursor-hover-enabled" />
    </a>
    <a
      id="change"
      class="l2d toolbox"
      :class="{ 'toolbox-l2d': props.l2dOnly, 'canHover': !hover && !props.canskip }"
      @click="change"
      :style="{
        transition: 'transform 0.3s ' + (!props.l2dOnly ? 'ease-out' : 'ease-in') + ',opacity 0.6s',
        opacity: (!props.l2dOnly || (showMin && hover)) && !props.canskip ? 1 : 0
      }"
    >
      <img alt="" :src="img" />
    </a>
  </div>
</template>

<style scoped>
.toolbox-box {
  position: absolute;
  right: clamp(20px, 1.25vw, 100vw);
  top: clamp(40px, 2.5vw, 100vw);
  display: inline-flex;
  z-index: 2;
}

.toolbox-box .toolbox {
  min-width: 220px;
  min-height: 56px;
  width: 13.75vw;
  aspect-ratio: 220 / 56;
  background: #fffd;
  color: #003153;
  margin: 0 clamp(10px, 0.625vw, 100vw);
  transform: translateY(0) skew(-10deg);
  border-radius: clamp(6px, 0.375vw, 100vw);
  filter: drop-shadow(0px 0px clamp(3px, 0.1875vw, 100vw) #0003);
  transition:
    background-color 0.3s,
    transform 0.3s;
  display: flex;
  align-items: center;
}

.toolbox img {
  height: 70%;
  transform: skew(10deg);
  margin: 0 clamp(8px, 0.5vw, 100vw) 0 clamp(10px, 0.625vw, 100vw);
}
.toolbox span {
  font-size: clamp(26px, 1.625vw, 100vw);
  transform: skew(10deg);
}

.toolbox-box .toolbox.about,
.toolbox-box .toolbox.l2d {
  min-width: 80px;
  min-height: 56px;
  width: 5vw;
  aspect-ratio: 80 / 56;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.toolbox-box .toolbox.l2d {
  position: absolute;
  right: 0;
  top: clamp(76px, 4.75vw, 100vw);
  overflow: hidden;
  transform: translateY(0) skew(-10deg);
}

.toolbox.l2d img {
  filter: drop-shadow(-100vw 0px 0px #003153);
  transform: translateX(100vw);
  height: 2vw;
  min-height: 32px;
}

.toolbox-box .toolbox:hover {
  background: #fffe;
}

.toolbox-box .toolbox.about:active,
.toolbox-box .toolbox.l2d:active {
  transform: translateY(0) skew(-10deg) scale(0.9);
}

.arco-icon {
  font-size: clamp(32px, 2vw, 100vw);
  transform: skew(10deg);
}

@media screen and (max-width: 1199px) {
  .toolbox:not(.about) {
    display: none;
  }
}

@media screen and (max-width: 1600px) {
  .toolbox.toolbox-l2d {
    transform: translateY(-300px) skew(-10deg);
  }
  .toolbox.l2d.toolbox-l2d {
    transform: translateY(-76px) skew(-10deg);
  }
}

@media screen and (min-width: 1601px) {
  .toolbox.toolbox-l2d {
    transform: translateY(-18.75vw) skew(-10deg);
  }
  .toolbox.l2d.toolbox-l2d {
    transform: translateY(-4.75vw) skew(-10deg);
  }
}

.toolbox-box .toolbox.l2d.canHover:hover {
  opacity: 1 !important;
}
</style>
