import { ref, computed, watch } from 'vue'
import originalConfig from '/_config.yaml'
import enUS from '../locales/en-US.yaml'
import jaJP from '../locales/ja-JP.yaml'
import { detectBrowserLanguage, createConfigLoader } from './configUtils'

// 支持的语言配置
const localeConfigs = {
  zh: originalConfig,
  'en-US': enUS,
  'ja-JP': jaJP
}

// 创建配置加载器
const configLoader = createConfigLoader(localeConfigs)

export function useConfig() {
  const currentLocale = ref('zh')
  const currentConfig = ref(null)
  const isLoading = ref(false)

  // 初始化语言
  const initLocale = () => {
    try {
      const detectedLang = detectBrowserLanguage(configLoader.getSupportedLocales())
      currentLocale.value = detectedLang

      console.log('语言检测完成:', {
        最终语言: detectedLang,
        浏览器语言: navigator.language || navigator.userLanguage,
        支持语言: configLoader.getSupportedLocales()
      })
    } catch (error) {
      console.error('语言检测失败:', error)
      currentLocale.value = 'en-US' // 备用语言
    }
  }

  // 加载配置
  const loadConfig = async () => {
    if (isLoading.value) return

    isLoading.value = true
    try {
      const config = await configLoader.getConfig(currentLocale.value)
      currentConfig.value = config
    } catch (error) {
      console.error('加载配置失败:', error)
      // 使用默认配置
      currentConfig.value = {
        level: 1,
        exp: 0,
        nextExp: 0,
        dock: [],
        contact: [],
        memorialLobbies: [],
        banner: { musicID: [] },
        title: '个人主页',
        translate: {
          info: '更新提示',
          update: '检测到新版本，是否立即更新？',
          ok: '立即更新',
          cancel: '稍后更新'
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  // 立即初始化
  initLocale()
  loadConfig()

  // 响应式配置对象
  const configs = computed(() => currentConfig.value)

  // 等待配置加载完成
  const waitForConfig = () => {
    return new Promise((resolve, reject) => {
      if (!isLoading.value && currentConfig.value) {
        resolve(currentConfig.value)
        return
      }

      const unwatch = watch([isLoading, currentConfig], ([loading, config]) => {
        if (!loading && config) {
          unwatch()
          resolve(config)
        }
      })

      // 超时处理
      setTimeout(() => {
        unwatch()
        if (currentConfig.value) {
          resolve(currentConfig.value)
        } else {
          reject(new Error('配置加载超时'))
        }
      }, 10000) // 10秒超时
    })
  }

  // 手动切换语言
  const setLocale = (locale) => {
    if (configLoader.getSupportedLocales().includes(locale)) {
      currentLocale.value = locale
      loadConfig()
      console.log('语言已切换为:', locale)
    } else {
      console.warn(`不支持的语言: ${locale}`)
    }
  }

  // 获取当前语言
  const getCurrentLocale = () => {
    return currentLocale.value
  }

  return {
    // 响应式配置对象
    configs,
    // 当前语言
    currentLocale,
    // 当前语言（兼容旧版本）
    locale: currentLocale,
    // 加载状态
    isLoading,
    // 支持的语言列表
    availableLocales: configLoader.getSupportedLocales(),
    // 方法
    setLocale,
    getCurrentLocale,
    reloadConfig: loadConfig,
    waitForConfig
  }
}
