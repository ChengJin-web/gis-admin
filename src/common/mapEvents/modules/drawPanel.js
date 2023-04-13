/*
 * 地图绘制工具相关事件
 */
import Sketch from '@arcgis/core/widgets/Sketch'
import { removeWidget } from '@/utils/map'
let sketch = null

export default {
  /**
   * 绘制工具
   * @param {*} view 视图
   * @param {*} data 传递数据
   */
  onOpenDraw: (view, data) => {
    removeWidget(view, sketch)

    if (!data || !data.panelID) {
      console.log('缺少传递数据 { panelID }，获取父级内容容器ID')
      return false
    }

    const { panelID } = data

    console.log('展开绘制工具面板')

    const panelContent = document.getElementById(panelID)

    const drawUtil = document.createElement('div')
    drawUtil.id = 'draw'

    panelContent.appendChild(drawUtil)

    sketch = new Sketch({
      layer: view.map.findLayerById('graphicsLayer'),
      view,
      id: 'Sketch',
      creationMode: 'update',
      container: document.getElementById(drawUtil.id),
      visibleElements: {
        settingsMenu: false
      }
    })

    sketch.on('create', function (event) {
      // 检查创建事件的状态是否已更改为完成指示
      // 完成图形创建操作。
      if (event.state === 'complete') {
        console.log(event.graphic.geometry)
        // remove the graphic from the layer. Sketch adds
        // the completed graphic to the layer by default.
        // graphicsLayer.remove(event.graphic);

        // // use the graphic.geometry to query features that intersect it
        // selectFeatures(event.graphic.geometry);
      }
    })
  },

  /**
   * 取消绘制工具
   * @param {*} view 视图
   */
  onRemoveDraw: (view) => {
    console.log('收起绘制工具面板')
    removeWidget(view, sketch)
  }
}
