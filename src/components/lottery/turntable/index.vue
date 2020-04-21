<template>
  <div class="lottery">
    <div class="lottery-outer-container">
      <canvas id="lottery-outer" :width="320 * px2Rem" :height="320 * px2Rem"></canvas>
      <canvas id="lottery-dot" :width="320 * px2Rem" :height="320 * px2Rem"></canvas>
      <div class="lottery-container" ref="roulette">
        <canvas class="lottery-canvas" id="lottery" :width="300 * px2Rem" :height="300 * px2Rem"></canvas>

        <ul class="lottery-list">
          <li class="lottery-item" v-for="(item, index) in prizeList" :key="index">
            <div
              class="lottery-rotate"
              :style="{
                'transform': `rotate(${index * turnNum}turn)`
              }"
            >
              <span class="lottery-text">{{ item.prizeName }}</span>
              <img class="lottery-img" :src="item.fullPrizePicture" alt="">
            </div>
          </li>
        </ul>
      </div>

      <div class="lottery-run-wrap" ref="pointer">
        <div class="arrow">
          <div
            :class="{
              'disabled': disabled
            }"
            class="arrow-left"></div>
          <div
            :class="{
              'disabled': disabled
            }"
            class="arrow-right"></div>
        </div>
        <div
          :class="{
            'disabled': disabled
          }"
          class="lottery-run"></div>
      </div>

      <button
        :disabled="disabled"
        :class="{
          'disabled': disabled
        }"
        class="lottery-btn"
        @click="startLoottery"
      >
        <div class="lottery-btn-text">点击</div>
        <div class="lottery-btn-text">抽奖</div>
      </button>
    </div>
  </div>
</template>

<script>
import Controller from './handle'

export default Controller
</script>

<style lang="scss">
@import '../../../assets/style/px2rem.scss';
.lottery {
  width: 100%;
  overflow: hidden;

  &-outer-container {
    background: #fff;
    position: relative;
    width: px2Rem(320px);
    height: px2Rem(320px);
    border-radius: 50%;
    margin: 0 auto;
    z-index: 44;
  }

  &-container {
    width: px2Rem(300px);
    height: px2Rem(300px);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    transition: transform 6s ease;
  }

  &-canvas {
    width: inherit;
    height: inherit;
    border-radius: 50%;
  }

  &-list {
    position: absolute;
    left: 0;
    top: 0;
    width: inherit;
    height: inherit;
    z-index: 2;
  }

  &-item {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #FD683D;
    font-weight: bold;
  }

  &-rotate {
    position: relative;
    display: block;
    padding-top: px2Rem(44px);
    font-size: px2Rem(12px);
    font-weight: bold;
    margin: 0 auto;
    text-align: center;
    transform-origin: 50% px2Rem(160px);
  }

  &-text {
    display: block;
  }

  &-img {
    transform: scale(0.6);
    margin-top: px2Rem(-2px);
    max-width: px2Rem(60px);
  }

  &-run-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    border-radius: 50%;
  }

  &-run {
    width: px2Rem(80px);
    height: px2Rem(80px);
    border-radius: 50%;
    background-color: #FF8228;
    text-align: center;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;

    &.disabled {
      background: #666;
    }
  }

  &-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: px2Rem(60px);
    height: px2Rem(60px);
    background: #FFEE80;
    border-radius: 50%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 0;
    z-index: 44;
    color: #FF663F;
    font-size: 16px;
    border: none;
    outline: none;
    -webkit-appearance: none;

    &.disabled {
      pointer-events: none;
      background: #ccc;
      color: #fff;
    }

    &.disabled::after {
      border-bottom-color: #B07A7B;
    }
  }

  &-btn-text {
    font-size: 16px;
    display: inline-block;
    vertical-align: middle;
    line-height: 1.2em;
    letter-spacing: 1px;
  }
}

.arrow {
  position: absolute;
  left: 50%;
  top: px2Rem(-14px);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  &-left {
    width: 0;
    height: 0;
    display: inline-block;
    vertical-align: middle;
  }

  &-left {
    border-bottom: px2Rem(40px) solid #FFAC05;
    border-left: px2Rem(28px) solid transparent;

    &.disabled {
     border-bottom: 2.85714rem solid #ccc;
    }
  }

  &-right {
    border-bottom: px2Rem(40px) solid #FF6F24;
    border-right: px2Rem(28px) solid transparent;

    &.disabled {
      border-bottom: px2Rem(40px) solid #666;
    }
  }
}

#lottery-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

@media screen and (max-width: 320px) {
  .lotter {
    &-btn-text {
      font-size: 14px;
    }
  }
}
</style>
