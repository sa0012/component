<template>
  <div class="upload">
    <ul class="upload-list">
      <li
        class="upload-item"
        v-for="(upload, index) in uploadList"
        :key="index"
        :style="{
          'width': cardWidth + 'px'
        }"
      >
        <i
          v-show="!requiredImageEnum.includes(upload.imageType)"
          @click="deleteImg(upload, index)"
          class="iconfont icon-minus-circle upload-delete"></i>
        <div class="upload-icon">
          <div class="upload-icon-wrap" v-show="!(upload.imageTypeMsg && upload.imgUrl)">
            <i class="iconfont icon-camera"></i>
          </div>
          <div class="upload-icon-desc" v-show="!(upload.imageTypeMsg && upload.imgUrl)">{{ upload.imageTypeMsg }}</div>
          <div
            v-show="upload.imageUrl || upload.imgUrl"
            class="upload-image-wrap">
            <img
              class="upload-image"
              :src="upload.imgUrl || upload.imageUrl" alt="">
            <div class="upload-image-desc">{{ upload.imageTypeMsg }}</div>
          </div>
          <sq-uploader
            @click="handleClick(index)"
            :uploadObj="upload"
            :previewImageList="previewImageList"
            @returnBase64="getFiles"
            @returnUrl="handleReturnUrl"
            class="upload-component" />
          <upload-loading
            :showLoading="upload.showLoading" />
        </div>
      </li>
      <li
        class="upload-item add"
        :style="{
          'width': cardWidth + 'px'
        }"
        @click="addImg"
      >
          <div class="upload-icon">
            <i class="iconfont icon-add-bank-card"></i>
            <div class="upload-icon-desc">上传其他资料</div>
          </div>
        </li>
    </ul>
  </div>
</template>

<script>
import SqUploader from '@/components/uploader'
import UploadLoading from './loading'
import { dataURLtoBlob, px2Rem } from '@/utils'
import { requiredImageEnum } from '@/config'

export default {
  name: 'uploaderCard',

  props: {
    // 添加卡片
    addImg: {
      type: Function,
      default: () => {}
    },

    // 删除卡片
    deleteImg: {
      type: Function,
      default: () => {}
    },

    // 上传到服务
    uploadToServer: {
      type: Function,
      default: () => {}
    },

    // preview filter
    filterPreviewImage: {
      type: Function,
      default: () => {}
    },

    // 上传图片列表
    imageList: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 卡券分类
    productCategory: {
      type: String,
      default: ''
    },

    // 核销码
    writeCode: {
      type: String,
      default: ''
    },

    settlementId: {
      type: String,
      default: ''
    },

    // oss分片上传
    multipartUpload: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    return {
      uploadList: this.imageList,
      currentIndex: 0,
      previewImageList: [],
      requiredImageEnum
    }
  },

  watch: {
    imageList: {
      handler (newVal) {
        this.uploadList = newVal
        this.previewImageList = this.filterPreviewImage(newVal)
        console.log(this.previewImageList, 'previewImageList')
      },
      deep: true,
      immediate: true
    }
  },

  computed: {
    cardWidth () {
      let screenWidth = (document.body || document.documentElement).clientWidth
      return Math.floor((screenWidth - px2Rem(30)) / 2 - px2Rem(8))
    }
  },

  methods: {
    handleClick (index) {
      console.log(index, 'index--')
      this.currentIndex = index
    },

    handleReturnUrl (url) {
      let target = this.uploadList[this.currentIndex]
      target.imgUrl = url
      target.showLoading = true
    },

    getFiles ({ filePath, file, upload }) {
      console.log(filePath, upload)
      let _blob = dataURLtoBlob(file)
      let _this = this
      this.multipartUpload(filePath, _blob, this.currentIndex, upload)
        .then(res => {
          let { ossFilePath, index } = res
          this.uploadList[index].showLoading = false
          this.uploadList[index].imageUrl = ossFilePath
          _this.uploadToServer({
            sort: upload.sort,
            productCategory: this.productCategory,
            writeCode: this.writeCode,
            settlementId: this.settlementId,
            imageUrl: ossFilePath,
            imageGroup: upload.imageGroup,
            imageType: upload.imageType
          })
        })
        .catch(e => {
          this.$toast.text(e.errorMsg || '上传失败')
          let index = e.index || this.currentIndex
          this.uploadList[index].showLoading = false
          this.uploadList[index].imgUrl = ''
          console.log(e, 'e')
        })
    }
  },

  components: {
    SqUploader,
    UploadLoading
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/px2rem.scss';
.upload {
  &-list {
    padding: 0 px2Rem(15px);
    display: flex;
    flex-wrap: wrap;
  }

  &-item {
    position: relative;
    height: px2Rem(94px);
    border: px2Rem(1px) dashed #C8CAC9;
    margin-top: px2Rem(20px);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    &:nth-child(2n + 1) {
      margin-right: px2Rem(8px);
    }

    &:nth-child(2n) {
      margin-left: px2Rem(8px);
    }

    &.add {
      margin-bottom: px2Rem(20px);
    }
  }

  &-delete {
    position: absolute;
    top: px2Rem(-5px);
    right: px2Rem(-5px);
    font-size: px2Rem(20px);
    color: #E03C3C;
    z-index: 333;
  }

  &-icon {
    text-align: center;

    >i.icon-add-bank-card {
      font-size: px2Rem(22px);
      color: #909399;
      margin-bottom: px2Rem(18px);
    }
  }

  .iconfont {
    display: inline-block;
  }

  &-icon-wrap {
    width: px2Rem(38px);
    height: px2Rem(38px);
    border-radius: 50%;
    background: #5373C6;
    text-align: center;
    line-height: px2Rem(38px);
    margin: auto;
    margin-bottom: px2Rem(12px);

    >i.icon-camera {
      font-size: px2Rem(18px);
      color: #fff;
    }
  }

  &-component {
    width: 100%;
  }

  &-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }

  &-image-desc {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    text-align: center;
    padding: 5px 0;
  }
}
</style>
