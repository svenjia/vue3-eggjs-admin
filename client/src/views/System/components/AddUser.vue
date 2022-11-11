<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import type { FormInstance, FormRules } from 'element-plus'
import { VueTelInput } from 'vue-tel-input'
import 'vue-tel-input/dist/vue-tel-input.css'
import { saveUserApi } from '@/api/system/user/index'
import { ElNotification } from 'element-plus'

const emit = defineEmits(['closeDialog', 'updateList'])

const { required } = useValidator()
const { t } = useI18n()

const checkUsername = (rule: any, value: any, callback: any) => {
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
const rules = reactive<FormRules>({
  username: [required(), { validator: checkUsername, trigger: 'change' }],
  email: [{ type: 'email' }]
})

const formRef = ref<FormInstance>(),
  isSubmitting = ref(false)

const form = reactive({
  username: '',
  mobile: '',
  email: ''
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true
      saveUserApi(form).then(() => {
        setTimeout(() => {
          isSubmitting.value = false
          ElNotification({
            title: t('common.success'),
            message: t('system.addUserSuccess'),
            type: 'success'
          })
          emit('closeDialog')
          emit('updateList')
        }, 1000)
      })
    }
  })
}
</script>

<template>
  <el-form :model="form" label-position="top" label-width="100px" :rules="rules" ref="formRef">
    <el-form-item prop="username">
      <template #label>
        <el-tooltip effect="dark" :content="t('system.usernameRule')" placement="top-start">
          <span class="">
            {{ t('system.username') }}
            <el-icon style="vertical-align: middle"><QuestionFilled /></el-icon
          ></span>
        </el-tooltip>
      </template>
      <el-input v-model="form.username" size="large" />
    </el-form-item>
    <el-form-item :label="t('system.mobile')">
      <VueTelInput
        v-model="form.mobile"
        :inputOptions="{ showDialCode: false }"
        :defaultCountry="+86"
        mode="international"
      />
    </el-form-item>
    <el-form-item :label="t('system.email')" prop="email">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)" :loading="isSubmitting">{{
        t('common.ok')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="less">
.vti__dropdown {
  padding-top: 3px !important;
  padding-bottom: 3px !important;
}
.vue-tel-input {
  border-color: #e5e7eb;
  width: 100%;
}
</style>
