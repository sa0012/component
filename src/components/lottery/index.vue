<template>
  <div class="lottery-wrap">
    <section class="lottery">
      <div class="lottery-inner-bg">
        <img src="~@/assets/images/spike/bg2.png" alt="">
      </div>
      <div class="lottery-title-wrap">
        <div class="title-bg-1"></div>
        <div class="title-bg-2">
          <div class="decoration-text">您今天还有 {{ remainCount }} 次抽奖机会</div>
        </div>
      </div>
      <section class="lottery-turnt-wrap">
        <turnt-able
          :prizeList="prizeList"
          :lotteryFn="submitLottery"
          class="lottery-turnt" />
        <div class="lottery-turnt-base">
          <div class="lottery-turnt-money"></div>
        </div>
      </section>
      <footer class="lottery-footer"></footer>
    </section>
    <!-- <section class="spike-status" v-else>
      <spike-status :status="lotteryDetails.status" />
    </section> -->
  </div>
</template>

<script>
import Controller from './handle'

export default Controller
</script>

<style lang="scss" scoped>
@import '~@/assets/style/px2rem.scss';
.lottery {
  width: 100%;
  min-height: 100%;

  &-wrap {
    min-height: 100%;
    background-image: url("~@/assets/images/spike/bg1.png");
    background-size: cover;
    position: relative;
  }

  &-inner-bg {
    width: 100%;
    position: absolute;
    top: px2Rem(10px);
    left: 0;
    z-index: 33;

    >img {
      display: block;
      width: 100%;
    }
  }

  &-title-wrap {
    padding-top: px2Rem(40px);
  }

  &-turnt-wrap {
    padding-top: px2Rem(50px);
    text-align: center;
  }

  &-turnt-base {
    width: px2Rem(172px);
    height: px2Rem(204px);
    background-image: url("~@/assets/images/spike/base.png");
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: px2Rem(-160px);
    position: relative;
    z-index: 33;
  }

  &-turnt-money {
    position: absolute;
    bottom: px2Rem(-10px);
    left: px2Rem(-25px);
    width: px2Rem(80px);
    height: px2Rem(75px);
    background-image: url("~@/assets/images/spike/money.png");
    background-size: 100% 100%;
  }

  &-rules-wrap {
    position: relative;
    z-index: 33;
    text-align: center;
    color: #fff;
    padding-top: px2Rem(30px);
  }

  &-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2Rem(170px);
    background-image: url("~@/assets/images/spike/bottom.png");
    background-size: 100% 100%;
  }

  .decoration-text {
    width: 100%;
    position: absolute;
    top: px2Rem(2px);
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: px2Rem(14px);
  }
}

.title {
  &-bg-1 {
    width: px2Rem(280px);
    height: px2Rem(60px);
    background-image: url("~@/assets/images/spike/title.png");
    background-size: 100% 100%;
    margin: 0 auto;
  }

  &-bg-2 {
    width: px2Rem(262px);
    height: px2Rem(32px);
    background-image: url("~@/assets/images/spike/decoration.png");
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: px2Rem(15px);
    text-align: center;
    line-height: px2Rem(30px);
    color: #D2242E;
    position: relative;
    z-index: 44;
  }
}

.rules {
  &-title {
    font-size: 16px;
    text-decoration: underline;
    color: #fff;
  }

  &-msg {
    color: #A68DE1;
    line-height: 1.5em;

    &.address {
      padding-top: px2Rem(15px);
    }
  }
}
</style>
