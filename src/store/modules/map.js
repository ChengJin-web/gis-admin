import { defineStore } from 'pinia'
const useMapStore = defineStore('map', {
  state: () => ({
    view: null,
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
    setView(view) {
      this.view = view
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
