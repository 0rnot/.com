<h1 align="center">小鱼档案</h1>

<p align="center">
  <a href='https://gitee.com/sf-yuzifu/homepage/stargazers'><img src='https://gitee.com/sf-yuzifu/homepage/badge/star.svg?theme=dark' alt='star' /></a>
  <a href='https://github.com/sf-yuzifu/homepage/stargazers'><img alt="GitHub stars" src="https://img.shields.io/github/stars/sf-yuzifu/homepage?style=social" /></a>
</p>

<div align="center">有关小鱼的《蔚蓝档案》风格的个人主页</div>

![小鱼档案](shots/main.png)

## 预览链接

- [小鱼档案](https://yzf.moe)
- [小鱼档案 - 备用](https://yuzifu.top/)

## 目前复刻程度

- [x] 加载界面
- [x] 主界面复刻
- [x] 回忆大厅
- [x] 弹窗复刻
- [x] 什亭之箱转场
- [x] 点击特效和动效
- [x] 多个学生回忆大厅l2d切换
- [x] 学生回忆大厅全局观赏
- [x] 学生摸头和对话互动
- [ ] 个人信息等二级界面

## 使用到的项目

- [Vue](https://cn.vuejs.org/)
- [Vite](https://vitejs.cn/vite3-cn/)
- [Arco Design](https://arco.design/)
- [PIXIjs](https://github.com/pixijs/pixijs)
- [spine-pixi-v7](https://www.npmjs.com/package/@esotericsoftware/spine-pixi-v7)
- [Iconfont](https://www.iconfont.cn/)
- [cn-font-split](https://github.com/KonghaYao/cn-font-split)
- [APlayer](https://aplayer.js.org/#/)
- [howler.js](https://github.com/goldfire/howler.js)

## 部署方式

### 使用第三方部署平台

#### 1. Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/sf-yuzifu/homepage)

#### 2. Netlify
1. `Fork`[本项目](https://github.com/sf-yuzifu/homepage)
2. [登录 Netlify 控制台](https://app.netlify.com )，选择`Add new site`-`Import an exist project`添加网站
3. 接着选择 GitHub 认证来读取我们的 GitHub 项目列表。在列表中搜索我们刚才`Fork`生成的仓库名，点击该项目开始基于该仓库创建我们的 Netlify 网站

### 本地构建网页文件

> **推荐环境：**
>
> node > 18.0.0  
> npm > 8.15.0

1. 安装yarn

```bash
# 安装 yarn
npm install -g yarn
```

2. 克隆此项目到本地
3. 在项目根目录下运行

```bash
# 安装依赖
yarn install

# 预览（开发环境）
yarn dev

# 构建
yarn build

# 预览（生产环境预览）
yarn preview
```

> 构建完成后，静态资源会在 **`dist` 目录** 中生成，你可以将 **`dist` 目录中的文件**上传至服务器

> 其中关于宝塔如何部署的（[https://cloud.tencent.com/developer/article/1977167](https://cloud.tencent.com/developer/article/1977167)）

## 个性化

> 新版本配置文件采用yaml格式以方便阅读，想要快速迁移可以通过[此网站](https://www.json.cn/json2yaml/)快速将json格式转为yaml格式
> 
> 打开根目录下的 `_config.yaml`，在其中你会看到如下内容

```yaml
# 网站基本配置
title: 小鱼档案 # 网站标题
description: 有关小鱼的《蔚蓝档案》风格的个人主页 # 网站简介
favicon: /favicon144.png # 网站图标链接
author: 小鱼yuzifu # Sensei，你的名字
keywords: '蔚蓝档案,小鱼yuzifu,个人主页' # 网站关键词描述
ICP: '' # ICP备案号
# PWA配置（https:#developer.mozilla.org/zh-CN/docs/Web/Manifest）
manifest:
  name: 小鱼档案 # 应用全称
  short_name: 小鱼档案 # 应用简称
  description: 有关小鱼的《蔚蓝档案》风格的个人主页 # 简介
  theme_color: '#128AFA' # 主题色
  start_url: /
  id: Homepage
  # 图标
  icons:
    - src: /favicon512.png # 网站图标链接
      sizes: 512x512 # 尺寸
      purpose: any maskable
# 个人信息
level: 85 # 等级
exp: 8382 # 经验值
nextExp: 8381 # 到达下一等级经验值（比exp小则显示满级）
# Iconfont图标导入
iconfont: 'https://at.alicdn.com/t/c/font_4336463_0i6ly0yvyzb.js'
# 底部项目信息（推荐5个，最多7个）
dock:
  - name: 一起吃小鱼 # 项目名称
    href: 'https://gitee.com/sf-yuzifu/eat-fish-together' # 项目地址
    imgSrc: /img/fish.png # 项目图标
# 左边联系方式（推荐4个）
contact:
  - name: QQ # 联系方式
    href: 'https://wpa.qq.com/msgrd?v=3&uin=2512902451&site=qq&menu=yes&jumpflag=1' # 联系地址
    iconfont: icon-qq # iconfont图标id（只有icon-qq/github/bilibili/gitee）
# 任务按钮启动
task:
  name: 个人博客 # 任务名称
  href: 'https://blog.yzf.moe/' # 跳转地址
banner:
  musicID: # 音乐ID（暂时只支持网易云音乐）
    - 2059151619
# 回忆大厅配置
memorialLobbies:
  - name: Aris # 这里填学生名字
    path: '/l2d/aris/' # 这里填回忆大厅L2D文件位置（注意最后以“/”结尾）
    skel: 'Aris_home.skel' # 这里填回忆大厅L2D的SKEL文件
    atlas: 'Aris_home.atlas' # 这里填回忆大厅L2D的ATLAS文件
    voice: # 这里填学生对话（注意：前面的必须是L2D文件中有的内容，实在不清楚的可以在调试的时候获取"Background.vue"文件"onEvent"函数的"event.stringValue"的值以确保无误）
      Aris_MemorialLobby_1: 爱丽丝觉得在基沃托斯魔法并不是空想。
      Aris_MemorialLobby_2_1: 魔法是真正存在的。
      Aris_MemorialLobby_2_2: 因为，老师现在让爱丽丝感到非常幸福。
      Aris_MemorialLobby_3_1: 游戏之所以很有趣，
      Aris_MemorialLobby_3_2: 是因为它蕴藏了这个世界所有的美丽之处。
      Aris_MemorialLobby_3_3: 这是，老师您让我明白的道理。
      Aris_MemorialLobby_4_1: 游戏、猫咪、和好朋友……还有……
      Aris_MemorialLobby_4_2: 现在这个瞬间，在这世界上有太多太多美好的东西。
      Aris_MemorialLobby_5_1: 爱丽丝还想知道更多更多。
      Aris_MemorialLobby_5_2: 想和老师一起……两个人一起，继续探索这个世界！
    offset: 0.45 # 这里填学生在回忆大厅的位置，方便在小屏时居中定位学生（百分比定位）
    dialogueDisplay: # 这里填学生对话框位置（百分比定位）
      x: -1/4 - 1/16
      y: -1/16
      position: right # 这里是对话框朝向
```
> 修改其中相关内容，之后重新按上述方式部署即可完成修改

## 有关学生回忆大厅L2D文件获取

1. 自己去游戏解包中获取（[教程1](https://www.bilibili.com/read/cv15934670/)、[教程2](https://www.bilibili.com/read/cv18073492/)）
2. 去[基沃托斯古书馆](https://kivo.fun/)中的`角色图鉴`—`切换到鉴赏模式`—`回忆大厅`当中自行抓包获取

## 基于本项目的最佳实践

> 感谢使用此项目的大佬们能够进一步完善这个项目😭😭😭
> 
> 欢迎其他大佬通过Issue来向我投稿最佳实践❤❤❤

1. [Home - 杏仁レモンティー](https://apricotlemontea.com/)
2. [ElectroHeavenVN's Homepage](https://electroheavenvn.github.io/homepage/)
