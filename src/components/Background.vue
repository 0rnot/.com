<script setup>
import { Spine } from '@esotericsoftware/spine-pixi-v7'
import * as PIXI from 'pixi.js'
import { Modal } from '@arco-design/web-vue'
import { useConfig } from '@/composables/useConfig'
const { configs, locale } = useConfig()
const emit = defineEmits(['canskip', 'update:changeL2D'])
import { Howl } from 'howler'
import { ref, computed, watch } from 'vue'

const props = defineProps(['l2dOnly'])

let animation,
  id = 0
let canSkip = true
let soundList = []
let talking = false,
  talkIndex = 1
let modalRef
let originalOffsetPercent = 70 // 默认值，等待配置加载后更新

const dialogue = ref('')
const showDialogue = ref(false)
const ifPetting = ref(false)
const currentConfig = computed(() => configs.value)

const updateDialoguePosition = () => {
  if (
    currentConfig.value &&
    currentConfig.value.memorialLobbies &&
    currentConfig.value.memorialLobbies[id]
  ) {
    const lobby = currentConfig.value.memorialLobbies[id]
    dialogueDisplay.value.x = eval(lobby.dialogueDisplay.x) * document.documentElement.clientWidth
    dialogueDisplay.value.y = eval(lobby.dialogueDisplay.y) * document.documentElement.clientHeight
  }
}

window.onresize = () => {
  updateDialoguePosition()
}

const dialogueDisplay = ref({
  x: 0,
  y: 0,
  position: 'left'
})

