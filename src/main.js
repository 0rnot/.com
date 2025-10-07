import './assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { createApp } from 'vue'
import { Modal } from '@arco-design/web-vue'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import { registerSW } from 'virtual:pwa-register'
import { useConfig } from '@/composables/useConfig'
const { configs } = useConfig()
const config = configs.value

import { css } from './assets/font/BlueakaBeta2GBK-DemiBold.ttf'
import { css as css2 } from './assets/font/BlueakaBeta2GBK-Bold.ttf'
console.log(css.family, css.weight);
console.log(css2.family, css2.weight);

const app = createApp(App)
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.mount('#app')

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      Modal.open({
        title: config.translate.info,
        content: config.translate.update,
        okText: config.translate.ok,
        cancelText: config.translate.cancel,
        onOk: () => {
          updateSW(true)
        }
      })
    }
  })
}

window.l2d_complete = false

setInterval(() => {
  document.querySelectorAll('a[href]:not(.tag)').forEach((link) => {
    link.classList.add('tag')
    link.addEventListener('click', async (e) => {
      const url = link.getAttribute('href')
      e.preventDefault()
      document.querySelector('#curtain').style.display = 'block'
      setTimeout(() => {
        let a = document.createElement('a')
        a.href = url
        a.target = '_blank'
        a.click()
      }, 900)
      setTimeout(() => (document.querySelector('#curtain').style.display = ''), 3000)
    })
  })
}, 1000)

import * as PIXI from 'pixi.js'

document.querySelector('title').innerHTML = config.title

// 加载大厅L2D文件
;(async function () {
  let a = 0
  for (let i of config.memorialLobbies) {
    PIXI.Assets.add({ alias: 'skeleton' + a, src: i.path + i.skel })
    PIXI.Assets.add({ alias: 'atlas' + a, src: i.path + i.atlas })
    await PIXI.Assets.load(['skeleton' + a, 'atlas' + a])
    a++
  }
  window.l2d_complete = true
})()
