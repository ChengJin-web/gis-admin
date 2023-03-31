/**
 * @moduleName 地图操作事件模块
 * @author Jin Cheng
 * @description
 * @date 2023-03-31
 */

const eventsModules = import.meta.globEager('./modules/*.js')

export default function () {
  let events = {}
  Object.keys(eventsModules).forEach((modulePath) => {
    const module = eventsModules[modulePath].default || eventsModules[modulePath]
    events = { ...events, ...module }
  })
  return events
}