const l2d = new PIXI.Application({
  width: 2560,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.view)

const changeL2D = (value) => {
  emit('update:changeL2D', value)
}

const onEvent = (entry, event) => {
  if (event.stringValue === '') return

  if (
    !currentConfig.value ||
    !currentConfig.value.memorialLobbies ||
    !currentConfig.value.memorialLobbies[id]
  ) {
    return
  }

  const lobby = currentConfig.value.memorialLobbies[id]
  console.log(lobby.voice[event.stringValue], event.stringValue)

  if (!lobby.voice[event.stringValue]) return

  dialogue.value = lobby.voice[event.stringValue]
  showDialogue.value = true
  let voice
  if (locale.value === 'zh') {
    voice = new Howl({
      src: [lobby.path + 'zh-CN/' + event.stringValue + '.ogg'],
      volume: 0.3
    })
  } else {
    voice = new Howl({
      src: [lobby.path + 'ja-JP/' + event.stringValue + '.ogg'],
      volume: 0.3
    })
  }

  if (voice.state() === 'loaded') voice.play()
  else if (voice.state() === 'loading') {
    voice.on('load', () => {
      voice.play()
    })
  }
  soundList.push(voice)
}

const setL2D = async (num) => {
  if (!currentConfig.value || !currentConfig.value.memorialLobbies) {
    console.warn('配置未准备好，跳过Live2D切换')
    return
  }

  canSkip = true
  emit('canskip', true)
  talking = false
  talkIndex = 1
  if (soundList.length !== 0) {
    for (let i in soundList) soundList[i].stop()
    soundList = []
  }
  if (animation) {
    animation.state.listeners = []
    animation.state.addListener({
      event: onEvent
    })
  }
  l2d.stage.removeChild(animation)

  const lobbies = currentConfig.value.memorialLobbies

  switch (num) {
    case '-':
      id = id === 0 ? lobbies.length - 1 : id - 1
      break
    case '+':
      id = id === lobbies.length - 1 ? 0 : id + 1
      break
    default:
      id = num
  }

  if (id < 0 || id >= lobbies.length) {
    console.error('角色索引超出范围:', id, '角色总数:', lobbies.length)
    return
  }

  const lobby = lobbies[id]

  // 检查必需的属性
  if (!lobby.path || !lobby.skel || !lobby.atlas) {
    console.error('角色资源配置不完整:', {
      角色名: lobby.name,
      path: lobby.path,
      skel: lobby.skel,
      atlas: lobby.atlas,
      完整配置: lobby
    })
    return
  }

  dialogueDisplay.value.x = eval(lobby.dialogueDisplay.x) * document.documentElement.clientWidth
  dialogueDisplay.value.y = eval(lobby.dialogueDisplay.y) * document.documentElement.clientHeight
  dialogueDisplay.value.position = lobby.dialogueDisplay.position

  try {
    // 使用配置文件中定义的实际资源路径
    const skeletonPath = lobby.path + lobby.skel
    const atlasPath = lobby.path + lobby.atlas

    console.log('加载Live2D资源:', {
      角色: lobby.name,
      骨架路径: skeletonPath,
      图集路径: atlasPath
    })

    // 先预加载资源 (使用与 live2d.js 相同的别名格式)
    const skeletonAlias = `skeleton_${id}`
    const atlasAlias = `atlas_${id}`

    PIXI.Assets.add({ alias: skeletonAlias, src: skeletonPath })
    PIXI.Assets.add({ alias: atlasAlias, src: atlasPath })
    await PIXI.Assets.load([skeletonAlias, atlasAlias])

    // 然后创建动画
    animation = Spine.from(skeletonAlias, atlasAlias)
    if (animation) {
      animation.state.setAnimation(1, 'Dummy', true)
      animation.state.setAnimation(2, 'Dummy', true)
      animation.state.setAnimation(3, 'Dummy', true)
      animation.state.setAnimation(4, 'Dummy', true)
      l2d.stage.addChild(animation)
    } else {
      console.error('Live2D 动画创建失败，角色:', lobby.name)
      return
    }
  } catch (error) {
    console.error('Live2D 资源加载失败:', error, '角色:', lobby.name, '资源路径:', lobby.path)
    return
  }
  animation.scale.set(0.85)
  animation.state.setAnimation(0, 'Idle_01', true)
  animation.state.timeScale = 1
  animation.autoUpdate = true
  animation.y = 1440
  animation.x = 2560 / 2

  originalOffsetPercent = (parseFloat(lobby.offset) || 0.7) * 100
  l2d.view.style.transform = `translateX(calc((50% - ${originalOffsetPercent} * 1%) * (1 - min(1, 100vw / 1200px))))`

  let startIdle = 'Start_Idle_01'
  showDialogue.value = false
  if (!animation.state.data.skeletonData.findAnimation('Start_Idle_01')) startIdle = 'Start_idle_01'
  animation.state.addListener({
    event: onEvent
  })
  if (animation.state.data.skeletonData.findAnimation(startIdle)) {
    changeL2D(true)
    animation.state.setAnimation(0, startIdle, false)
    if (
      animation.state.getCurrent(0).animation.name !== 'Idle_01' &&
      animation.state.data.skeletonData.findAnimation('Idle_01')
    ) {
      animation.state.addAnimation(0, 'Idle_01', true)
    }
    let listener = {
      complete: (entry) => {
        if (entry.trackIndex === 0 && entry.animation.name !== 'Idle_01') {
          changeL2D(false)
          animation.state.listeners = []
          animation.state.addListener({
            event: onEvent
          })
          canSkip = false
          emit('canskip', false)
          if (modalRef) {
            modalRef.close()
          }
        }
      }
    }
    animation.state.addListener(listener)
  } else {
    changeL2D(false)
    if (
      animation.state.getCurrent(0).animation.name !== 'Idle_01' &&
      animation.state.data.skeletonData.findAnimation('Idle_01')
    ) {
      animation.state.setAnimation(0, 'Idle_01', true)
      animation.state.listeners = []
      animation.state.addListener({
        event: onEvent
      })
      canSkip = false
      emit('canskip', false)
      if (modalRef) {
        modalRef.close()
      }
    }
  }
}

const skipStartIdle = () => {
  if (
    animation.state.getCurrent(0).animation.name !== 'Idle_01' &&
    animation.state.data.skeletonData.findAnimation('Idle_01')
  ) {
    if (!currentConfig.value || !currentConfig.value.translate) {
      console.warn('配置未准备好，无法显示跳过对话框')
      changeL2D(false)
      return
    }

    modalRef = Modal.open({
      title: currentConfig.value.translate.info,
      content: currentConfig.value.translate.ifSkip,
      okText: currentConfig.value.translate.ok,
      cancelText: currentConfig.value.translate.cancel,
      onOk: () => {
        changeL2D(false)
        if (soundList.length !== 0) {
          for (let i in soundList) soundList[i].stop()
          soundList = []
        }
        animation.state.setAnimation(1, 'Dummy', true)
        animation.state.setAnimation(2, 'Dummy', true)
        animation.state.setAnimation(3, 'Dummy', true)
        animation.state.setAnimation(4, 'Dummy', true)
        animation.state.setAnimation(0, 'Idle_01', true)
        animation.state.listeners = []
        animation.state.addListener({
          event: onEvent
        })
        canSkip = false
        emit('canskip', false)
      }
    })
  }
}

const onInteractionWithStudent = () => {
  if (
    talking ||
    animation.state.getCurrent(0).animation.name.toLowerCase().startsWith('start_idle')
  )
    return
  console.log('Talk_0' + talkIndex)
  if (
    animation.state.data.skeletonData.findAnimation('Talk_0' + talkIndex + '_A_CN') &&
    locale.value === 'zh'
  ) {
    // 判断所用回忆大厅是否有专门给国服配音卡口型
    animation.state.addAnimation(1, 'Talk_0' + talkIndex + '_A_CN')._mixDuration = 0.3
    animation.state.addAnimation(2, 'Talk_0' + talkIndex + '_M_CN')._mixDuration = 0.3
  } else {
    animation.state.addAnimation(1, 'Talk_0' + talkIndex + '_A')._mixDuration = 0.3
    animation.state.addAnimation(2, 'Talk_0' + talkIndex + '_M')._mixDuration = 0.3
  }
  animation.state.addAnimation(1, 'Dummy', true)._mixDuration = 0.3
  animation.state.addAnimation(2, 'Dummy', true)._mixDuration = 0.3
  let listener = {
    complete: (entry) => {
      if (entry.trackIndex === 1 && entry.animation.name !== 'Dummy') {
        animation.state.listeners = []
        animation.state.addListener({
          event: onEvent
        })
        talking = false
        showDialogue.value = false
        console.log('end!')
      }
    }
  }
  animation.state.addListener(listener)
  talkIndex++
  if (!animation.state.data.skeletonData.findAnimation('Talk_0' + talkIndex + '_A')) talkIndex = 1
  talking = true
}

const onPetStudent = () => {
  if (
    talking ||
    animation.state.getCurrent(0).animation.name.toLowerCase().startsWith('start_idle')
  )
    return
  // console.log('Talk_0' + talkIndex)
  animation.state.addAnimation(1, 'Pat_01_A', true)._mixDuration = 0.3
  animation.state.addAnimation(2, 'Pat_01_M', true)._mixDuration = 0.3
  ifPetting.value = true
}

let pressTimer = null

// 处理长按事件的回调函数
const handleLongPress = () => {
  if (talking) return
  console.log('长按事件触发')
  onPetStudent()

  let a = setInterval(() => {
    if (pressTimer === null) {
      ifPetting.value = false
      animation.state.addAnimation(1, 'PatEnd_01_A')._mixDuration = 0.3
      animation.state.addAnimation(2, 'PatEnd_01_M')._mixDuration = 0.3
      animation.state.addAnimation(1, 'Dummy', true)._mixDuration = 0.3
      animation.state.addAnimation(2, 'Dummy', true)._mixDuration = 0.3
      console.log('end!')
      clearInterval(a)
    }
  }, 10)
}

const vLongPress = {
  mounted(el, binding) {
    // 创建定时器
    const start = (e) => {
      // 防止重复设置定时器
      if (pressTimer === null) {
        pressTimer = setTimeout(() => {
          // 执行绑定值中的函数
          binding.value(e)
        }, 500)
      }
    }

    // 取消定时器
    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer)
        if (!ifPetting.value) {
          onInteractionWithStudent()
        }
        pressTimer = null
      }
    }

    // 添加事件监听器
    el.addEventListener('mousedown', start)
    el.addEventListener('touchstart', start)

    // 取消定时器的事件
    el.addEventListener('click', cancel)
    el.addEventListener('mouseout', cancel)
    el.addEventListener('touchend', cancel)
    el.addEventListener('touchcancel', cancel)
  }
}

