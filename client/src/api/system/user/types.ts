export interface userRoleInfo {
  role_id: number
  role_name: string
  user_id: number
}
export type TableData = {
  id: number
  username: string
  mobile: string
  email: string
  status: number
  createTime: string
  role: Array<userRoleInfo>
}
