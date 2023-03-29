/*
 * 模块 : 地图操作事件模块
 * 作者 : 
 * 日期 : 2021-06-30
 * 版本 : version 1.0
 */
const eventsModules = import.meta.globEager('./modules/*.js');

export default function() {
  let events = {};
  Object.keys(eventsModules).forEach(modulePath => {
    const module = eventsModules[modulePath].default || eventsModules[modulePath];
    events = {...events, ...module};
  })
  return events;
}
