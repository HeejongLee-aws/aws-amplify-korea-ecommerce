import Vue from 'vue'
import VueRouter from 'vue-router'
import main from '../views/main.vue'
import about from '../views/about.vue'
import login from '../views/login.vue'
import join from '../views/join.vue'
import cart from '../views/cart.vue'
import order from '../views/order.vue'
import productDetail from '../views/productDetail.vue'
import myPage from '../views/myPage.vue'
import display from '../views/display.vue'
import myOrders from '../views/myOrders.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: main
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: about
  },
  {
    path: '/login',
    name: 'login',
    // component: () => import('../views/login.vue')
    component: login
  },
  {
    path: '/join',
    name: 'join',
    // component: () => import('../views/join.vue')
    component: join
  },
  {
    path: '/cart',
    name: 'cart',
    // component: () => import('../views/cart.vue')
    component: cart
  },
  {
    path: '/order',
    name: 'order',
    // component: () => import('../views/order.vue')
    component: order
    
  }
  ,
  {
    path: '/productdetail',
    name: 'productDetail',
    // component: () => import('../views/productDetail.vue')
    component: productDetail
  },
  {
    path: '/mypage',
    name: 'myPage',
    // component: () => import('../views/myPage.vue')
    component: myPage
  },
  {
    path: '/display/:id',
    name: 'display',
    props: true,
    // component: () => import('../views/display.vue')
    component: display
  },
  {
    path: '/myOrders',
    name: 'myOrders',
    props: true,
    // component: () => import('../views/myOrders.vue')
    component: myOrders
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
