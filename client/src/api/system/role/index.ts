import request from '@/config/axios'
import type { TableData } from './types'

export const saveRoleApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/role/create', data })
}

export const getRoleListApi = (): Promise<IResponse> => {
  return request.get({ url: '/system/role/list' })
}

export const getRoleUserApi = (role_id: number): Promise<IResponse> => {
  return request.get({ url: '/system/role/user_list', params: { role_id } })
}

export const deleteRoleApi = (id: number): Promise<IResponse> => {
  return request.post({ url: '/system/role/delete', data: { id } })
}

export const getRoleResourceApi = (role_id: number): Promise<IResponse> => {
  return request.get({ url: '/system/role/resource', params: { role_id } })
}
