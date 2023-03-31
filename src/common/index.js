/**
 * @moduleName 系统通用操作
 * @author Jin Cheng
 * @description
 * @date 2023-03-30
 */

import { useRoute, useRouter } from 'vue-router'
import { useMapStore } from '@/store'

export default function () {
  const route = useRoute()
  const router = useRouter()
  const mapStore = useMapStore()

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
    dispatchMapEvent
  }
}
