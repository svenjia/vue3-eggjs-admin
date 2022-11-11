import request from '@/config/axios'
import type { TableData } from './types'

export const saveUserApi = (data: Partial<TableData>): Promise<IResponse> => {
  return request.post({ url: '/system/user/create', data })
}

export const getUserListApi = (params: { page: number; pageSize: number }): Promise<IResponse> => {
  return request.get({ url: '/system/user/list', params })
}

export const delUserListApi = (ids: string[] | number[]): Promise<IResponse> => {
  return request.post({ url: '/system/user/delete', data: { ids } })
}

export const toggleUserApi = (id: number, status: number): Promise<IResponse> => {
  return request.post({ url: '/system/user/toggle', data: { id, status } })
}
export const resetUserPasswordApi = (id: number): Promise<IResponse> => {
  return request.post({ url: '/system/user/reset_password', data: { id } })
}

export const assignUserRoleApi = (user_id: number, role_ids: number[]): Promise<IResponse> => {
  return request.post({ url: '/system/user/assign', data: { user_id, role_ids } })
}

export const getSelfResourceApi = async (): Promise<IResponse> => {
  return request.get({ url: 'system/user/resource' })
}
