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

// 获取顶级组件传递的值：当前地图视图是2D或者3D
const mapViewType = inject('getMapViewType')

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

  mapStore.setView(currentMapConfig.view)

  view.when(() => {
    console.log('地图加载成功')
    loading.close()
  })
}

// 地图鼠标/键盘事件
const setViewMouseKeyEvent = (view) => {
  // 2D视图下，不可以用WASD控制方向
  view.on('key-down', (e) => {
    if (mapViewType.value == '2D') {
      const forbidKeys = ['a', 's', 'd', 'w', 'A', 'S', 'D', 'W']
      if (forbidKeys.indexOf(e.key) !== -1) {
        e.stopPropagation()
      }
    }
  })

  // view.on('drag', (e) => {
  //   if (mapViewType.value == '3D') {
  //     const { tilt, heading } = view.camera
  //     changeCoordInfoTiltHeading(tilt, heading)
  //   }
  // })
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

// 设置地图视图比例-父组件调用
const onSetScale = (scale) => {
  currentMapConfig.view.scale = scale
}

// 关闭截图功能
const onCloseScreenshot = () => {
  currentMapConfig.view.container.classList.remove('screenshotCursor')
  mapStore.setStartScreenshot(false)
}

// 暴露方法给父组件调用
defineExpose({ onSetScale })
</script>

<template>
  <div class="map-container">
    <div :id="map2D.id" :class="{ hide: mapViewType !== '2D' }"></div>
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
