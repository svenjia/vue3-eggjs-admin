<script setup lang="ts">
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('welcome')
</script>

<template>
  <div :class="prefixCls" class="w-full min-h-full">
    <img src="@/assets/imgs/welcome-13.gif" class="m-auto mt-10" />
  </div>
</template>

<style lang="less" scoped></style>
