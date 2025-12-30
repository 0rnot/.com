import * as PIXI from 'pixi.js'
import { useConfig } from '@/composables/useConfig'

export async function initLive2D() {
  try {
    const { configs } = useConfig()
    const config = configs.value

    if (!config) {
      console.warn('配置对象为空，跳过Live2D初始化')
      window.l2d_complete = true
      return false
    }

    if (!config.memorialLobbies || !Array.isArray(config.memorialLobbies)) {
      console.warn('memorialLobbies配置无效，跳过Live2D初始化:', config.memorialLobbies)
      window.l2d_complete = true
      return false
    }

    let assetIndex = 0

    // 异步加载所有Live2D资源
    const loadPromises = config.memorialLobbies.map(async (lobby) => {
      // 添加资源到PIXI资源管理器
      PIXI.Assets.add({ alias: `skeleton_${assetIndex}`, src: lobby.path + lobby.skel })
      PIXI.Assets.add({ alias: `atlas_${assetIndex}`, src: lobby.path + lobby.atlas })

      // 加载资源
      await PIXI.Assets.load([`skeleton_${assetIndex}`, `atlas_${assetIndex}`])
      assetIndex++
    })

    // 等待所有资源加载完成
    await Promise.all(loadPromises)

    // 标记Live2D加载完成
    window.l2d_complete = true
    console.log('Live2D资源加载完成')

    return true
  } catch (error) {
    console.error('Live2D资源加载失败:', error)
    window.l2d_complete = true // 即使失败也设置为true，避免无限加载
    return false
  }
}
