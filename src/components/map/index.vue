<script setup>
import { onMounted, watch, inject } from 'vue'

import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'

// 组件
import Screenshot from '@/components/map/Screenshot/index.vue'
// 地图事件
import mapEvents from '@/common/mapEvents/index.js'
// 地图
import map from '@/common/map/index.js'
import layers from '@/common/map/layers.js'

const { mapEvent, mapCenterPoint, mapViewConfig } = map()

const { imageBasemapLayer, vectorBasemapGroupLayer, terrainBasemapNoteGroupLayer, graphicsLayer } =
  layers()

// 获取顶级组件传递的值：当前地图视图是2D或者3D
const mapViewType = inject('getMapViewType')

// 坐标信息
const coordInfo = inject('getCoordInfo')

let arcgisMap = null

// 2D地图配置
let map2D = {
  id: 'map2D',
  view: null
}

// 当前地图配置
let currentMapConfig = null

// 最终视图缩放大小
let finalViewZoom = 10

// 监听地图事件传递
watch(
  () => mapEvent.value,
  (events) => {
    if (events.length) {
      return events.forEach((e) => {
        const { event, data } = e

        currentMapConfig = map2D

        mapEvents()[event](currentMapConfig.view, data, mapViewType.value)

        // 放大缩小
        if (event === 'onZoomIn' || event === 'onZoomOut') {
          changeViewScale(Math.round(currentMapConfig.view.scale))
        }
      })
    }
  }
)

onMounted(() => {
  currentMapConfig = map2D
  initMap()
})

/**
 * 初始化地图
 */
const initMap = () => {
  const layerList = [imageBasemapLayer, vectorBasemapGroupLayer, terrainBasemapNoteGroupLayer]

  arcgisMap = createMap(layerList)

  map2D.view = createView({
    map: arcgisMap,
    ...mapViewConfig(map2D.id)
  })
}

/**
 * 创建地图
 *
 * @param {*} layerList 图层列表
 */
const createMap = (layerList) => {
  const basemap = new Basemap({
    baseMapLayers: layerList
  })

  let map = new Map({
    basemap
  })

  layerList.forEach((e) => {
    map.add(e)
  })

  return map
}

/**
 * 创建视图
 *
 * @param {*} params 视图参数
 * @param {*} type 视图类型
 */
const createView = (params) => {
  let view = new MapView({
    ...params,
    center: mapCenterPoint,
    zoom: finalViewZoom,
    scale: coordInfo.scale
  })

  view.map.add(graphicsLayer)

  view.ui.empty('top-left')

  // 移除powered by
  view.ui._removeComponents(['attribution'])

  setViewMouseKeyEvent(view)

  return view
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

// 设置地图视图比例-父组件调用
const onSetScale = (scale) => {
  currentMapConfig.view.scale = scale
}

// 关闭截图功能
const onCloseScreenshot = () => {
  currentMapConfig.view.container.classList.remove('screenshotCursor')
  // store.dispatch("map/setStartScreenshot", false);
}

// 暴露方法给父组件调用
defineExpose({ onSetScale })
</script>

<template>
  <div class="map-container">
    <div :id="map2D.id" :class="{ hide: mapViewType !== '2D' }"></div>
    <Screenshot @close="onCloseScreenshot" />
  </div>
</template>

<style lang="scss" scoped>
.map-container {
  position: relative;
}
#map2D {
  width: 100%;
  height: 100vh;
  display: flex;

  &.hide {
    display: none;
  }
}
</style>

<style lang="scss">
/* 去掉地图聚焦边框 */
.esri-view-surface--inset-outline:focus::after {
  outline: none !important;
}
</style>
