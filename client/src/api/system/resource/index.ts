import request from '@/config/axios'

// 获取系统全部的资源，用于权限分配
export const getAllResourceApi = async (): Promise<IResponse> => {
  return request.get({ url: 'system/resource/list' })
}

export const assignResourceApi = (
  role_id: number,
  resources: Array<string>
): Promise<IResponse> => {
  return request.post({ url: '/system/resource/assign', data: { role_id, resources } })
}