// 等待配置加载完成后初始化Live2D
const initLive2DWhenReady = () => {
  if (currentConfig.value && currentConfig.value.memorialLobbies) {
    setL2D(id)
  }
}

// 监听配置变化
watch(
  currentConfig,
  (newConfig) => {
    if (newConfig && newConfig.memorialLobbies && newConfig.memorialLobbies.length > 0) {
      initLive2DWhenReady()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="change" v-if="!props.l2dOnly">
    <img class="css-cursor-hover-enabled" @click="setL2D('-')" src="/l2d/arrow.png" alt="" />
    <img class="css-cursor-hover-enabled" @click="setL2D('+')" src="/l2d/arrow.png" alt="" />
  </div>
  <div
    v-if="props.l2dOnly && canSkip"
    style="position: fixed; width: 100%; height: 100%"
    @click="skipStartIdle()"
  ></div>
  <a-trigger
    v-else
    :popup-visible="showDialogue"
    :popup-translate="[dialogueDisplay.x, dialogueDisplay.y]"
    :position="dialogueDisplay.position"
    :show-arrow="true"
  >
    <div class="interaction css-cursor-hover-enabled" v-long-press="handleLongPress"></div>
    <template #content>
      <div class="dialogue">
        {{ dialogue }}
      </div>
    </template>
  </a-trigger>
</template>

<style scoped>
.dialogue {
  padding: 30px 20px;
  max-width: 280px;
  width: calc(40vw - 20px);
  font-size: 24px;
  background-color: #f0f0f0dd;
  border-radius: 10px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
}

#change {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.interaction {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 66%;
  height: 100%;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
}

img {
  width: 32px;
  height: auto;
  animation: move 2s ease-in-out infinite;
  z-index: 1000;
}

img:last-child {
  transform: rotate(180deg);
  animation: moveReverse 2s ease-in-out infinite;
}

@keyframes move {
  0% {
    transform: translateX(10px);
  }
  50% {
    transform: translateX(30px);
  }
  100% {
    transform: translateX(10px);
  }
}

@keyframes moveReverse {
  0% {
    transform: rotate(180deg) translateX(10px);
  }
  50% {
    transform: rotate(180deg) translateX(30px);
  }
  100% {
    transform: rotate(180deg) translateX(10px);
  }
}
</style>
