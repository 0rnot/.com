<script setup>
import { Spine } from '@esotericsoftware/spine-pixi-v7'
import * as PIXI from 'pixi.js'
import { students } from '@/main'
import { Modal } from '@arco-design/web-vue'

const props = defineProps(['l2dOnly'])

let animation,
  id = 0
let canSkip = true
let modalRef

const l2d = new PIXI.Application({
  width: 2560,
  height: 1440,
  backgroundAlpha: 0
})

document.querySelector('#background').appendChild(l2d.view)

const emit = defineEmits(['update:changeL2D'])

const changeL2D = (value) => {
  emit('update:changeL2D', value)
}

const setL2D = async (num) => {
  canSkip = true
  l2d.stage.removeChild(animation)
  switch (num) {
    case '-':
      id = id === 0 ? students.length - 1 : id - 1
      break
    case '+':
      id = id === students.length - 1 ? 0 : id + 1
      break
    default:
      id = num
  }
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
  let startIdle = 'Start_Idle_01'
  if (!animation.state.data.skeletonData.findAnimation('Start_Idle_01')) startIdle = 'Start_idle_01'
  // animation.state.addListener({
  //   event: onEvent
  // })
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
          // animation.state.addListener({
          //   event: onEvent
          // })
          canSkip = false
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
      // animation.state.addListener({
      //   event: onEvent
      // })
      canSkip = false
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
      title: '通知',
      content: '是否跳过？',
      onOk: () => {
        changeL2D(false)
        animation.state.setAnimation(1, 'Dummy', true)
        animation.state.setAnimation(2, 'Dummy', true)
        animation.state.setAnimation(3, 'Dummy', true)
        animation.state.setAnimation(4, 'Dummy', true)
        animation.state.setAnimation(0, 'Idle_01', true)
        animation.state.listeners = []
        // animation.state.addListener({
        //   event: onEvent
        // });
        canSkip = false
      }
    })
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
</template>

<style scoped>
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
