<template>
  <div class="detail">
    <section class="detail-banner">
      <img :src="prodDetails.fullProductLogoUrl" alt="" class="detail-banner-img">
    </section>
    <section class="detail-status">
      <div class="detail-status-price">
        <div class="cb-price">
          <span class="cb-price-char">￥</span>
          <span class="cb-price-num">{{ prodDetails.seckillPrice }}</span>
          <del class="cb-price-del">￥{{ prodDetails.marketPrice }}</del>
        </div>
        <div class="price-status">
          <i class="iconfont icon-aclock price-status-clock"></i>
          <div class="price-status-text">限时抢购中</div>
        </div>
      </div>
      <div class="detail-status-timer">
        <div class="timer-title">距离结束还剩</div>
        <count-down :countTime.sync="countTime" />
      </div>
    </section>
    <section class="detail-name-wrap">
      <h2 class="prod-name">{{ prodDetails.productName }}</h2>
      <div class="prod-status">{{ deliveryStatus[prodDetails.deliveryMethod] }}</div>
    </section>
    <section class="buy-wrap">
      <div class="buy-title">购买数量</div>
      <span class="count-num">{{ number }}</span>
      <!-- <div class="buy-count">
        <span
          class="count-reduce count-inline"
          :class="{
            'isDisabled': number === 1
          }"
          @click="handleReduce">-</span>
        <span class="count-num">{{ number }}</span>
        <span
          class="count-add count-inline"
          :class="{
            'isDisabled': number === maxNum
          }"
          @click="handleAdd">+</span>
      </div> -->
    </section>
    <section class="store-wrap">
      <div class="store-name">门店信息</div>
      <div class="store-address">{{ prodList.dealerName }}</div>
    </section>

    <section class="submit-wrap">
      <div class="submit-price">
        <span class="sp-total">总价</span>
        <span class="sp-char">￥</span>
        <span class="sp-num">{{ total }}</span>
      </div>
      <button
        :disabled="isDisabled"
        class="submit-btn"
        :class="{
          'disabled': isDisabled
        }"
        @click="submit">提交订单</button>
    </section>
  </div>
</template>

<script>
import Controller from './handle'
export default Controller
</script>

<style lang="scss" scoped>
$theme_color: #5373C6;
.detail {
  &-banner-img {
    width: 100%;
  }

  &-status {
    display: flex;
    align-items: center;
    background: #ECF1FF;
  }

  &-name-wrap {
    padding-left: 15px;
    padding-top: 25px;
    padding-bottom: 20px;
    background-color: #fff;
    margin-bottom: 10px;
  }
}

.detail-status {
  &-price {
    flex: 1;
    background-color: $theme_color;
    padding: 12px 0 8px 15px;
    color: #fff;
  }

  &-timer {
    padding: 0 14px;
    color: $theme_color;
    text-align: center;
  }
}

.price-status {
  display: inline-block;
  background: #fff;
  display: inline-block;
  border-radius: 30px;
  border: 2px solid #fff;

  &-clock,
  &-text {
    display: inline-block;
    vertical-align: middle;
  }

  &-clock {
    font-size: 20px;
    color: $theme_color;
    margin-left: 8px;
    margin-right: 4px;
    font-weight: bold;
    margin-top: 2px;
  }

  &-text {
    background: $theme_color;
    padding: 5px;
    border-radius: 0 10px 10px 0;
  }
}

.timer-title {
  margin-bottom: 10px;
}

.cb-price {
  color: #fff;
  font-weight: bold;
  margin-bottom: 10px;

  &-num {
    font-size: 20px;
    margin-right: 6px;
  }

  &-del {
    color: #C0C4CC;
  }
}

.prod {
  &-name {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    padding-bottom: 15px;
  }

  &-status {
    background-color: #E6A23C;
    display: inline-block;
    color: #fff;
    padding: 5px 8px;
    border-radius: 2px;
    font-size: 16px;
  }
}

.buy-wrap {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  padding: 15px 10px;
}

.buy {
  &-title {
    flex: 1;
  }

  &-count {
    display: flex;
    justify-content: center;
    border-radius: 2px;
    border: 1px solid #ddd;
  }
}

.count {
  &-inline {
    display: inline-block;
    vertical-align: middle;
    width: 28px;
    height: 28px;
    background-color: #F4F4F4;
    text-align: center;
    line-height: 28px;
    font-size: 18px;
    color: $theme_color;
    &.isDisabled {
      color: #ccc;
    }
  }

  &-num {
    width: 55px;
    line-height: 28px;
    color: $theme_color;
    background-color: #fff;
    text-align: center;
  }
}

.store {
  &-wrap {
    background-color: #fff;
    margin-bottom: 70px;
  }

  &-name,
  &-address {
    color: #000;
  }

  &-name {
    font-size: 18px;
    font-weight: bold;
    padding: 15px 0;
    padding-left: 15px;
    border-bottom: 1px solid #E5E5E5;
  }

  &-address {
    padding: 18px 0;
    padding-left: 15px;
  }
}

.submit {
  &-wrap {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 8px 15px 12px 15px;
    background: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  &-price {
    flex: 1;
  }

  &-btn {
    -webkit-appearance: none;
    border: none;
    background-color: $theme_color;
    border-radius: 30px;
    color: #fff;
    padding: 14px 30px;
    letter-spacing: 1px;

    &.disabled {
      background-color: #666;
    }
  }
}

.sp {
  &-char,
  &-num {
    color: #F56C6C;
    display: inline-block;
    vertical-align: bottom;
  }

  &-total {
    display: inline-block;
    vertical-align: bottom;
    margin-right: 8px;
  }

  &-char {
    font-size: 12px;
  }

  &-num {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
