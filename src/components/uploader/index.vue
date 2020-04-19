<template>
  <div class="uploader">
    <div class="sq-uploader-input-wrap" @click="changeFileStatus">
      <input
        ref="uploader"
        class="sq-uploader-input"
        :id="'uploader-' + uploadObj.sort"
        type="file"
        :accept="accept"
        :multiple="multiple"
        name="file"
        @click="handleClick"
        @change="handleChange"
      >
    </div>
    <div
      class="uploader-mask"
      v-show="disabled"
      @click="previewOrUpload"></div>

    <previewer
      v-if="previewImageList.length > 0"
      :list="previewImageList"
      ref="previewer"
      @on-index-change="logIndexChange" />

    <sq-popup v-model="showSheet" position="bottom">
      <sq-picker
        ref="coveragePickerRef"
        showToolbar
        value-key="value"
        :columns="operationMethod"
        @confirm="confirmHandler"
        @cancel="showSheet = !showSheet"
      />
    </sq-popup>
  </div>
</template>

<script>
import Previewer from '@/components/preview'
const operationMethod = [
  {
    name: 'change',
    value: '更改'
  },
  {
    name: 'preview',
    value: '预览'
  }
]
export default {
  name: 'uploader-component',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    // 图片对象
    uploadObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    previewImageList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    return {
      disabled: false,
      showSheet: false,
      operationMethod
    }
  },

  watch: {
    uploadObj: {
      handler (newVal) {
        if (newVal) {
          this.disabled = !!(newVal.imgUrl || newVal.imageUrl)
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    handleClick () {
      this.$emit('click')
    },

    previewOrUpload () {
      this.showSheet = !this.showSheet
    },

    confirmHandler (select) {
      if (select[0].name === 'change') {
        let oFile = this.$refs.uploader
        if (oFile.value) {
          oFile.value = ''
        }
        // 以原生事件的方式去触发解决IOS不兼容的问题
        const event = new MouseEvent('click')
        if (oFile) oFile.dispatchEvent(event)
      } else {
        let targetIndex = this.previewImageList.findIndex(item => item.sort === this.uploadObj.sort)
        this.showPreview(targetIndex)
      }

      this.showSheet = false
    },

    showPreview (index) {
      this.$refs.previewer.show(index)
    },

    logIndexChange (arg) {
      console.log(arg, 'args')
    },

    changeFileStatus (e) {
      let fileDom = e.target
      console.log(e, 'e')
      this.uploaderDom = fileDom
      if (fileDom.value) {
        fileDom.value = ''
      }
    },

    blobToDataURL (blob, cb) {
      let reader = new FileReader()
      reader.onload = function (evt) {
        var base64 = evt.target.result
        cb(base64)
      }
      reader.readAsDataURL(blob)
    },

    handleChange (e, isMultiple = false) {
      this.disabled = true
      let { files } = e.target
      if (this.isDiabled || !files.length) {
        return
      }

      console.log(files, 'files')

      const urlObj = window.URL || window.webkitURL || window.mozURL
      let img = files[0]
      let url = urlObj.createObjectURL(img)
      let mimeType = files[0].type || 'image/jpeg'
      let imgType = 'jpeg'
      if (mimeType) {
        imgType = mimeType.split('/')[1]
      }
      let fileName = `${+new Date()}.${imgType}`
      console.log(fileName, 'Date')
      if (url) {
        let urlStrArr = url.split(':')
        let targetUrlArr = urlStrArr[urlStrArr.length - 1].split('/')
        let urlStr = targetUrlArr[targetUrlArr.length - 1]
        this.$emit('returnUrl', url)
        fileName = `${urlStr}.${imgType}`
      }
      console.log(fileName, 'fileName')
      this.blobToDataURL(img, (base64Url) => {
        this.compressImage(base64Url, mimeType)
          .then(lastData => {
            this.$emit('returnBase64', {
              filePath: fileName,
              file: lastData,
              upload: this.uploadObj
            })
          })
      })
    },

    /**
     * 压缩图片
     * @param {*} ctx
     * @param {*} path // 图片base64字符
     * @param {*} mimeType // 文件类型
     * @param {*} quality // 图片质量缩放比
     */
    compressImage (path, mimeType, quality = 1) {
      return new Promise((resolve, reject) => {
        let img = new Image()
        img.src = path
        let _this = this
        img.onload = function () {
          // 按压缩比例进行压缩
          let compressObj = _this.calcMaxImageSize(this.width, this.height)
          let width = compressObj.compressWidth
          let height = compressObj.compressHeight
          // 生成canvas
          let canvas = document.createElement('canvas')
          let ctx = canvas.getContext('2d')

          // 创建属性节点
          let attrWidth = document.createAttribute('width')
          let attrHeight = document.createAttribute('height')
          attrWidth.nodeValue = width
          attrHeight.nodeValue = height
          canvas.setAttributeNode(attrWidth)
          canvas.setAttributeNode(attrHeight)

          // 绘制生成图片
          ctx.drawImage(this, 0, 0, width, height)
          // quality默认图片质量为1，值越小，所绘制出的图像越模糊
          // 压缩后的图片base64码
          let imgUrl = canvas.toDataURL(mimeType, quality)
          console.log('压缩后：' + imgUrl.length / 1024 + 'KB')
          resolve(imgUrl)
          return imgUrl
        }
      })
    },

    /**
     * 计算图片缩放后的大小， 限制最大宽高
     * @param {*} ctx
     * @param {*} originWidth
     * @param {*} originHeight
     */
    calcMaxImageSize (originWidth, originHeight) {
      // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
      let maxWidth = 1280
      let maxHeight = 1280
      let compressWidth = originWidth
      let compressHeight = originHeight
      // 图片尺寸超过 (400 * 400) 的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          compressWidth = maxWidth
          compressHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
          compressHeight = maxHeight
          compressWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
      }

      return {
        compressHeight,
        compressWidth
      }
    }
  },

  components: {
    Previewer
  }
}
</script>

<style lang="scss" scoped>
.sq-uploader {
  &-input-wrap {
    width: 100%;
    height: 100%;
    display: block;
    position: relative;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    // background: green;
  }

  &-input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.uploader {
  &-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 334;
  }
}
</style>
