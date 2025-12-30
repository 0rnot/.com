import './assets/index.css'
import '@arco-design/web-vue/dist/arco.css'

import { initApp } from '@/init/app'
import { initPWA } from '@/init/pwa'
import { loadFonts } from '@/init/fonts'
import { initLinkHandler } from '@/init/links'
import { initLive2D } from '@/init/live2d'
import { useConfig } from '@/composables/useConfig'

// 初始化应用
initApp()

// 初始化PWA
initPWA()

// 初始化链接处理器
initLinkHandler()

// 启动初始化流程
async function startApp() {
  try {
    // 初始化配置并设置页面标题
    const { configs, waitForConfig } = useConfig()

    // 等待配置加载完成
    await waitForConfig()

    // 设置页面标题
    const config = configs.value
    if (config && config.title) {
      document.title = config.title
    } else {
      document.title = '个人主页'
    }

    // 加载字体
    await loadFonts()

    // 等待配置完成后初始化Live2D
    await initLive2D()

    // 应用准备就绪
    console.log('应用初始化完成')
  } catch (error) {
    console.error('应用初始化失败:', error)
    // 设置默认标题
    document.title = '个人主页'
  }
}

// 启动应用
startApp()
