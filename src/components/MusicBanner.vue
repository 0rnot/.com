<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import 'aplayer/dist/APlayer.min.css'
import APlayer from 'aplayer'
import { useConfig } from '@/composables/useConfig'

const ap = ref(null)
const isMiniMode = ref(false)

const { configs } = useConfig()
const ifICP = computed(() => configs.value?.ICP || '')

const checkScreenSize = () => {
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

// 完全にローカルの音楽ファイルを読み込む（複数曲対応版）
onMounted(() => {
  ap.value = new APlayer({
    container: document.getElementById('aplayer'),
    autoplay: false, // ブラウザの制限上、自動再生はfalseが推奨です
    mini: false,
    lrcType: 1,
    listFolded: true,
    loop: 'all',
    order: 'list', // 曲順に再生（ランダムにしたい場合は 'random' に変更）
    audio: [
      {
        name: 'Aoharu',
        artist: 'Nor',
        url: '/music/Track_34_Nor_Aoharu.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] 🎵\n'
      },
      {
        name: 'Constant Moderato',
        artist: 'Mitsukiyo',
        url: '/music/Theme_271_Title.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] 🎵\n'
      },
      {
        name: 'Signal of Abydos',
        artist: 'KARUT',
        url: '/music/Track_45_Nor_Signal_of_Abydos.ogg.mp3',
        cover: '/LOGO.png',
        lrc: '[00:00.000] 🎵\n'
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
  <div id="aplayer" :class="{ 'aplayer-mini': ifICP }"></div>
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
</style>
