import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Bio from '@/views/Bio.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bio',
    name: 'Bio',
    component: Bio
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
