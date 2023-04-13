<template>
  <div class="utils-panel">
    <div class="utils-panel-wrapper">
      <!-- 常用工具列表 -->
      <div class="util-list-wrapper">
        <div class="util-list">
          <!-- 自定义常用工具 -->
          <template v-if="commonUtils.length">
            <div
              v-for="(item, index) in commonUtils"
              :key="'custom-util' + index"
              :class="setClassStyles(item)"
              @click="onClickUtil(item, item.eventSuffix, item.panelID)"
            >
              <span class="util-list-item__name">{{ item.utilName }}</span>
            </div>
          </template>

          <div class="util-list-item" @click="onClearScreen()">
            <span class="util-list-item__name">清屏</span>
          </div>

          <!-- 工具箱 -->
          <MoreUtils
            :highlight-panels="highlightPanels"
            :util-list="utilList"
            @click-util="onClickUtilBoxUtils"
          >
            <div class="util-list-item">
              <span class="util-list-item__name">工具箱</span>
            </div>
          </MoreUtils>
        </div>
      </div>

      <!-- 工具面板 -->
      <template v-if="panelList.length">
        <template v-for="(item, index) in panelList" :key="'util-panel' + index">
          <template v-if="item.utilActive">
            <component :is="item.component" :panel="item" :index="index" @close="onClosePanel" />
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
// 组件
import MoreUtils from './MoreUtils/index.vue'
import {
  DrawPanel,
  MeasurePanel,
  DayLightPanel,
  ElevationProfilePanel,
  LineOfSightPanel,
  ScreenshotPanel,
  LocatePanel
} from './Utils/index.js'

export default defineComponent({
  name: 'UtilsPanel',
  components: {
    MoreUtils,
    MeasurePanel,
    DrawPanel,
    DayLightPanel,
    ElevationProfilePanel,
    LineOfSightPanel,
    ScreenshotPanel,
    LocatePanel
  }
})
</script>

<script setup>
import { ref, nextTick, toRaw, computed } from 'vue'

import { useMapStore } from '@/store'

import drawPanel from '@/common/mapEvents/modules/drawPanel.js'
import clear from '@/common/mapEvents/modules/clear.js'

const mapStore = useMapStore()
const view = toRaw(computed(() => mapStore.view))

// 固定常用工具
const commonUtils = ref([
  {
    component: 'MeasurePanel',
    classStyles: 'iconfont icon-celianggongju',
    utilName: '量算',
    utilActive: false,
    eventSuffix: 'Measure',
    panelID: null
  },
  {
    component: 'DrawPanel',
    classStyles: 'iconfont icon-huizhi',
    utilName: '绘制',
    utilActive: false,
    eventSuffix: 'Draw',
    panelID: 'drawPanel'
  }
])

// --- 工具面板参数列表 ---
// {
//   component: "MeasurePanel", // 对应组件
//   classStyles: "iconfont icon-liangsuan", // 图标样式
//   utilName: "量算",  // 工具名称
//   utilActive: false, // 工具激活/高亮状态
//   eventSuffix: "Measure", // 传递事件后缀名, 例如 "onOpenMeasure" 和 "onRemoveMeasure"
//   panelID: null, // 工具应添加容器的ID
//   fullScreen: false // 工具是否满屏展示
// }

const panelList = ref([
  {
    component: 'MeasurePanel',
    classStyles: 'iconfont icon-celianggongju',
    utilName: '量算',
    utilActive: false,
    eventSuffix: 'Measure',
    panelID: null
  },
  {
    component: 'DrawPanel',
    classStyles: 'iconfont icon-huizhi',
    utilName: '绘制',
    utilActive: false,
    eventSuffix: 'Draw',
    panelID: 'drawPanel'
  },
  {
    component: 'MeasurePanel',
    classStyles: 'iconfont icon-celianggongju',
    utilName: '量算',
    utilActive: false,
    eventSuffix: 'Measure'
  },
  {
    component: 'DrawPanel',
    classStyles: 'iconfont icon-huizhi',
    utilName: '绘制',
    utilActive: false,
    eventSuffix: 'Draw',
    panelID: 'drawPanel'
  },
  {
    component: 'ScreenshotPanel',
    classStyles: 'iconfont icon-jietu',
    utilName: '截图',
    utilActive: false,
    eventSuffix: 'ScreenShot',
    panelID: null
  },
  {
    component: 'LocatePanel',
    classStyles: 'iconfont icon-locate',
    utilName: '定位',
    utilActive: false,
    eventSuffix: 'Locate',
    panelID: 'locatePanel'
  }
])

