<script setup lang="ts">
import { ref } from 'vue'
import AddRole from './components/AddRole.vue'
import {
  getRoleListApi,
  deleteRoleApi,
  getRoleUserApi,
  getRoleResourceApi
} from '@/api/system/role/index'
import { getAllResourceApi, assignResourceApi } from '@/api/system/resource'
import { useI18n } from '@/hooks/web/useI18n'
import { ElNotification, ElTree, ElMessage } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'

interface role {
  id: number
  name: string
  remark?: string
}
interface user {
  id: number
  username: string
  status: number
}
const { t } = useI18n()
const dialogVisible = ref(false),
  currentRole = ref(),
  loadingRoles = ref(false),
  loadingUsers = ref(false),
  isChanged = ref(false),
  roleList = ref<role[]>([]),
  userList = ref<user[]>([]),
  resourceList = ref([]),
  treeRef = ref<InstanceType<typeof ElTree>>()
const handleRoleChange = (value: number) => {
  loadingUsers.value = true
  getRoleUserApi(value).then((res) => {
    userList.value = res?.data
    loadingUsers.value = false
  })
  getRoleResourceApi(value).then((res) => {
    if (res?.data.length === 0) {
      treeRef.value!.setCheckedKeys([])
      return
    }
    res?.data.forEach((item) => {
      treeRef.value!.setChecked(item.code, true, false)
    })
  })
}
const handleDeleteRole = (id: number) => {
  deleteRoleApi(id).then((res) => {
    console.log(res)
    ElNotification({
      title: t('common.success'),
      message: t('system.delRoleSuccess'),
      type: 'success'
    })
    getList()
  })
}
const handleConfirm = () => {
  const checkedKeys = treeRef.value!.getCheckedKeys(false)
  // 所有子节点和半选择的节点都需要
  const resources = checkedKeys.concat(treeRef.value!.getHalfCheckedKeys()) as string[]
  if (!currentRole.value) {
    ElMessage({
      type: 'warning',
      message: 'role is empty'
    })
    return
  }
  assignResourceApi(currentRole.value, resources).then(() => {
    ElNotification({
      title: t('common.success'),
      message: t('system.assignResSuccess'),
      type: 'success'
    })
  })
}
const handleCloseDialog = () => {
  dialogVisible.value = false
}
const renderContent = (
  h,
  {
    node,
    data,
    store
  }: {
    node: Node
    data: Resource
    store: Node['store']
  }
) => {
  return h(
    'span',
    {
      class: 'custom-tree-node'
    },
    t('resource.' + data.name)
  )
}

const getList = () => {
  loadingRoles.value = true
  getRoleListApi().then((res) => {
    roleList.value = res?.data
    loadingRoles.value = false
  })
}
getList()
getAllResourceApi().then((res) => {
  console.log('all resource:', res)
  resourceList.value = res?.data
})
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>{{ t('system.roleList') }}</span>
          <el-button
            style="float: right; padding: 3px 0"
            text
            type="primary"
            @click="dialogVisible = true"
            >{{ t('system.addRole') }}</el-button
          >
        </template>
        <el-radio-group v-model="currentRole" @change="handleRoleChange">
          <ul v-loading="loadingRoles" class="role-wrp">
            <li
              v-for="(role, index) in roleList"
              :key="index"
              class="role"
              style="font-size: initial"
            >
              <el-radio :label="role.id">
                <em class="font-semibold">{{ role.name }}</em>
                <i class="ml-2 text-xs text-opacity-10 align-baseline">{{ role.remark }}</i>
              </el-radio>
              <el-popover placement="right" width="160">
                <template #reference>
                  <el-icon size="24" class="lg:hover"><Delete /></el-icon>
                </template>
                <p></p>
                <div style="text-align: right; margin: 0">
                  <span>{{ t('system.delRoleTips') }}</span
                  ><el-button type="primary" @click="handleDeleteRole(role.id)">{{
                    t('common.ok')
                  }}</el-button>
                </div>
              </el-popover>
            </li>
          </ul>
        </el-radio-group>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>{{ t('system.userList') }}</span>
        </template>
        <ul v-loading="loadingUsers" class="user-wrp" v-if="userList.length > 0">
          <li v-for="(user, index) in userList" :key="index" class="user">
            {{ user.username }}
          </li>
        </ul>
        <span v-else class="text-xs text-opacity-10">{{ t('system.noUsers') }}</span>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>{{ t('system.resourceList') }}</span>
        </template>
        <el-tree
          ref="treeRef"
          :data="resourceList"
          show-checkbox
          node-key="code"
          @check="isChanged = true"
          :render-content="renderContent"
          :props="{ label: 'name' }"
        />
        <el-button
          class="button"
          type="primary"
          style="width: 100%; margin-top: 20px"
          :disabled="!isChanged"
          @click="handleConfirm"
          >{{ t('system.confirmAssign') }}</el-button
        >
      </el-card>
    </el-col>
  </el-row>
  <Dialog v-model="dialogVisible" :title="t('system.addRole')" width="30%">
    <AddRole @close-dialog="handleCloseDialog" @update-list="getList" />
  </Dialog>
</template>

<style scoped lang="less">
li.user {
  padding: 6px 0;
}
</style>
