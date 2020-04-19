<template>
  <div class="dialog" v-show="visible">
    <div
      v-show="visible"
      @click="handleCancel"
      class="dialog-mask"></div>
    <transition name="spike">
      <div class="dialog-wrap" v-show="visible">
        <section class="dialog-title-wrap">
          <img
            v-if="iconType"
            class="dialog-title-icon"
            :src="iconEmun[iconType]"
          />
          <div
            v-if="title"
            class="dialog-title">{{ title }}</div>
        </section>
        <section class="dialog-content-wrap">
          <div class="dialog-content" v-html="message"></div>
          <slot name="content"></slot>
        </section>
        <section class="dialog-btn-wrap">
          <div
            class="dialog-btn-confirm dialog-btn"
            @click="handleCancel"
            v-if="type === 'confirm'"
          >{{ cancelBtnText }}</div>
          <div
            class="dialog-btn-close dialog-btn"
            @click="handleConfirm"
          >{{ confirmBtnText }}</div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
import success from '@/assets/images/success.png'
import fail from '@/assets/images/fail.png'
import warn from '@/assets/images/warning.png'
export default {
  name: 'spikeDialog',
  props: {
    iconType: {
      type: String,
      default: ''
    },
    closeMark: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '系统提示'
    },
    message: {
      type: String,
      default: ''
    },
    confirmFn: {
      type: Function,
      default: () => {}
    },
    cancel: {
      type: Function,
      default: () => {}
    },
    isShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'alert'
    },
    confirmBtnText: {
      type: String,
      default: '确认'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      visible: this.isShow,
      iconEmun: {
        success,
        fail,
        warn
      }
    }
  },

  watch: {
    isShow (newVal) {
      this.visible = newVal
    },
    visible (newVal) {
      this.$emit('update:isShow', newVal)
    }
  },

  methods: {
    cancelFn () {
      this.visible = false
      this.$emit('update:isShow', this.visible)
    },
    handleCancelMask () {
      if (this.closeMark) {
        this.cancelFn()
      }
    },
    handleCancel () {
      this.cancelFn()
    },
    handleConfirm () {
      this.confirmFn && this.confirmFn()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;

  &-mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-title {
    height: 40px;
    line-height: 1.4;
    width: 100%;
    padding-top: 14px;
    box-sizing: border-box;
    text-align: center;
  }

  &-title-icon {
    margin-top: 20px;
    width: 80px;
  }

  &-content {
    padding: 20px;
    padding-top: 10px;
    width: 100%;
    box-sizing: border-box;
    line-height: 1.4;
  }
  &-wrap {
    background: #fff;
    width: 80%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 999;
    text-align: center;
    border-radius: 4px;
    animation: fadeInDown 1s ease;
  }

  &-btn-wrap {
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 18px;
    align-items: center;
    border-top: 1px solid #e5e5e5;
    justify-content: center;
  }

  &-btn {
    flex: 1;
    padding: 12px 0;
    color: #4A90E2;
    text-align: center;
  }

  &-btn-close {
    border-right: 1px solid #e5e5e5;
  }
}
</style>

<style>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(-50%, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(-50%, -50%, 0);
  }
}
</style>
