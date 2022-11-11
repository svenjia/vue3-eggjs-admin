import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

// 不需要进行权限判断的固定路由
export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    name: 'Root',
    meta: {
      hidden: false
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      noTagsView: true,
      hidden: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      title: t('router.login'),
      noTagsView: true,
      hidden: true
    }
  },
  {
    path: '/welcome',
    component: Layout,
    name: 'Welcome',
    meta: {
      title: t('router.welcome'),
      noTagsView: true,
      icon: 'ant-design:dashboard-filled',
      noPermission: true
    },
    children: [
      {
        path: '',
        component: () => import('@/views/Welcome.vue'),
        name: 'Welcome',
        meta: {
          title: t('router.welcome'),
          noTagsView: true,
          icon: 'ant-design:dashboard-filled'
        }
      }
    ]
  },
  // 系统设置
  {
    path: '/system',
    component: Layout,
    name: 'System',
    meta: {
      title: t('router.system'),
      icon: 'ant-design:dashboard-filled'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/System/User.vue'),
        name: 'UserAdmin',
        meta: {
          title: t('router.userAdmin'),
          icon: 'ant-design:dashboard-filled'
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/System/Permission.vue'),
        name: 'Permission',
        meta: {
          title: t('router.permission'),
          icon: 'ant-design:dashboard-filled'
        }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    redirect: '/error/404',
    name: 'Error',
    meta: {
      title: t('router.errorPage'),
      icon: 'ci:error',
      alwaysShow: true,
      hidden: true
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/Error/404.vue'),
        name: '404Demo',
        meta: {
          title: '404'
        }
      },
      {
        path: '403',
        component: () => import('@/views/Error/403.vue'),
        name: '403Demo',
        meta: {
          title: '403',
          noTagsView: true
        }
      },
      {
        path: '500',
        component: () => import('@/views/Error/500.vue'),
        name: '500Demo',
        meta: {
          title: '500'
        }
      }
    ]
  }
]

export const catchAllRouter: AppRouteRecordRaw[] = [
  {
    path: '/:catchAll(.*)',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      title: '404',
      noTagsView: true,
      hidden: true
    }
  }
]
const routes = constantRouterMap.concat(catchAllRouter)
const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: routes as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
