<script setup lang="ts">
import { h, reactive, ref } from 'vue'
import {
  getUserListApi,
  delUserListApi,
  toggleUserApi,
  resetUserPasswordApi
} from '@/api/system/user'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useI18n } from '@/hooks/web/useI18n'
import { TableData, userRoleInfo } from '@/api/system/user/types'
import AddUser from './components/AddUser.vue'
import AssignRole from './components/AssignRole.vue'
import { ElTag } from 'element-plus'
import { formatTime } from '@/utils'
import { ElNotification } from 'element-plus'

const { t } = useI18n()

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getUserListApi,
  delListApi: delUserListApi,
  response: {
    list: 'list',
    total: 'total'
  }
})

const dialogVisible = ref(false),
  dialogVisible2 = ref(false),
  delLoading = ref(false),
  currentUserId = ref(),
  currentRole = ref<number[]>([])

const { getList } = methods
getList()
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  let selections: TableData[] = []
  if (multiple) {
    selections = await getSelections()
  }
  delLoading.value = true
  await delList(multiple ? selections.map((v) => v.id) : [row?.id as number], multiple).finally(
    () => {
      delLoading.value = false
    }
  )
}
const toggleUser = async (row: TableData, status: number) => {
  tableObject.loading = true
  toggleUserApi(row.id, status).then(() => {
    ElNotification({
      title: t('common.success'),
      message: status === 0 ? t('system.frozeUserSuccess') : t('system.unlockUserSuccess'),
      type: 'success'
    })
    getList()
  })
}
const resetPassword = async (row: TableData) => {
  tableObject.loading = true
  resetUserPasswordApi(row.id).then(() => {
    ElNotification({
      title: t('common.success'),
      message: t('system.resetPasswordSuccess'),
      type: 'success'
    })
    tableObject.loading = false
  })
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '#',
    type: 'index'
  },
  {
    field: 'username',
    label: t('system.username')
  },
  {
    field: 'mobile',
    label: t('system.mobile')
  },
  {
    field: 'email',
    label: t('system.email')
  },
  {
    field: 'create_time',
    label: t('common.createTime'),
    formatter: (_: Recordable, __: TableColumn, cellValue: string) => {
      return h('span', null, formatTime(cellValue))
    }
  },
  {
    field: 'status',
    label: t('system.status'),
    formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
      return h(
        ElTag,
        {
          type: cellValue === 1 ? 'success' : 'danger'
        },
        () => (cellValue === 1 ? t('system.normal') : t('system.frozen'))
      )
    }
  },
  {
    field: 'role',
    label: t('system.role'),
    formatter: (_: Recordable, __: TableColumn, cellValue: object[]) => {
      if (cellValue.length === 0) {
        return h(
          ElTag as any,
          {
            type: 'info'
          },
          () => t('system.noAssign')
        )
      }
      return h(
        'div',
        { class: 'role' },
        // assuming `items` is a ref with array value
        cellValue.map((role: userRoleInfo) => {
          return h(
            ElTag as any,
            {
              type: ''
            },
            () => role?.role_name
          )
        })
      )
    }
  },
  {
    field: 'action',
    width: '260px',
    label: t('common.action')
  }
])

const action = (row: TableData, action: String): void => {
  switch (action) {
    case 'assignRole':
      break
    case 'del':
      delData(row, false)
      break
    case 'froze':
      toggleUser(row, 0)
      break
    case 'unlock':
      toggleUser(row, 1)
      break
    case 'reset':
      resetPassword(row)
      break

    default:
      break
  }
}

const handleAddUser = () => {
  dialogVisible.value = true
}
const handleCloseDialog = () => {
  dialogVisible.value = false
}
const handleAssignRole = (row: TableData) => {
  dialogVisible2.value = true
  currentUserId.value = row.id
  currentRole.value = row.role.map((item) => item.role_id)
}
</script>
<template>
  <ContentWrap>
    <div class="mb-10px">
      <ElButton type="primary" @click="handleAddUser">{{ t('common.add') }}</ElButton>
    </div>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="crudSchemas"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      :selection="false"
      @register="register"
    >
      <template #action="{ row }">
        <el-tooltip effect="dark" :content="t('system.assignRole')" placement="top">
          <el-button type="primary" @click="handleAssignRole(row)" icon="UserFilled" circle />
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="t('system.frozenUser')"
          placement="top"
          v-if="row.status === 1"
        >
          <el-button type="warning" @click="action(row, 'froze')" icon="Lock" circle />
        </el-tooltip>
        <el-tooltip
          effect="dark"
          :content="t('system.unlockUser')"
          placement="top"
          v-if="row.status === 0"
        >
          <el-button type="success" @click="action(row, 'unlock')" icon="Unlock" circle />
        </el-tooltip>
        <el-tooltip effect="dark" :content="t('system.deleteUser')" placement="top">
          <el-button type="danger" @click="action(row, 'del')" icon="DeleteFilled" circle />
        </el-tooltip>
        <el-tooltip effect="dark" :content="t('system.resetUserPassword')" placement="top">
          <el-button
            type="primary"
            @click="action(row, 'reset')"
            icon="WarnTriangleFilled"
            circle
          />
        </el-tooltip>
      </template>
    </Table>
  </ContentWrap>
  <Dialog v-model="dialogVisible" :title="t('system.addUser')" width="30%">
    <AddUser @close-dialog="handleCloseDialog" @update-list="getList" />
  </Dialog>
  <Dialog v-model="dialogVisible2" :title="t('system.assignRole')" width="800px">
    <AssignRole
      @close-dialog="dialogVisible2 = false"
      :userId="currentUserId"
      :initialRole="currentRole"
      @update-list="getList"
    />
  </Dialog>
</template>

<style lang="less">
.role {
  .el-tag {
    margin-right: 4px;
  }
}
</style>
