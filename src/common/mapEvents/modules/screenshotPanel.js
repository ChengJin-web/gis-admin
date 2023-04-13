/**
 * 打印截图工具相关事件
 */

// 拖动处理程序
let dragHandler = null
// 是否激活截图按钮
let isSelectedScreen = false

// 创建一个将被追加到DOM的图像
// 这样用户就可以预览他们将要下载的内容
function showPreview(screenshot) {
  const screenshotContainer = document.getElementById('screenshotContainer')
  screenshotContainer.classList.remove('hide')

  // 添加截图dataUrl作为图像元素的src
  if (screenshot.data.width > 10 && screenshot.data.height > 10) {
    const screenshotImage = document.getElementsByClassName('screenshot-img')[0]
    screenshotImage.width = screenshot.data.width
    screenshotImage.height = screenshot.data.height
    screenshotImage.src = screenshot.dataUrl
  }
}

// returns a new image created by adding a custom text to the webscene image
function getImageWithText(screenshot, text) {
  const imageData = screenshot.data
  // 为了将文本添加到截图中，我们创建了一个新的canvas元素
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.height = imageData.height
  canvas.width = imageData.width

  // 将截图数据添加到画布中
  context.putImageData(imageData, 0, 0)
  context.font = '20px Arial'
  context.fillStyle = '#333333'
  context.fillRect(0, imageData.height - 42, context.measureText(text).width + 20, 30)

  // 添加textInput元素中的文本
  context.fillStyle = '#fff'
  context.fillText(text, 10, imageData.height - 20)

  return canvas.toDataURL()
}

/**
 * url下载图片
 * @param {string} filename 文件名称
 * @param {string} dataUrl  文件地址
 */
function downloadImage(filename, dataUrl) {
  // 在微软浏览器中处理下载方式不同
  // 因为<a>元素的下载属性不受支持
  if (!window.navigator.msSaveOrOpenBlob) {
    //在支持下载属性的浏览器中
    //一个链接被创建，一个编程点击将触发下载
    const element = document.createElement('a')
    element.setAttribute('href', dataUrl)
    element.setAttribute('download', filename)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  } else {
    //为MS浏览器转换dataUrl为Blob
    const byteString = atob(dataUrl.split(',')[1])
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: mimeString })
    // 下载文件
    window.navigator.msSaveOrOpenBlob(blob, filename)
  }
}

// hide the print preview html element on click / 隐藏打印预览HTML元素单击
function setMaskPosition(area) {
  const maskDiv = document.getElementById('maskDiv')

  if (area) {
    maskDiv.classList.remove('hide')
    maskDiv.style.left = `${area.x}px`
    maskDiv.style.top = `${area.y}px`
    maskDiv.style.width = `${area.width}px`
    maskDiv.style.height = `${area.height}px`
  } else {
    maskDiv.classList.add('hide')
  }
}

function clamp(value, from, to) {
  return value < from ? from : value > to ? to : value
}

export default {
  /**
   * 打开截图面板
   * @param {*} view 视图
   */
  onOpenScreenShot: (view) => {
    console.log('展开截图面板', view)
  },

  /**
   * 取消打印
   * @param {*} view 视图
   * @param {*} data 传递数据
   */
  onRemoveScreenShot: (view, data) => {
    console.log('收起截图面板')

    isSelectedScreen = false
    // view.container.classList.remove('crosshair')

    let body = document.querySelector('body')
    body.style.cursor = 'Auto'

    setMaskPosition(null)

    if (dragHandler) {
      dragHandler.remove()
    }

    if (data.store) {
      const { store } = data
      // 清除截图
      store.dispatch('map/setStartScreenshot', false)
    }
  },
  /**
   * 开启截图工具
   * @param {*} view 视图
   */
  onScreenShot: (view) => {
    let area = null
    if (!isSelectedScreen) {
      console.log('激活截图工具')
      var body = document.querySelector('body')
      body.style.cursor = 'crosshair'
      // view.container.classList.add('crosshair')

      isSelectedScreen = true

      // 监听截图
      dragHandler = view.on('drag', (event) => {
        // prevent navigation in the view / 禁止在视图中导航
        event.stopPropagation()

        // when the user starts dragging or is dragging /当用户开始拖动或正在拖动时
        if (event.action !== 'end') {
          // calculate the extent of the area selected by dragging the cursor
          const xmin = clamp(Math.min(event.origin.x, event.x), 0, view.width)
          const xmax = clamp(Math.max(event.origin.x, event.x), 0, view.width)
          const ymin = clamp(Math.min(event.origin.y, event.y), 0, view.height)
          const ymax = clamp(Math.max(event.origin.y, event.y), 0, view.height)
          area = {
            x: xmin,
            y: ymin,
            width: xmax - xmin,
            height: ymax - ymin
          }
          // set the position of the div element that marks the selected area
          setMaskPosition(area)
        }
        // when the user stops dragging
        else {
          // remove the drag event listener from the SceneView
          dragHandler.remove()
          // the screenshot of the selected area is taken
          view.takeScreenshot({ area: area, format: 'png' }).then((screenshot) => {
            // console.log(screenshot)
            // display a preview of the image
            showPreview(screenshot)

            // create the image for download
            const downloadBtn = document.getElementById('screenshotDownloadBtn')

            downloadBtn.onclick = () => {
              const text = document.getElementById('screenshotInput').value
              // if a text exists, then add it to the image
              if (text) {
                const dataUrl = getImageWithText(screenshot, text)
                downloadImage(`场景截图.png`, dataUrl)
              }
              // otherwise download only the webscene screenshot
              else {
                downloadImage(`场景截图.png`, screenshot.dataUrl)
              }

              // const screenshotContainer = document.getElementById('screenshotContainer')
              // screenshotContainer.classList.add('hide')
            }

            // view.container.classList.remove('crosshair')
            let body = document.querySelector('body')
            body.style.cursor = 'Auto'

            isSelectedScreen = false

            setMaskPosition(null)
          })
        }
      })
    } else {
      // if (screenshotBtn) {
      //   screenshotBtn.classList.remove('is-active')
      // }

      dragHandler.remove()
      setMaskPosition(null)
      // view.container.classList.remove('crosshair')
      // var body = document.querySelector('body')
      let body = document.querySelector('body')
      body.style.cursor = 'Auto'

      isSelectedScreen = false
    }
  }
}
