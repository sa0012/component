// 活动状态：NOT_START(未开始)、ONGOING(进行中)、SUSPEND(暂停)、END(已结束)
// 场次状态：S_101(即将开始)、S_102(抢购中)、S_103(已结束)
// 产品状态：S_101(即将开始)、S_102(抢购中)、S_103(已结束)
export default function () {
  return {
    activityCode: '', // 活动代码,
    activityName: '', // 活动名称,
    dealerCode: '', // 经销商代码,
    dealerName: '', // 经销商名称,
    status: '', // 活动状态,
    startDate: '', // 活动开始时间,
    endDate: '', // 活动结束时间,
    rgb: '', // 背景颜色,
    activityPhone: '', // 活动电话,
    activityAddress: '', // 活动地址,
    activityDesc: '', // 活动说明,
    fullBannerUrl: '', // 活动背景地址,
    currentTimeMillis: '', // 当前日期毫秒,
    // 活动场次
    activitySessionList: [
      {
        startTime: '', // 开始时间,
        endTime: '', // 结束时间,
        sessionCode: '', // 场次编号,
        sessionName: '', // 场次名称,
        status: '', // 场次状态,
        // 场次商品
        sessionProductList: [
          // {
          //   productNo: '', // 商品编号,
          //   dealerCode: '', // 经销商代码,
          //   dealerName: '', // 经销商名称,
          //   productName: '', // 商品名称,
          //   marketPrice: '', // 原价,
          //   seckillPrice: '', // 秒杀价,
          //   remainingInventory: '', // 剩余库存,
          //   status: '', // 产品状态,
          //   fullProductLogoUrl: '', // 产品图片全url,
          //   deliveryMethod: '' // 配送方式
          // }
        ]
      }
    ]
  }
}
