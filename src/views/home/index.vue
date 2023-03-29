<script setup>
import { ref, provide, reactive } from 'vue'
import ArcMap from '@/components/map/index.vue'

// 当前地图视图为2D或者3D
const mapViewType = ref('3D')

// 当前地图底图类型
const basemap = ref('hybrid')

// 摄像机信息
const cameraInfo = ref({
  tilt: 45,
  heading: 44
})

// 坐标信息
const coordInfo = reactive({
  // 会展中心坐标
  lon: 108.37586,
  lat: 22.81221,
  tilt: 0,
  heading: 0,
  scale: 50000000,
  locate: ''
})

// 监听通过地图信息设置地图比例
// const onMapSetView = ({ scale }) => {
//   coordInfo.scale = scale;
//   ElMessage.success(`已将地图比例调整至1:${scale}`)
//   // 调用子组件方法
//   mapRef.value.onSetScale(scale);
// };
// 顶级组件通过provide传递给子孙组件
provide('getMapViewType', mapViewType)
provide('getBasemap', basemap)
provide('getCameraInfo', cameraInfo)
provide('getCoordInfo', coordInfo)
provide('getFixedHeader', false)
</script>

<template>
  <ArcMap></ArcMap>
</template>
