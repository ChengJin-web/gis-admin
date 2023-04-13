<template>
  <div v-drag class="util-panel" :style="{ width, top, right }">
    <div class="util-panel__header drag-move">
      <span>
        <span>{{ title }}</span>
      </span>
      <span>
        <el-icon class="el-icon-close" v-if="showCloseIcon" @click="onClickClose">
          <CloseBold />
        </el-icon>
      </span>
    </div>
    <div v-if="showContent" :id="panelId" class="util-panel__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '工具名称'
  },
  panelId: {
    type: String,
    default: 'util'
  },
  width: {
    type: String,
    default: '300px'
  },
  // 初始位置top
  top: {
    type: String,
    default: '48px'
  },
  // 初始位置right
  right: {
    type: String,
    default: '0'
  },
  // 是否显示“关闭”按钮
  showCloseIcon: {
    type: Boolean,
    default: true
  },
  // 是否显示工具内容
  showContent: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['on-click-close'])

// 点击“关闭”按钮
const onClickClose = () => {
  emit('on-click-close')
}
</script>

<style lang="scss" scoped>
.util-panel {
  position: absolute;
  top: 48px;
  right: 0;
  background: #fff;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
  z-index: 10;

  &__header {
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    background: #eceef3;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-icon-question,
    .el-icon-close,
    .icon-zuidahua {
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary, #168bf2);
      }
    }

    .el-icon-question {
      font-size: 16px;
      color: #555555;
    }

    .el-icon-close {
      font-size: 16px;
    }
  }

  &__content {
    padding: 10px;

    :deep(.action-button) {
      font-size: 16px;
      background-color: transparent;
      border: 1px solid #e6ebf5;
      color: #6e6e6e;
      height: 32px;
      width: 32px;
      text-align: center;
      outline: none;
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary, #168bf2);
        border-color: var(--el-color-primary, #168bf2);
      }

      &.is-active {
        background: var(--el-color-primary, #168bf2);
        color: #e4e4e4;
        border-color: var(--el-color-primary, #168bf2);
      }
    }
  }
}
</style>
