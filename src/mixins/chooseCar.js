import $ from '@/utils'

export default {
  data () {
    return {
      // 品牌车型
      isShowChooseCar: false,
      carsData: {},
      searchCarArr: [],
      selectCar: [],
      selectModel: [],
      brandCategoryCode: '',
      code: '',
      loadMoreArr: [],
      // modelName: '',
      // modelCode: '',
      searchLoadMoreArr: [],
      page: 0,
      searchPage: 0,
      option: '',
      familyId: '',
      brandId: ''
    }
  },

  methods: {
    // 品牌车型 start
    chooseCar () {
      this.page = 0
      this.searchPage = 0
      this.option = ''
      this.familyId = ''
      this.brandId = ''
      this.isShowChooseCar = !this.isShowChooseCar
      $.setDocTitle('选择品牌')
    },
    getBrandFamilieByCode (code) {
      this.$toast.loading('请求中...', -1)
      $.post('/h5-api/saicec/vwStaff/brandFamilies', {
        brandCategoryCode: code,
        orderSource: $.getQueryString('orderSource')
      })
        .then(res => {
          this.selectCar = res.result
          $.setDocTitle('选择车系')
        })
        .catch(error => {
          console.log(error)
        })
    },
    getModelById (brandId, familyId) {
      this.brandId = brandId
      this.familyId = familyId
      $.post('/h5-api/saicec/vwStaff/models', {
        page: 0,
        size: 10,
        brandId: brandId,
        familyId: familyId
      })
        .then(res => {
          this.selectModel = res.result.content
          $.setDocTitle('选择车型')
          this.page = res.result.pageNumber + 1
        })
        .catch(error => {
          console.log(error)
        })
    },
    getBrandCategoryCode (code) {
      this.brandCategoryCode = code
      this.getBrandFamilieByCode(code)
    },
    getBrandModelId ({ brandId, familyId }) {
      this.getModelById(brandId, familyId)
    },
    getLoadMore (callback) {
      $.post('/h5-api/policy/auto/data/models', {
        page: this.page,
        size: 10,
        brandId: this.brandId,
        familyId: this.familyId
      })
        .then(res => {
          callback(res.result.content)
          this.page = res.result.pageNumber + 1
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSearchLoadMore (callback) {
      this.$toast.loading('请求中...', -1)
      $.post('/h5-api/saicec/vwStaff/model-search', {
        page: this.searchPage,
        size: 10,
        model: this.option
      })
        .then(res => {
          callback(res.result.content)
          this.searchPage = res.result.pageNumber + 1
        })
        .catch(error => {
          console.log(error)
        })
    },
    getCarDetail (detail) {
      this.vehicle.modelName = detail.modelName
      this.vehicle.modelCode = detail.modelCode
      $.setDocTitle('车险报价')
      // this.getVehiclePrice(detail.modelCode)
    },
    searchCar (option, callback) {
      this.option = option
      this.$toast.loading('请求中...', -1)
      $.post('/h5-api/saicec/vwStaff/model-search', {
        page: this.searchPage,
        size: 10,
        model: option
      })
        .then(res => {
          callback(res.result.content)
          this.searchPage = res.result.pageNumber + 1
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSearchOption (option, callback) {
      this.searchCar(option, callback)
    },
    async getChooseCarData () {
      const response = await $.post('/h5-api/saicec/vwStaff/brandCategorys/' + $.getQueryString('orderSource'), {}, {
        isShowErrorTip: false
      })
        .catch(err => console.log(err))

      if (response && response.result) {
        this.carsData = response.result
      }
    }
    // 品牌车型 end
  },

  created () {
    if ($.getQueryString('orderSource') !== 'SGMW') {
      this.getChooseCarData()
    }
  }
}
