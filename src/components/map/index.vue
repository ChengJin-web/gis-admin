<script setup>
import { onMounted, watch, inject, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
// import { useAppStore } from '@/store'
// Arcgis
import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'
import MapView from '@arcgis/core/views/MapView'
import Basemap from '@arcgis/core/Basemap'

// 组件
// import Screenshot from '@/components/map/Screenshot/index.vue'
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
// 摄像机信息
const cameraInfo = inject('getCameraInfo')
// 坐标信息
const coordInfo = inject('getCoordInfo')

// 摄像机初始动画
const mapCameraAnimation = false

let arcgisMap = null

// 3D地图配置
let map3D = {
  id: 'map3D',
  view: null
}

// 2D地图配置
let map2D = {
  id: 'map2D',
  view: null
}

// 当前地图配置
let currentMapConfig = null

// 最终视图缩放大小
let finalViewZoom = 17

// 监听地图事件传递
watch(
  () => mapEvent.value,
  (events) => {
    if (events.length) {
      return events.forEach((e) => {
        const { event, data } = e
        // console.log(event, data);

        // 2/3D视图转换
        if (event === 'onTransformView') {
          onTransformView(data.viewType)
          return false
        }

        currentMapConfig = mapViewType.value === '2D' ? map2D : map3D

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
  currentMapConfig = mapViewType.value === '2D' ? map2D : map3D
  initMap()
})

/**
 * 初始化地图
 */
const initMap = () => {
  const layerList = [imageBasemapLayer, vectorBasemapGroupLayer, terrainBasemapNoteGroupLayer]

  arcgisMap = createMap(layerList)

  map2D.view = createView(
    {
      map: arcgisMap,
      ...mapViewConfig(map2D.id)
    },
    '2D'
  )

  map3D.view = createView(
    {
      map: arcgisMap,
      ...mapViewConfig(map3D.id)
    },
    '3D'
  )
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
const createView = (params, type) => {
  //   console.log(...params)
  let view =
    type === '2D'
      ? new MapView({
          ...params,
          center: mapCenterPoint,
          zoom: finalViewZoom,
          scale: coordInfo.scale
        })
      : new SceneView({
          ...params,
          zoom: 1
        })

  view.map.add(graphicsLayer)

  view.ui.empty('top-left')

  // 移除powered by
  view.ui._removeComponents(['attribution'])

  setViewMouseKeyEvent(view)
  initCamera(view, mapCameraAnimation.value)

  return view
}

/**
 * 初始化摄像机
 *
 * @param {*} view 视图对象
 * @param {*} type
 * @param {*} animation 是否显示进场动画
 * @param {*} duration 动画持续时间
 */
const initCamera = (view, animation = true, duration = 5000) => {
  let gotoInfo = {
    center: [coordInfo.lon, coordInfo.lat],
    tilt: cameraInfo.value.tilt,
    heading: cameraInfo.value.heading,
    zoom: finalViewZoom
  }

  if (!animation) {
    gotoInfo.tilt = 0
    gotoInfo.heading = 0
    duration = 0
  }

  view.when(function () {
    setTimeout(
      () => {
        view.goTo(gotoInfo, { duration }).then(() => {
          // 摄像机移动结束设置当前比例
          //   changeViewScale(Math.round(view.scale))
        })
      },
      animation ? 1500 : 0
    )

    // 监听摄像机
    view.watch('camera', (camera) => {
      let tilt = camera.tilt
      let heading = camera.heading
      //   let position = camera.position
      //   console.log(tilt, heading, position)

      changeCameraInfo(tilt, heading)
      changeCoordInfoTiltHeading(tilt, heading)
    })
  })
}

/**
 * 2/3D视图转换
 *
 * @param {*} type 要转换的视图类型
 */
const onTransformView = (type) => {
  nextTick(() => {
    // 切换至2D
    if (type === '2D') {
      map3D.view.goTo({ tilt: 0, heading: 0 }, { duration: 3000 }).then(() => {
        const viewpoint = map3D.view.viewpoint.clone()
        map2D.view.viewpoint = viewpoint

        currentMapConfig = map2D

        mapViewType.value = type
        ElMessage.success(`您已成功切换至${type}视图`)
      })
    } else {
      const viewpoint = map2D.view.viewpoint.clone()
      map3D.view.viewpoint = viewpoint

      currentMapConfig = map3D

      mapViewType.value = type

      map3D.view.goTo({ tilt: 45 }, { duration: 3000 }).then(() => {
        ElMessage.success(`您已成功切换至${type}视图`)
      })
      // ElMessage.success(`您已成功切换至${type}视图`);
    }
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

  // 鼠标移动
  view.on('pointer-move', (e) => {
    let point = view.toMap({ x: e.x, y: e.y })
    if (point) {
      const { longitude, latitude } = point

      coordInfo.lon = parseFloat(longitude).toFixed(5)
      coordInfo.lat = parseFloat(latitude).toFixed(5)
    }
  })

  view.on('drag', () => {
    if (mapViewType.value == '3D') {
      const { tilt, heading } = view.camera
      changeCoordInfoTiltHeading(tilt, heading)
    }
  })

  // 鼠标滚轮事件
  view.on('mouse-wheel', () => {
    changeViewScale(Math.round(view.scale))
  })
}

// 修改地图摄像机位置
const changeCameraInfo = (tilt, heading) => {
  cameraInfo.value = { tilt, heading }
}

// 修改地图视图比例
const changeViewScale = (scale) => {
  coordInfo.scale = scale
}

// 修改坐标摄像机位置
const changeCoordInfoTiltHeading = (tilt, heading) => {
  coordInfo.tilt = mapViewType.value === '2D' ? '0.00' : parseFloat(tilt).toFixed(2)
  coordInfo.heading = mapViewType.value === '2D' ? '0.00' : parseFloat(heading).toFixed(2)
}

// 设置地图视图比例-父组件调用
const onSetScale = (scale) => {
  currentMapConfig.view.scale = scale
}

// 关闭截图功能
// const onCloseScreenshot = () => {
//   currentMapConfig.view.container.classList.remove("screenshotCursor");
//   store.dispatch("map/setStartScreenshot", false);
// };

// 暴露方法给父组件调用
defineExpose({ onSetScale })
</script>

<template>
  <div class="map-container">
    <div :id="map3D.id" :class="{ hide: mapViewType !== '3D' }"></div>
    <div :id="map2D.id" :class="{ hide: mapViewType !== '2D' }"></div>
    <!-- <Screenshot @close="onCloseScreenshot" /> -->
  </div>
</template>

<style lang="scss" scoped>
#map3D,
#map2D {
  width: 100%;
  height: 100vh;
  display: flex;

  &.hide {
    display: none;
  }
}
</style>
<style>
.esri-view-root {
  width: 100%;
  height: 100%;
}
.esri-view-surface {
  width: 100%;
  height: 100%;
}
</style>
