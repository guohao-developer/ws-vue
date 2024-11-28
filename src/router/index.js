import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
// import SellerPage from '@/views/SellerPage.vue'
// import TrendPage from '@/views/TrendPage.vue'
// import MapPage from '@/views/MapPage'
import RankPage from '@/views/RankPage'
import HotPage from '@/views/HotPage'
import StockPage from '@/views/StockPage'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: Home
  },
  {
    path: '/rankPage',
    component: RankPage
  },
  {
    path: '/hotPage',
    component: HotPage
  },
  {
    path: '/stockPage',
    component: StockPage
  }
  // {
  //   path: '/sellerpage',
  //   component: SellerPage
  // },
  // {
  //   path: '/trendPage',
  //   component: TrendPage
  // },
  // {
  //   path: '/mappage',
  //   component: MapPage
  // }
]

const router = new VueRouter({
  routes
})

export default router
