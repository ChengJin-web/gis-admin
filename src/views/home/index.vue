<script setup>
import { ref, provide, reactive } from 'vue'
import ArcMap from '@/components/map/index.vue'
import UtilsPanel from '@/components/map/UtilsPanel/index.vue'
import MapInfo from '@/components/map/MapInfo/index.vue'
import { ElMessage } from 'element-plus'
// 地图实例
const mapRef = ref(null)

// 当前地图视图为2D或者3D
const mapViewType = ref('2D')

// 当前地图底图类型
const basemap = ref('hybrid')

// 坐标信息
const coordInfo = reactive({
  // 会展中心坐标
  lon: 120.161819,
  lat: 30.255994,
  tilt: 0,
  heading: 0,
  scale: 50000,
  locate: ''
})

// 卷帘工具
const swipePanel = ref({
  visible: false,
  panel: null,
  index: -1,
  minimize: false
})

// 分屏工具
const splitScreen = ref({
  visible: false,
  panel: null,
  index: -1,
  minimize: false
})

// 是否折叠地图资源面板
const foldMapInfoPanel = ref(false)

// 折叠地图资源面板方法
const onFoldMapInfoPanel = (val) => {
  foldMapInfoPanel.value = val
}

// 监听通过地图信息设置地图比例
const onMapSetView = ({ scale }) => {
  coordInfo.scale = scale
  ElMessage.success(`已将地图比例调整至1:${scale}`)
  // 调用子组件方法
  mapRef.value.onSetScale(scale)
}

// 打开全屏窗口
const onOpenFullscreenWindow = ({ visible, panel, index }) => {
  console.log('打开全屏弹窗')

  const val = { visible, panel, index, minimize: false }

  switch (panel.component) {
    case 'SwipePanel':
      swipePanel.value = val
      break
    case 'SplitScreen':
      splitScreen.value = val
      break
    default:
      console.log('component is error')
  }
}

// 顶级组件通过provide传递给子孙组件
provide('getMapViewType', mapViewType)
provide('getBasemap', basemap)
provide('getCoordInfo', coordInfo)
provide('getFixedHeader', false)
</script>

<template>
  <div class="map-index-container">
    <ArcMap ref="mapRef"></ArcMap>

    <!-- 地图信息面板 -->
    <MapInfo
      :fold-map-info-panel="foldMapInfoPanel"
      @click-fold="onFoldMapInfoPanel"
      @map-set-view-scale="onMapSetView"
    />

    <!-- 工具栏 -->
    <UtilsPanel ref="utilsPanelRef" @open-full-screen-window="onOpenFullscreenWindow" />
  </div>
</template>
