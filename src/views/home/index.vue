<script setup>
import { ref, provide, reactive } from 'vue'
import MapView from '@/components/map/MapView/index.vue'
import UtilsPanel from '@/components/map/UtilsPanel/index.vue'
import MapInfo from '@/components/map/MapInfo/index.vue'
// 地图实例
const mapRef = ref(null)

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

// 是否折叠地图资源面板
const foldMapInfoPanel = ref(false)

// 折叠地图资源面板方法
const onFoldMapInfoPanel = (val) => {
  foldMapInfoPanel.value = val
}

provide('getCoordInfo', coordInfo)
</script>

<template>
  <div class="map-index-container">
    <MapView ref="mapRef"></MapView>

    <!-- 地图信息面板 -->
    <MapInfo :fold-map-info-panel="foldMapInfoPanel" @click-fold="onFoldMapInfoPanel" />

    <!-- 工具栏 -->
    <UtilsPanel ref="utilsPanelRef" />
  </div>
</template>
