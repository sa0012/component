// dataURLtoBlob
import $, { compare, getDateStr } from '@/utils'
import OSS from 'ali-oss'
// var ossParams = require('./mock/oss.json').result

export default {
  data () {
    return {
      client: {},
      ossFilePath: '',
      bucket: ''
    }
  },

  methods: {
    /**
     * @name 初始化OSS对象
     * @param {*} data // oss配置参数
     */
    initOSS (data) {
      this.client = new OSS({
        region: 'oss-cn-beijing',
        // 云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，创建并使用STS方式来进行API访问
        accessKeyId: data.accessKeyId,
        accessKeySecret: data.accessKeySecret,
        stsToken: data.securityToken,
        bucket: data.bucket,
        endpoint: data.endpoint
      })

      this.ossFilePath = `ecs/export/writeoff/hjwy/${getDateStr()}/`
      this.bucket = data.bucket
    },

    // oss配置
    queryOssToken () {
      const config = {
        writeOrReadFlag: 'RW'
      }
      this.$toast.loading('请求中...', -1)
      $.post(`/h5-api/writeoff/vouchers/settlement/queryOssToken`, config)
        .then(res => {
          this.initOSS(res.result)
        })
        .catch(err => {
          console.log(err)
        })
    },

    /**
     * @name OSS分片上传
     * @param {*} productCategory // 图片分类
     * @param {*} filePath // 上传的图片链接
     * @param {*} file // 图片流
     * @param {*} localIds // 预览图片链接
     * @param {*} item // 点击当前卡片参数对象
     */
    multipartUpload (filePath, file, index, upload) {
      return new Promise((resolve, reject) => {
        if (typeof this.client.multipartUpload !== 'function') {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            errorMsg: '上传失败',
            index
          })
        }
        this.client.multipartUpload(`${this.ossFilePath}${filePath}`, file)
          .then(result => {
            let data = result.res || {}
            let imageArr = data.requestUrls || []
            if (imageArr.length <= 0) return false
            let ossFilePath = `${this.ossFilePath}${filePath}`
            let resObj = {
              ossFilePath,
              upload,
              index
            }
            resolve(resObj)
          })
          .catch(err => {
            reject(err)
            this.$toast.hide()
            this.$toast.text('上传失败！')
          })
      })
    },

    /**
     * @name 对图片对象按照sort进行排序
     * @param {string} list // 需要排序的数组
     */
    imageSort (list = []) {
      if (list.length <= 0) return []
      return list.sort(compare('sort'))
    },

    /**
     * sort排序， 查询list中存在的最大的sort
     * list中存在的最大的sort
     * +1即为当前卡片的sort
     * @name 查询当前resource对象中的最大sort
     * @param {*} list // 图片list
     */
    findMaxSort (list = []) {
      let sortMap = (list || []).map(item => item.sort)
      let maxSort = Math.max(...sortMap)
      console.log(sortMap, maxSort, 'total')
      return maxSort
    },

    /**
     * @name 数据提交到后台
     * @param {*} sort 排序号
     * @param {*} productCategory 分类
     * @param {*} imageGroup 分组
     * @param {*} imageType 类型
     * @param {*} imageUrl 图片链接
     * @param {*} vouchersNo 卡券号
     * @param {*} writeCode 核销码
     */
    uploadToServer ({
      sort, productCategory, imageUrl, imageGroup,
      imageType, writeCode, settlementId
    }) {
      let config = {
        writeCode,
        settlementId,
        imageUrl,
        imageGroup,
        imageType,
        productCategory,
        sort
      }
      this.$toast.loading('请求中...', -1)
      $.post('/h5-api/writeoff/vouchers/settlement/writeOffAndSaveResource', config)
        .then(res => {
          console.log(res.result)
        })
        .catch(err => console.log(err))
    },

    filterPreviewImage (list) {
      let filterList = list.filter(item => item.imgUrl || item.imageUrl) || []
      if (filterList.length <= 0) return []
      let newList = []
      // eslint-disable-next-line no-unused-vars
      filterList.forEach((item, index) => {
        newList.push({
          src: item.imgUrl || item.imageUrl,
          sort: item.sort
        })
      })

      return newList
    }
  },

  created () {
    this.queryOssToken()
    // this.initOSS(ossParams)
  }
}
