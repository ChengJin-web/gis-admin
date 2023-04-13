/**
 * @moduleName 地图工具栏相关
 * @author Jin Cheng
 * @description
 * @date 2023-03-31
 */
export default function () {
  /**
   * 当前面板是否高亮
   * @param {*} hPanels 当前实例的高亮面板对象
   * @param {*} component 当前面板对应的组件
   * @returns ture/false
   */
  const isUtilActive = (hPanels, component) => {
    const index = hPanels.findIndex((e) => e.component === component)
    return index >= 0
  }

  return {
    isUtilActive
  }
}
