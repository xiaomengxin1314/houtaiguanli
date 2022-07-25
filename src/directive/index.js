
// 自定义指令 我们想封装一个dom操作的时候供页面的一堆的组件去使用
export const imgerror = {
  inserted (el, binding) {
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  },
  update (el, binding) {
    el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  }
}
