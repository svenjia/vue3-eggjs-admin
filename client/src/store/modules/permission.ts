import { defineStore } from 'pinia'
import { constantRouterMap, catchAllRouter } from '@/router'
import { markRouterHidden } from '@/utils/routerHelper'
import { store } from '../index'
import { getSelfResourceApi } from '@/api/system/user'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  resources: null | Resource[]
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routers: [],
    resources: null
  }),
  persist: {
    debug: true
  },
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    }
  },
  actions: {
    async getResource(): Promise<void> {
      const { data } = await getSelfResourceApi()
      markRouterHidden(constantRouterMap, data)

      // 根据返回的资源，对比本地的router
      this.routers = constantRouterMap.concat(catchAllRouter)
      this.resources = data
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
