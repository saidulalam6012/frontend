import Vue from 'vue'
import VueRouter from 'vue-router'
import guest from './middleware/guest'
import auth from './middleware/auth'
import store from '../store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Login' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/auth/Login.vue'),
    meta: {
      middleware: [
          guest
      ]
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/auth/Register.vue'),
    meta: {
      middleware: [
          guest
      ]
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import(/* webpackChunkName: "Dashboard" */ '../views/admin/Products.vue'),
    meta: {
      middleware: [
          auth
      ]
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
      return next()
  }
  const middleware = to.meta.middleware
  const context = {
      to,
      from,
      next,
      store
  }
  return middleware[0]({
      ...context
  })
})

export default router
