<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import type { FormInstance, FormRules } from 'element-plus'
import 'vue-tel-input/dist/vue-tel-input.css'
import { saveRoleApi } from '@/api/system/role/index'
import { ElNotification } from 'element-plus'

const emit = defineEmits(['closeDialog', 'updateList'])

const { required } = useValidator()
const { t } = useI18n()

const rules = reactive<FormRules>({
  name: [required()]
})

const formRef = ref<FormInstance>(),
  isSubmitting = ref(false)

const form = reactive({
  name: '',
  remark: ''
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      isSubmitting.value = true
      saveRoleApi(form).then(() => {
        setTimeout(() => {
          isSubmitting.value = false
          ElNotification({
            title: t('common.success'),
            message: t('system.addRoleSuccess'),
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
    <el-form-item prop="name" :label="t('system.roleName')">
      <el-input v-model="form.name" show-word-limit maxlength="20" />
    </el-form-item>
    <el-form-item prop="remark" :label="t('common.remark')">
      <el-input
        v-model="form.remark"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        show-word-limit
        maxlength="40"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)" :loading="isSubmitting">{{
        t('common.ok')
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped></style>
