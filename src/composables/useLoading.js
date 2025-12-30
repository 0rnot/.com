import { ref, onMounted, onUnmounted } from 'vue'
import NProgress from 'nprogress'

export function useLoading() {
  const loading = ref(true)
  const percent = ref(0)
  const isReady = ref(false)

  let loadInterval = null

  const startLoading = () => {
    NProgress.start()
    percent.value = 0

    loadInterval = setInterval(() => {
      const status = NProgress.status
      percent.value = status

      // 检查加载条件
      if (document.readyState === 'complete' && window.l2d_complete === true) {
        finishLoading()
      }
    }, 100)
  }

  const finishLoading = () => {
    if (loadInterval) {
      clearInterval(loadInterval)
      loadInterval = null
    }

    NProgress.done()
    percent.value = 1

    // 添加延迟让用户看到100%完成
    setTimeout(() => {
      loading.value = false
      isReady.value = true
    }, 2000)
  }

  const forceComplete = () => {
    finishLoading()
  }

  onMounted(() => {
    startLoading()
  })

  onUnmounted(() => {
    if (loadInterval) {
      clearInterval(loadInterval)
    }
  })

  return {
    loading,
    percent,
    isReady,
    startLoading,
    finishLoading,
    forceComplete
  }
}