// 工具列表
const utilList = ref([
  {
    title: '所有工具',
    children: [
      {
        component: 'MeasurePanel',
        classStyles: 'iconfont icon-celianggongju',
        utilName: '量算',
        utilActive: false,
        eventSuffix: 'Measure',
        panelID: null
      },
      {
        component: 'DrawPanel',
        classStyles: 'iconfont icon-huizhi',
        utilName: '绘制',
        utilActive: false,
        eventSuffix: 'Draw',
        panelID: 'drawPanel'
      },
      {
        component: 'ScreenshotPanel',
        classStyles: 'iconfont icon-jietu',
        utilName: '截图',
        utilActive: false,
        eventSuffix: 'ScreenShot',
        panelID: null
      },
      {
        component: 'LocatePanel',
        classStyles: 'iconfont icon-locate',
        utilName: '定位',
        utilActive: false,
        eventSuffix: 'Locate',
        panelID: 'locatePanel'
      }
    ]
  }
])

// 高亮面板
const highlightPanels = ref([])

/**
 * 工具点击事件
 * @param panel 面板对象
 * @param eventSuffix 事件后缀名
 * @param panelID 工具应添加容器的ID
 */
const onClickUtil = (panel, eventSuffix, panelID) => {
  const { component } = panel

  const index = panelList.value.findIndex((e) => e.component === component)

  // 设置面板可见性
  setPanelVisble(panel, index, !panelList.value[index].utilActive)

  handleUtilPanelEvent(panelList.value[index].utilActive, eventSuffix, panelID)
}

// 点击工具箱里的工具
const onClickUtilBoxUtils = ({ panel, eventSuffix, panelID }) => {
  onClickUtil(panel, eventSuffix, panelID)
}

// 设置样式
const setClassStyles = ({ component }) => {
  let classStyles = 'util-list-item'

  const index = highlightPanels.value.findIndex((e) => e.component === component)
  if (index >= 0) {
    classStyles += ' is-active'
  }
  return classStyles
}

/**
 * 设置面板可见性
 * @param panel 面板对象
 * @param index 面板索引
 * @param active 是否激活
 */
const setPanelVisble = (panel, index, active) => {
  panelList.value[index].utilActive = active
  handleHighlightPanels(panel, active)
}

/**
 * 处理高亮面板
 * @param {*} panel 面板对象
 * @param {*} utilActive 面板激活状态
 */
const handleHighlightPanels = (panel, utilActive) => {
  const index = highlightPanels.value.findIndex((e) => e.component === panel.component)

  if (utilActive && index < 0) {
    highlightPanels.value.push(panel)
  } else if (!utilActive && index >= 0) {
    highlightPanels.value.splice(index, 1)
  }
}

/**
 * 处理工具面板展开或者收起
 * @param panel 面板对象
 * @param eventSuffix 事件后缀名
 * @param panelID 工具应添加容器的ID
 */
const handleUtilPanelEvent = (utilActive, eventSuffix, panelID) => {
  if (eventSuffix == 'Draw') {
    nextTick(() => {
      if (utilActive) {
        drawPanel[`onOpen${eventSuffix}`](toRaw(view.value), {
          panelID
        })
      } else {
        drawPanel[`onRemove${eventSuffix}`](toRaw(view.value), {
          panelID
        })
      }
    })
  }
}

// 清屏
const onClearScreen = () => {
  panelList.value.forEach((e) => {
    if (e.utilActive && e.eventSuffix) {
      e.utilActive = false
      // 取消高亮
      handleHighlightPanels(e, false)
    }
  })

  clear.onClearScreen(toRaw(view.value), {
    mapStore
  })
}

// 点击关闭按钮关闭面板
const onClosePanel = ({ panel, index, active, eventSuffix, panelID }) => {
  setPanelVisble(panel, index, active)
  handleUtilPanelEvent(panelList.value[index].utilActive, eventSuffix, panelID)
}

// 暴露方法给父组件调用
defineExpose({ setPanelVisble })
</script>

<style lang="scss" scoped>
.utils-panel {
  position: absolute;
  top: 15px;
  right: 70px;

  &.show-header {
    right: 15px;
  }

  &-wrapper {
    position: relative;
  }
}

.util-list {
  display: flex;

  &-wrapper {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  &-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 10px;
    position: relative;

    &:last-child {
      &::after {
        border-right: none;
      }
    }

    &::after {
      content: '';
      position: absolute;
      right: 0;
      height: 45%;
      border-right: 1px dashed #dbdee2;
    }

    &:hover {
      color: var(--el-color-primary, #168bf2);
    }

    &.is-active {
      color: var(--el-color-primary, #168bf2);
    }

    &.is-disabled {
      cursor: not-allowed;
      color: #c7c7c7;
    }

    &__icon {
      font-size: 18px;
      margin-right: 3px;
    }

    &__name {
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
