import $ from '@/utils'
// import config from '@/config'
import UploadCard from './card'
import uploadMixin from '@/mixins/upload'

export default {
  name: 'upload-demo',
  data () {
    return {
      insured: {
        lossDate: '',
        lossPrice: '',
        accountName: '',
        accountNo: '',
        accountBankCode: '',
        subBranch: '',
        settlementId: '',
        writeCode: '',
        productCategory: 'SGM_HJWY'
      },
      showSheet: false,
      imageList: []
    }
  },

  mixins: [uploadMixin],

  methods: {
    defaultImageGroup () {
      let defaultImageEnum = [
        {
          imageTypeMsg: '维修工单',
          imageGroup: 'WRITEOFF_IMAGE',
          imageType: 'REPAIR_LIST',
          imageGroupMsg: '单证资料'
        },
        {
          imageTypeMsg: '交通发票',
          imageGroup: 'DOCUMENT',
          imageType: 'TRAFFIC_EXPENSE_INVOICE',
          imageGroupMsg: '单证资料'
        }
      ]
      return defaultImageEnum.map((item, index) => {
        return this.newImageGroup({
          sort: index + 1,
          ...item
        })
      })
    },

    confirmHandler (item) {
      this.showSheet = !this.showSheet
      let accountBankCode = item[0].name
      if (accountBankCode === 'OTHER') {
        this.showBankInput = !this.showBankInput
        return
      }
      this.insured.accountBankCode = item[0].name
    },

    newImageGroup ({
      sort, showLoading = false,
      imageUrl = '', imgUrl = '', imageTypeMsg = '其他',
      imageGroup = 'OTHERS', imageType = 'OTHERS', imageGroupMsg = '其他'
    }) {
      return ({
        sort,
        showLoading,
        imageUrl,
        imgUrl,
        imageTypeMsg,
        imageGroup,
        imageType,
        imageGroupMsg
      })
    },

    addImg () {
      let maxSort = this.findMaxSort(this.imageList)
      this.imageList.push(this.newImageGroup({ sort: maxSort + 1 }))
    },

    deleteImg (item, index) {
      if (!item.imageUrl) {
        console.log(item, 'item')
        this.imageList.splice(index, 1)
      } else {
        const config = {
          sort: item.sort
        }
        $.post('xxxxxxxxx', config)
          .then(res => {
            if (res.result === 'SUCCESS') {
              this.imageList.splice(index, 1)
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    },

    validateUploadImage (imageList = []) {
      let imgUrlList = imageList.filter(item => (item.imgUrl || item.imageUrl))
      if (imgUrlList.length <= 0) {
        // return this.$toast.text(`维修工单，交通发票为必传图片，请您前去上传`)
      }
      let required = this.defaultImageGroup()
      let count = 0
      required.forEach((item, index) => {
        if (!(imageList[index].imageGroup === item.imageGroup &&
          imageList[index].imageType === item.imageType &&
          (imageList[index].imgUrl || imageList[index].imageUrl))) {
          // return this.$toast.text(`${imageList[index].imageTypeMsg}
          // 为必传图片，请您前去上传`)
        } else {
          count++
        }
      })

      if (count === required.length) return true
    },

    getInsuredInfo (insuredInfo = {}) {
      for (let k in insuredInfo) {
        if (k !== 'productCategory') {
          this.insured[k] = insuredInfo[k]
        }
      }
    },

    getImageList (resources = []) {
      if (resources.length <= 0) {
        return this.defaultImageGroup()
      }
      // eslint-disable-next-line no-unused-vars
      resources.forEach((item = {}, index) => {
        this.$set(resources[index], 'showLoading', false)
      })
      return resources
    }
  },

  created () {
    this.imageList = this.getImageList([])
  },

  components: {
    UploadCard
  }
}
