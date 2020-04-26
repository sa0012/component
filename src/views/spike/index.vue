<template>
  <div
    class="spike"
    :style="{
      'background-color': details.rgb
    }">
    <section class="spike-wrap">
      <section class="spike-banner-wrap">
        <div class="spike-banner-btn-wrap">
          <div
            class="banner-btn rules-btn"
          >
            <div>活动</div>
            <div>规则</div>
          </div>
          <div
            class="banner-btn"
          >
            <div>联系</div>
            <div>商家</div>
          </div>
        </div>
        <img src="http://img1.gtimg.com/autoshijiazhuang/pics/hv1/156/10/111/7220481.png" alt="" class="spike-banner">
      </section>
      <section class="spike-timer-status" v-if="activitySessionList.length > 0">
        <div class="timer-date">
          <div class="timer-date-month">
            {{ currentDate.currentMonth }}月
          </div>
          <div class="timer-date-date">
            {{ currentDate.currentDay }}日
          </div>
        </div>
        <div
          ref="tabDOM"
          class="timer-hour-wrap">
          <div
            class="timer-hour-inner"
          >
            <div
              class="timer-hour"
              ref="timer"
              @click="changeTab(index)"
              v-for="(item, index) in activitySessionList"
              :key="index"
            >
              <div
                class="timer-hour-num"
                :class="{
                  'select': currentSelect === index
                }"
              >
                {{ splitTime(item.startTime) }}
              </div>
              <div class="timer-hour-status">
                <div
                  class="status-btn"
                  :class="{
                    'select': currentSelect === index
                  }"
                >{{ sessionStatus[item.status] }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        class="spike-list"
        v-if="activitySessionList.length > 0">
        <div
          v-for="(session, sIndex) in activitySessionList"
          :key="sIndex"
          class="spike-list-wrap">
          <div
            v-show="sIndex === currentSelect"
            class="spike-line-wrap">
            <div class="spike-line-desc-wrap">
              {{ toastEnum[session.status] }}
              <count-down
                v-show="session.status !== 'S_103'"
                class="spike-count-down"
                :currentSelect="sIndex"
                @currentIndex="currentIndexHandler"
                :timestamp="session.duration" />
            </div>
          </div>
          <card-list
            v-show="sIndex === currentSelect"
            :currentSelect="sIndex"
            :currentSession="currentSession"
          />
        </div>
      </section>
    </section>
    <bg-loading :showPage="showPage" />
  </div>
</template>

<script>
import Controller from './handle'
export default Controller
</script>

<style lang="scss" scoped>
@import '~@/assets/style/px2rem.scss';
$theme_color: #5373C6;
.spike {
  width: 100%;
  min-height: 100%;

  &-banner-wrap {
    position: relative;
  }

  &-banner-btn-wrap {
    position: absolute;
    top: px2Rem(10px);
    right: px2Rem(10px);
  }

  &-banner {
    width: 100%;
  }

  &-timer-status {
    padding: 10px 5px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    position: relative;
  }

  &-line-desc,
  &-count-down {
    display: inline-block;
    vertical-align: middle;
  }

  &-line-desc {
    margin-right: 5px;
  }

  &-line-wrap {
    text-align: center;
    padding: 0 10px;
    padding-top: 10px;
    color: #ccc;
    display: flex;
    align-items: center;
    font-size: 12px;

    /deep/ .countdownHolder {
      font: 12px/1.4 'Open Sans Condensed', sans-serif;
    }

    /deep/ .position {
      padding: 0 2px;
    }

    /deep/ .countDiv {
      width: 8px;
      height: 1.5em;
    }

    /deep/ .countDiv::before,
    /deep/ .countDiv::after {
      width: 2px;
      height: 2px;
      margin-left: -1px;
    }

    &::before,
    &::after {
      content: '';
      display: inline-block;
      flex: 1;
      height: 1px;
      background: #ccc;
    }

    &::before {
      margin-right: 5px;
    }

    &::after {
      margin-left: 5px;
    }
  }
}

.timer-date {
  padding: 8px 6px;
  box-sizing: border-box;
  font-weight: bold;
  color: #fff;
  background-color: $theme_color;
  border-radius: 4px;
  font-size: px2Rem(15px);
  letter-spacing: 1px;
  max-width: 70px;
  margin-right: 26px;
  position: absolute;
  top: 50%;
  left: 5px;
  transform: translateY(-50%);

  &-month {
    padding-bottom: 6px;
  }
}

.timer-hour {
  display: inline-block;
  margin-right: 48px;
  text-align: center;

  &:last-child {
    margin-right: 10px;
  }

  &:first-child {
    margin-left: 10px;
  }

  &-wrap {
    box-shadow: 5px 0px 5px -5px rgba(0, 0, 0, 0.3), -5px 0px 5px -5px rgba(0, 0, 0, 0.3);
    margin-left: px2Rem(66px);
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &-inner {
    white-space: nowrap;
  }

  &-num {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    padding-bottom: 6px;

    &.select {
      color: $theme_color;
    }
  }

  &-status {
    color: #666;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
}

.status-btn {
  display: inline-block;
  &.select {
    color: #fff;
    background-color: $theme_color;
    border-radius: 20px;
    padding: 0 8px;
  }
}

.banner-btn {
  width: px2Rem(40px);
  height: px2Rem(40px);
  text-align: center;
  background-color: rgba(98, 17, 215, 0.5);
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  letter-spacing: 1px;
  line-height: 1.1em;
  font-size: 12px;
  font-family: monospace;

  &.rules-btn {
    margin-bottom: px2Rem(10px);
  }
}
</style>

<style>
.page-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.page-leave-to {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.page-enter-active,
.page-leave-active {
  transition: all 5s ease;
}
</style>
