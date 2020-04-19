import $ from '@/utils'
export default {
  methods: {
    formDate (datetime) {
      let formDate = $.formatDate(datetime, 'yyyy-MM-dd')
      if (formDate === '9999-12-31') return true
    }
  }
}
