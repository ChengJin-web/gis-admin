import { computed } from 'vue'
import { useMapStore } from '@/store'
// 配置
import { SPATIAL_REFERENCE_WKID } from '@/config/index.js'

export default function () {
  const mapStore = useMapStore()

  // 地图事件传递
  const mapEvent = computed(() => mapStore.mapEvent)

  // 地图中心坐标（杭州）
  const mapCenterPoint = [120.161819, 30.255994]

  // 地图视图参数配置
  const mapViewConfig = (container) => {
    return {
      container,
      alphaCompositingEnabled: true,
      // 星空环境
      environment: {
        background: {
          type: 'color',
          color: [0, 0, 0]
        },
        starsEnabled: true,
        atmosphereEnabled: true
      },
      constraints: {
        snapToZoom: false,
        // 禁止旋转
        rotationEnabled: false,
        viewingMode: 'local'
      },
      spatialReference: {
        wkid: SPATIAL_REFERENCE_WKID
      }
    }
  }

  return {
    mapStore,
    mapEvent,
    mapCenterPoint,
    mapViewConfig
  }
}
