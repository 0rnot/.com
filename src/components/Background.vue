<script setup>
import { Spine } from '@esotericsoftware/spine-pixi-v7'
import * as PIXI from 'pixi.js'
import { Modal } from '@arco-design/web-vue'
import { useConfig } from '@/composables/useConfig'
const { configs, locale } = useConfig()
const config = configs.value
const emit = defineEmits(['canskip', 'update:changeL2D'])
import { Howl } from 'howler'
import { ref } from 'vue'

const props = defineProps(['l2dOnly'])

let animation,
  id = 1
let canSkip = true
let soundList = []
let talking = false,
  talkIndex = 1
let modalRef
let originalOffsetPercent = (parseFloat(config.memorialLobbies[0].offset) || 0.7) * 100

const dialogue = ref('')
const showDialogue = ref(false)
const ifPetting = ref(false)
window.onresize = () => {
  dialogueDisplay.value.x =
    eval(config.memorialLobbies[id].dialogueDisplay.x) * document.documentElement.clientWidth
  dialogueDisplay.value.y =
    eval(config.memorialLobbies[id].dialogueDisplay.y) * document.documentElement.clientHeight
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
  console.log(config.memorialLobbies[id].voice[event.stringValue], event.stringValue)

  if (!config.memorialLobbies[id].voice[event.stringValue]) return

  dialogue.value = config.memorialLobbies[id].voice[event.stringValue]
  showDialogue.value = true
  let voice
  if (locale.value === 'zh') {
    voice = new Howl({
      src: [config.memorialLobbies[id].path + 'zh-CN/' + event.stringValue + '.ogg'],
      volume: 0.3
    })
  } else {
    voice = new Howl({
      src: [config.memorialLobbies[id].path + 'ja-JP/' + event.stringValue + '.ogg'],
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

  switch (num) {
    case '-':
      id = id === 0 ? config.memorialLobbies.length - 1 : id - 1
      break
    case '+':
      id = id === config.memorialLobbies.length - 1 ? 0 : id + 1
      break
    default:
      id = num
  }

  dialogueDisplay.value.x =
    eval(config.memorialLobbies[id].dialogueDisplay.x) * document.documentElement.clientWidth
  dialogueDisplay.value.y =
    eval(config.memorialLobbies[id].dialogueDisplay.y) * document.documentElement.clientHeight
  dialogueDisplay.value.position = config.memorialLobbies[id].dialogueDisplay.position

  animation = Spine.from('skeleton' + id, 'atlas' + id)
  if (animation) {
    animation.state.setAnimation(1, 'Dummy', true)
    animation.state.setAnimation(2, 'Dummy', true)
    animation.state.setAnimation(3, 'Dummy', true)
    animation.state.setAnimation(4, 'Dummy', true)
  }
  l2d.stage.addChild(animation)
  animation.scale.set(0.85)
  animation.state.setAnimation(0, 'Idle_01', true)
  animation.state.timeScale = 1
  animation.autoUpdate = true
  animation.y = 1440
  animation.x = 2560 / 2

  originalOffsetPercent = (parseFloat(config.memorialLobbies[id].offset) || 0.7) * 100
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
    modalRef = Modal.open({
      title: config.translate.info,
      content: config.translate.ifSkip,
      okText: config.translate.ok,
      cancelText: config.translate.cancel,
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

setL2D(id)
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
