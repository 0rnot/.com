<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import 'aplayer/dist/APlayer.min.css'
import APlayer from 'aplayer'
import { useConfig } from '@/composables/useConfig'

const ap = ref(null)
const playerRef = ref(null) // ★確実な読み込みのために追加
const isMiniMode = ref(false)

const { configs } = useConfig()
const ifICP = computed(() => configs.value?.ICP || '')

const checkScreenSize = () => {
  if (!ap.value) return
  if (ifICP.value) {
    ap.value.setMode('mini')
    return
  }

  isMiniMode.value = window.innerWidth <= 768

  if (isMiniMode.value) {
    ap.value.setMode('mini')
  } else {
    ap.value.setMode('normal')
  }
}

onMounted(async () => {
  await nextTick() // ★HTMLの描画完了を確実に待つ魔法
  ap.value = new APlayer({
    container: playerRef.value, // ★ID検索ではなく直接要素を指定
    autoplay: false,
    mini: false,
    lrcType: 1,
    listFolded: true,
    loop: 'all',
    order: 'list',
    theme: '#128AFA', // ★ブルアカブルーのアクセントカラー
    audio: [
      {
        name: 'Aoharu',
        artist: 'Nor',
        url: '/music/Track_34_Nor_Aoharu.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] Aoharu\n'
      },
      {
        name: 'Constant Moderato',
        artist: 'Mitsukiyo',
        url: '/music/Theme_271_Title.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] Constant Moderato\n'
      },
      {
        name: 'Signal of Abydos',
        artist: 'KARUT',
        url: '/music/Track_45_Nor_Signal_of_Abydos.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] Signal of Abydos\n'
      }
    ]
  })

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  if (ap.value) {
    ap.value.destroy()
  }
})
</script>

<template>
  <!-- ★ ref="playerRef" を追加して確実に関連付け -->
  <div id="aplayer" ref="playerRef" :class="{ 'aplayer-mini': ifICP }"></div>
</template>

<style scoped>
#aplayer {
  position: absolute;
  left: clamp(50px, 3.125vw, 100vw);
  bottom: clamp(180px, 11.25vw, 100vw);
  width: clamp(300px, 18.75vw, 100vw);
  aspect-ratio: 446 / 158;
  opacity: 0.9;
  z-index: 2;
  transition: transform 0.3s;
}

#aplayer:active {
  transform: scale(0.95);
}

#aplayer.aplayer-mini {
  right: clamp(20px, 1.25vw, 100vw);
  top: clamp(192px, 12vw, 100vw);
  left: unset;
  bottom: unset;
  width: clamp(120px, 7.5vw, 100vw);
  aspect-ratio: 1;
  border-radius: 100%;
  border: 2px white solid;
}

@media screen and (max-width: 768px) {
  #aplayer {
    right: clamp(20px, 1.25vw, 100vw);
    top: clamp(192px, 12vw, 100vw);
    left: unset;
    bottom: unset;
    width: clamp(120px, 7.5vw, 100vw);
    aspect-ratio: 1;
    border-radius: 100%;
    border: 2px white solid;
  }
}

@media screen and (max-width: 375px) {
  #aplayer {
    width: 96px;
  }
}
</style>

<style>
.aplayer.aplayer-withlrc .aplayer-pic {
  height: 100%;
  aspect-ratio: 1;
  width: unset;
}

.aplayer .aplayer-body,
.aplayer.aplayer-narrow .aplayer-body,
.aplayer.aplayer-narrow .aplayer-pic {
  height: 100%;
}

.aplayer .aplayer-body {
  background-size: contain;
  background: #f0f0f0 var(--deco1) no-repeat right !important;
}

.aplayer.aplayer-withlrc .aplayer-info {
  margin-left: clamp(103px, 6.4375vw, 100vw);
  height: 100%;
}

.aplayer .aplayer-lrc {
  height: calc(100% - 50px);
}

.aplayer .aplayer-lrc:after,
.aplayer .aplayer-lrc:before {
  background: unset;
}

/* ▼ カメレオン化（白飛び）防止：強制的に文字やボタンを黒にする ▼ */
.aplayer { color: #000 !important; }
.aplayer .aplayer-info .aplayer-music .aplayer-title { color: #000 !important; }
.aplayer .aplayer-info .aplayer-music .aplayer-author { color: #666 !important; }
.aplayer .aplayer-info .aplayer-controller .aplayer-time { color: #999 !important; }
.aplayer-icon svg { fill: #000 !important; }
.aplayer-icon path { fill: #000 !important; }
.aplayer .aplayer-list ol li .aplayer-list-title { color: #000 !important; }
.aplayer .aplayer-list ol li .aplayer-list-author { color: #666 !important; }
.aplayer .aplayer-lrc p { color: #666 !important; }
.aplayer .aplayer-lrc p.aplayer-lrc-current { color: #000 !important; font-weight: bold; }
/* ▲ ここまで ▲ */
</style>
