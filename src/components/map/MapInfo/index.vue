<template>
  <div :class="['map-info-panel', foldMapInfoPanel ? 'fold' : 'unfold']">
    <div class="map-info-panel__title" @click="setContentVisible(!foldMapInfoPanel)">
      <div><span>地图信息</span></div>
      <el-icon><CaretBottom /></el-icon>
    </div>
    <div v-if="!foldMapInfoPanel" class="map-info-panel__content">
      <div class="content">
        <div class="title">鼠标位置</div>
        <span v-if="coordInfo.lon">经度：{{ coordInfo.lon }}</span>
        <span v-if="coordInfo.lat">，纬度：{{ coordInfo.lat }}</span>
        <br />
        <span v-if="coordInfo.locate">当前鼠标坐落：{{ coordInfo.locate }}</span>
      </div>
      <div class="title">
        <span v-if="coordInfo.scale">
          <span>地图比例</span>
          <span class="normal">1:{{ coordInfo.scale }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  // 是否折叠地图信息面板
  foldMapInfoPanel: {
    type: Boolean,
    default: false
  }
})

// 坐标信息
const coordInfo = inject('getCoordInfo')

const emit = defineEmits(['click-fold'])

// 收起面板
const setContentVisible = (val) => {
  emit('click-fold', val)
}
</script>

<style lang="scss" scoped>
.map-info-panel {
  position: absolute;
  // z-index: 10;
  top: 15px;
  left: 15px;
  background: #fff;
  border-radius: 4px;
  width: 290px;
  overflow: hidden;
  box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);

  &.fold {
    width: 100px;

    .el-icon-caret-top {
      transition: 0.2s;
      transform-origin: center;
      transform: rotateZ(180deg);
    }
  }

  &__title {
    background: #eceef3;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    color: #535353;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .el-icon-caret-top {
      font-size: 20px;
      transition: 0.2s;
      transform-origin: center;
      transform: rotateZ(0deg);
    }
  }

  &__content {
    padding: 0 10px 10px 10px;

    .title {
      font-weight: bold;
      color: #666;
      margin: 10px 0;
    }

    .normal {
      font-weight: normal;
      color: #333;
    }
  }
}

.scale-content {
  display: flex;
  justify-content: space-around;
  :deep(.el-button--primary) {
    > span {
      display: flex;
      align-items: center;
    }
  }
}
</style>
