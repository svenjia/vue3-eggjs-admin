<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
import { getRoleListApi } from '@/api/system/role'
import { assignUserRoleApi } from '@/api/system/user'
import { ElNotification } from 'element-plus'

const props = defineProps({
  initialRole: {
    type: Array,
    default() {
      return []
    }
  },
  userId: {
    type: Number,
    required: true
  }
})
const emit = defineEmits(['closeDialog', 'updateList'])
interface role {
  id: number
  name: string
}
const { t } = useI18n()
const checkAll = ref(false)
const isIndeterminate = ref(true),
  allRole = ref<role[]>([]),
  isSubmitting = ref(false)

const checkRole = ref(props.initialRole as number[])
const handleCheckAllChange = (val: boolean) => {
  checkRole.value = val ? allRole.value.map((item) => item.id) : []
  isIndeterminate.value = false
}
const handleCheckedRoleChange = (value: string[]) => {
  console.log(value)
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

const handleConfirmAssignRole = () => {
  console.log(checkRole.value)
  const user_id = props.userId,
    role_ids = checkRole.value
  isSubmitting.value = true
  assignUserRoleApi(user_id, role_ids).then(() => {
    isSubmitting.value = false
    ElNotification({
      title: t('common.success'),
      message: t('system.assignRoleSuccess'),
      type: 'success'
    })
    emit('closeDialog')
    emit('updateList')
  })
}
getRoleListApi().then((res) => {
  allRole.value = res.data
})
</script>
<template>
  <ContentWrap :title="t('system.roleList')">
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      >{{ t('common.checkAll') }}</el-checkbox
    >
    <ul class="role-wrp">
      <el-checkbox-group v-model="checkRole" @change="handleCheckedRoleChange">
        <li class="role" v-for="item in allRole" :key="item.id">
          <el-checkbox :label="item.id">{{ item.name }}</el-checkbox></li
        >
      </el-checkbox-group>
    </ul>
    <el-button
      type="primary"
      style="width: 100%; margin-top: 20px"
      :loading="isSubmitting"
      @click="handleConfirmAssignRole"
      >{{ t('common.ok') }}</el-button
    >
  </ContentWrap>
</template>

<style lang="less"></style>
