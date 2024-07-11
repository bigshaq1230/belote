import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Match from '../views/Match.vue'
import AddForm from '@/views/AddForm.vue'
import ManagePlayers from '@/views/ManagePlayers.vue'
import EditPlayer from '@/views/EditPlayer.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/match',
      name: 'match',
      component: Match,
      props: true
    },
    {
      path: '/manage',
      name: 'manage',
      component: ManagePlayers
    },
    {
      path:'/add',
      name:'add',
      component:AddForm
    },
    {
      path:'/player/:id',
      name:'player',
      component:EditPlayer
    }
  ]
})

export default router
