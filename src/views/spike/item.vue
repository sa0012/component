<template>
  <div class="prod">
    <ul class="prod-list" v-if="sessionProductList.length > 0">
      <li class="prod-item" v-for="(prd, pIndex) in sessionProductList" :key="pIndex">
        <div class="prod-banner">
          <img :src="prd.fullProductLogoUrl" alt="" class="prod-banner-icon">
        </div>
        <div class="prod-content">
          <div class="content-top">
            <div class="ct-status-wrap">
              <div class="ct-status">{{ deliveryStatus[prd.deliveryMethod] }}</div>
            </div>
            <div class="ct-title">{{ prd.productName }}</div>
          </div>
          <div class="content-bottom">
            <div class="cb-price">
              <span class="cb-price-char">￥</span>
              <span class="cb-price-num">{{ prd.seckillPrice }}</span>
              <del class="cb-price-del">￥{{ prd.marketPrice }}</del>
            </div>
            <button
              class="cb-btn"
              :disabled="currentSession.status !== 'S_102'"
              :class="{
                'disabled': currentSession.status === 'S_103',
                'nostart': currentSession.status === 'S_101'
              }"
              @click="toDetail(prd.productNo, currentSelect)"
            >
              {{ sessionStatus[currentSession.status] }}
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { sessionStatus, deliveryStatus } from './config'
// import MockData from './data/spikeDetail.json'
export default {
  name: 'prodItem',
  props: {
    currentSelect: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: Number | String,
      default: 0
    },
    currentSession: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      sessionStatus,
      deliveryStatus,
      sessionProductList: []
    }
  },

  watch: {
    currentSession: {
      handler (newVal) {
        this.sessionProductList = newVal.sessionProductList || []
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    toDetail (productNo, productIndex) {
      this.$router.push({
        path: '/spike/detail',
        query: {
          productNo,
          productIndex
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.prod {
  &-list {
    padding: 15px 10px;
    padding-top: 0;
  }

  &-item {
    padding: 15px;
    border-radius: 10px;
    box-sizing: border-box;
    background-color: #fff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  &-banner {
    margin-right: 24px;
  }

  &-banner-icon {
    width: 90px;
  }

  &-content {
    flex: 1;
  }
}

.content {
  &-top {
    margin-bottom: 18px;
  }

  &-top,
  &-bottom {
    text-align: left;
    display: flex;
  }

  &-bottom {
    align-items: center;
  }
}

.ct {
  &-status {
    padding: 6px;
    border-radius: 2px;
    background-color: #E6A23C;
    color: #fff;
    font-size: 12px;
    margin-right: 10px;
  }

  &-title {
    color: #000;
    font-weight: bold;
    flex: 1;
    margin-top: 4px;
    font-size: 16px;
  }
}

.cb {
  &-price {
    flex: 1;
  }

  &-btn {
    padding: 5px 8px;
    color: #fff;
    letter-spacing: 2px;
    background-color: #5373C6;
    border-radius: 2px;
    -webkit-appearance: none;
    outline: none;
    border: none;

    &.disabled {
      background-color: #bbb;
    }

    &.nostart {
      opacity: 0.5;
    }
  }
}

.cb-price {
  color: #F56C6C;
  font-weight: bold;

  &-num {
    font-size: 20px;
    margin-right: 6px;
  }

  &-del {
    color: #C0C4CC;
  }
}
</style>
