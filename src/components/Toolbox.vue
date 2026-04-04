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

// Gold 和 Pyroxene 从配置读取
const gold = computed(() => {
  if (!currentConfig.value || currentConfig.value.gold === undefined) return 0
  return currentConfig.value.gold
})

const pyroxene = computed(() => {
  if (!currentConfig.value || currentConfig.value.pyroxene === undefined) return 0
  return currentConfig.value.pyroxene
})
</script>
