<script setup>
import { ref } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { RouterView } from 'vue-router'

const zIndex = ref(3000)
const size = ref('default')
const locale = ref(zhCn)
</script>

<template>
  <el-config-provider :size="size" :z-index="zIndex" :locale="locale">
    <RouterView />
  </el-config-provider>
</template>
