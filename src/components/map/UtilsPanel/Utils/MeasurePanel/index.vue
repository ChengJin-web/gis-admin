<template>
  <UtilPanel
    width="300px"
    :title="`${panel.utilName}工具`"
    :panel-id="panelID"
    :show-help-icon="false"
    @on-click-close="onClose"
  >
    <button
      class="action-button esri-icon-measure-line mr-10"
      :class="{ 'is-active': activeButton === 'distance' }"
      id="distanceButton"
      type="button"
      title="测量两点之间的距离"
      @click="onMeasureDistance('onMeasureDistance2D')"
    ></button>
    <button
      class="action-button esri-icon-measure-area"
      :class="{ 'is-active': activeButton === 'area' }"
      id="areaButton"
      type="button"
      title="计算面积"
      @click="onMeasureArea('onMeasureArea2D')"
    ></button>
  </UtilPanel>
</template>

<script setup>
import { ref, watch, toRaw, computed } from 'vue'
import { useMapStore } from '@/store'
import UtilPanel from '@/components/common/UtilPanel/index.vue'
import measurePanel from '../../../../../common/mapEvents/modules/measurePanel.js'

const mapStore = useMapStore()

const view = toRaw(computed(() => mapStore.view))

const props = defineProps({
  // 面板
  panel: {
    type: Object,
    default: () => ({
      utilName: '量算'
    })
  },
  // 当前面板索引在panelList中的索引
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close'])

// 当前激活按钮
const activeButton = ref(null)
const panelID = 'measurePanel'

// 关闭面板
const onClose = () => {
  emit('close', {
    panel: props.panel,
    index: props.index,
    active: false,
    eventSuffix: 'Measure',
    panelID
  })
}

// 设置当前激活按钮
const setActiveButton = (val) => {
  activeButton.value = activeButton.value === val ? null : val
}

// 测量距离
const onMeasureDistance = () => {
  setActiveButton('distance')
  measurePanel.onMeasureDistance2D(toRaw(view.value), {
    panelID,
    activeButton: activeButton.value
  })
}

// 测量面积
const onMeasureArea = () => {
  setActiveButton('area')
  measurePanel.onMeasureArea2D(toRaw(view.value), {
    panelID,
    activeButton: activeButton.value
  })
}
</script>

<style lang="scss">
#measureDistance2D,
#measureArea2D {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
</style>
