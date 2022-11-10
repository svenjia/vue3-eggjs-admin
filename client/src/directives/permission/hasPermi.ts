import type { App, Directive, DirectiveBinding } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { intersection } from 'lodash-es'
import { isArray } from '@/utils/is'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
const permissionStore = usePermissionStoreWithOut()
const { t } = useI18n()

const hasPermission = (value: string | string[]): boolean => {
  const permissions = permissionStore.resources?.map((item) => item.code) as [string]
  if (!value) {
    throw new Error(t('permission.hasPermission'))
  }
  if (!isArray(value)) {
    return permissions?.includes(value)
  }
  return (intersection(value, permissions) as string[]).length > 0
}
function hasPermi(el: Element, binding: DirectiveBinding) {
  const value = binding.value

  const flag = hasPermission(value)
  if (!flag) {
    el.parentNode?.removeChild(el)
  }
}
const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  hasPermi(el, binding)
}

const permiDirective: Directive = {
  mounted
}

export const setupPermissionDirective = (app: App<Element>) => {
  app.directive('permission', permiDirective)
}

export default permiDirective
