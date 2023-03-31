/**
 * @moduleName 系统通用操作
 * @author Jin Cheng
 * @description
 * @date 2023-03-30
 */

// import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMapStore } from '@/store'
import { ElMessageBox } from 'element-plus'

export default function () {
  const route = useRoute()
  const router = useRouter()
  const mapStore = useMapStore()

  /**
   * 显示开发提示框
   */
  function showDevMessage() {
    ElMessageBox.alert('功能建设中，敬请期待', '温馨提示', {
      confirmButtonText: '确定'
    })
  }

  /**
   * 地图事件派遣
   *
   * @param {*} events 事件名或者一个包含事件对象的事件数组
   * @param {*} data 传递数据
   */
  const dispatchMapEvent = (events, data) => {
    const type = typeof events

    // 以对象方式单传一个方法
    if (type === 'string') {
      mapStore.changeMapEvent([{ event: events, data }])
    }
    // 以数组方式传递多个方法
    else if (type === 'object') {
      mapStore.changeMapEvent(events)
    }
  }

  return {
    route,
    router,
    mapStore,
    showDevMessage,
    dispatchMapEvent
  }
}
