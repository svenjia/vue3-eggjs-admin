<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue'
import { Form } from '@/components/Form'
import { useI18n } from '@/hooks/web/useI18n'
import { useForm } from '@/hooks/web/useForm'
import { loginApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { UserType } from '@/api/login/types'
import { useValidator } from '@/hooks/web/useValidator'
const { required } = useValidator()
const appStore = useAppStore()

const { currentRoute, push } = useRouter()

const { wsCache } = useCache()

const { t } = useI18n()

const checkUsername = (_: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the username'))
  }
  const reg = /^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]{6,16}$/g
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error(t('system.usernameRule')))
  }
}

const schema = reactive<FormSchema[]>([
  {
    field: 'username',
    label: t('login.username'),
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: t('login.usernamePlaceholder'),
      autocomplete: 'on',
      autofocus: true
    },
    formItemProps: {
      rules: [required(), { validator: checkUsername, trigger: 'blur' }]
    }
  },
  {
    field: 'password',
    label: t('login.password'),
    component: 'InputPassword',
    colProps: {
      span: 24
    },
    componentProps: {
      style: {
        width: '100%'
      },
      placeholder: t('login.passwordPlaceholder'),
      autocomplete: 'on'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'login',
    colProps: {
      span: 24
    }
  }
])

const { register, elFormRef, methods } = useForm({ schema })

const loading = ref(false)

const redirect = ref<string>('')

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  const formRef = unref(elFormRef)
  console.log(formRef)
  await formRef?.validate(async (isValid) => {
    console.log(isValid)
    if (isValid) {
      loading.value = true
      const { getFormData } = methods
      const formData = await getFormData<UserType>()

      try {
        const res = await loginApi(formData)
        console.log('login res ', res)
        if (res) {
          wsCache.set(appStore.getUserInfo, res.data)
          push({ path: redirect.value || '/' })
        }
      } finally {
        loading.value = false
      }
    }
  })
}

const router = useRouter()
// const signIn = () => {
//   console.log('123 :>> ', 123)
//   router.push({ path: '/gMTool' })
// }
</script>

<template>
  <Form
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
    @register="register"
  >
    <template #title>
      <h2 class="text-2xl font-bold text-center w-[100%]">{{ t('login.login') }}</h2>
    </template>

    <!-- <template #tool>
      <div class="flex justify-between items-center w-[100%]">
        <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
        <ElLink type="primary" :underline="false">{{ t('login.forgetPassword') }}</ElLink>
      </div>
    </template> -->

    <template #login>
      <div class="w-[100%]">
        <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
          {{ t('login.login') }}
        </ElButton>
      </div>
    </template>
  </Form>
</template>

<style lang="less" scoped>
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
