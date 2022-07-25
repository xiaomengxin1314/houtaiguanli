import request from '@/utils/request'
export const getEmployee = ({ page, size }) => {
  return request({
    url: '/sys/user',
    params: {
      page, size
    }
  })
}
// 批量从excel中导入员工列表
export const importEmployee = data => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

// 给员工分配角色
export const assignRoles = ({ id, roleIds }) => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data: { id, roleIds }
  })
}

// 新增员工
export const addEmployee = (data) => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

// 保存员工信息
export const saveEmployee = (id, data) => {
  return request({
    url: `/sys/user/${id}`,
    method: 'PUT',
    data
  })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}
