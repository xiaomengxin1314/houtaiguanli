import request from '@/utils/request'
export const getDepartmentList = () => {
  return request({
    url: '/company/department'
  })
}

export const delDepartment = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
/**
 * 新增部门
 * @param code 编码
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}

export const editDepartment = data => {
  return request({
    method: 'PUT',
    url: ` /company/department/${data.id}`,
    data
  })
}
