import router from '@/router'
import store from '@/store'
// 引入虚拟进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404']
// to 去哪 from 来自哪里 next 放行
router.beforeEach((to, from, next) => {
  // 开启进度效果
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()

      next('/')
    } else {
      // 当用户手里面有token并且访问的不是登陆页面，那就应该请求个人资料
      if (!store.state.user.userInfo.id) {
        store.dispatch('user/getInfo')
      }
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
// 后置路由守卫
router.afterEach(() => {
  // 结束进度效果
  NProgress.done()
})
