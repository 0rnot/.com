<script setup>
import { useLoading } from '@/composables/useLoading'
import Loading from '@/components/Loading.vue'
import Cursor from '@/components/Cursor.vue'

const { loading, percent } = useLoading()
</script>

<template>
  <!-- 加载状态 -->
  <transition name="loading">
    <Loading v-if="loading" :percent="percent" />
  </transition>

  <router-view v-if="!loading" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <!-- 幕布效果 -->
  <div id="curtain"></div>
  
  <!-- 自定义光标 -->
  <Cursor />
</template>

<style>
/* 导入样式文件 */
@import '@/assets/app.css';

/* ▼▼ 【最終決戦】app.css の呪いを後出しで完全に粉砕する究極魔法 ▼▼ */
:root, body[arco-theme] {
  /* Arco Designの根幹フォント変数をNoto Sans JPで塗り潰す */
  --arco-font-family: 'Noto Sans JP', sans-serif !important;
}

* {
  /* サイト内のすべての文字を強制的に本家風ゴシックにする */
  font-family: 'Noto Sans JP', sans-serif !important;
  font-weight: 700 !important; /* ブルアカUI特有の太字 */
  
  /* ボソボソ・カクカクを消し去り、最高に滑らかに描画させる */
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
}
/* ▲▲ ここまで ▲▲ */
</style>
