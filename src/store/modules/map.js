import { defineStore } from 'pinia'
const useMapStore = defineStore('map', {
  state: () => ({
    // 地图操作事件
    mapEvent: [
      // {
      //   event: "",  // 事件名
      //   data: null, // 传递数据
      // },
    ],
    // 是否开启拾取坐标
    startGetLocateCoord: false,
    // 定位数据
    locateData: {
      lon: 0,
      lat: 0
    },
    // 是否开启截图
    startScreenshot: false
  }),
  actions: {
    changeMapEvent(mapEvent) {
      this.mapEvent = mapEvent
    },
    setStartScreenshot(startScreenshot) {
      this.startScreenshot = startScreenshot
    },
    setStartGetLocateCoord(startGetLocateCoord) {
      this.startGetLocateCoord = startGetLocateCoord
    },
    setLocateData(locateData) {
      this.locateData = locateData
    }
  }
})
export default useMapStore
