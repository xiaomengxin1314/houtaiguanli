// vue插件案的写法
// 1.定义一个插件 插件就是一个普通的对象，只不过这个对象有一个固定的写法，名字是install 参数就是vue
// 2.使用一个插件Vue.use(插件名字)使用的时候 会自动只执行install方法
// 为什么要使用插件或插件有什么好处
// 如果不使用插件的写法，我们封装了100各组件，给别的同事使用，同时他们要导入100次 使用不方便
// 但是插件只要我们设置好了，用户在使用的时候只有一行
// 哪些是插件
// 1.vue-router Vue.use(VueRouuter) <router-link></router-link> <router-view></router-view>
// 2.vuex Vue.use(Vuex)
// 3.element-ui  Vue.use(element)几百个组 el-button Vue.component
// 很多概念的出现都是为了用户写代码更简单
import PageTool from './PageTool'
import UploadImage from './UploadImage'
export default {
  // install 安装
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
  }
}
