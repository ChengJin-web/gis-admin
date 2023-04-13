<script setup>
import { onMounted, inject } from 'vue'
import { ElLoading } from 'element-plus'

import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'
import { useMapStore } from '@/store'

// 组件
import Screenshot from '@/components/map/Screenshot/index.vue'
// 地图
import map from '@/common/map/index.js'
import layers from '@/common/map/layers.js'

const mapStore = useMapStore()

const { mapCenterPoint, mapViewConfig } = map()
const { imageBasemapLayer, vectorBasemapGroupLayer, terrainBasemapNoteGroupLayer, graphicsLayer } =
  layers()

// 地图加载loading
let loading = null

// 坐标信息
const coordInfo = inject('getCoordInfo')

// 2D地图配置
let map2D = {
  id: 'map2D',
  view: null
}

// 当前地图配置
let currentMapConfig = null

// 最终视图缩放大小
let finalViewZoom = 10

onMounted(() => {
  currentMapConfig = map2D
  initMap()
})

/**
 * 初始化地图
 */
const initMap = () => {
  loading = ElLoading.service({
    lock: true,
    text: '地图加载中...',
    background: 'rgba(0, 0, 0, 0.5)'
  })

  const layerList = [vectorBasemapGroupLayer, imageBasemapLayer, terrainBasemapNoteGroupLayer]

  const basemap = new Basemap({
    baseMapLayers: layerList
  })

  let map = new Map({
    basemap
  })

  layerList.forEach((e) => {
    map.add(e)
  })

  let view = new MapView({
    ...{
      map: map,
      ...mapViewConfig(map2D.id)
    },
    center: mapCenterPoint,
    zoom: finalViewZoom,
    scale: coordInfo.scale
  })

  view.map.add(graphicsLayer)

  view.ui.empty('top-left')

  // 移除powered by
  view.ui._removeComponents(['attribution'])

  setViewMouseKeyEvent(view)

  map2D.view = view

  mapStore.setView(view)

  view.when(() => {
    console.log('地图加载成功')
    loading.close()
  })
}

// 地图鼠标/键盘事件
const setViewMouseKeyEvent = (view) => {
  // 鼠标移动
  view.on('pointer-move', (e) => {
    let point = view.toMap({ x: e.x, y: e.y })
    if (point) {
      const { longitude, latitude } = point
      coordInfo.lon = parseFloat(longitude).toFixed(5)
      coordInfo.lat = parseFloat(latitude).toFixed(5)
    }
  })

  // 鼠标滚轮事件
  view.on('mouse-wheel', () => {
    changeViewScale(Math.round(view.scale))
  })
}

// 修改地图视图比例
const changeViewScale = (scale) => {
  coordInfo.scale = scale
}

// 关闭截图功能
const onCloseScreenshot = () => {
  currentMapConfig.view.container.classList.remove('screenshotCursor')
  mapStore.setStartScreenshot(false)
}
</script>

<template>
  <div class="map-container">
    <div :id="map2D.id"></div>
  </div>
  <Screenshot @close="onCloseScreenshot" />
</template>

<style lang="scss" scoped>
.map-container {
  position: relative;
}
#map2D {
  width: 100%;
  height: 100vh;
  display: flex;
}
</style>

<style lang="scss">
/* 去掉地图聚焦边框 */
.esri-view-surface--inset-outline:focus::after {
  outline: none !important;
}

.esri-ui-bottom-right {
  right: 8px !important;
  bottom: 15px !important;
}

.esri-ui-corner {
  .esri-component {
    border-radius: 4px !important;
    overflow: hidden;
    font-weight: bold !important;
    color: #666666 !important;
  }
}

.esri-zoom {
  .esri-widget--button {
    height: 30px !important;
    width: 30px !important;
    font-weight: bold;
    &:last-child {
      border-top: 1px dashed #e7e7e7 !important;
      color: #c7c7c7 !important;
    }
  }
}
</style>
