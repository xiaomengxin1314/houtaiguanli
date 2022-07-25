// 为什么这样写，因为写过一次将来去公司里面看到公司写的过滤器就是一个普通的函数 你要理解
import dayjs from 'dayjs'
export const dateFormat = function (item) {
  return dayjs(item).format('YYYY-MM-DD')
}
