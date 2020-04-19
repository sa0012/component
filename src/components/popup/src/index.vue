<template>
  <div class="sq-popup">
    <transition name="ry-fade">
      <div class="sq-popup-mask" v-show="value && !hideMask"  @click="$_cancel"></div>
    </transition>
    <transition :name="transitionSlideType">
      <div
        class="sq-popup-content"
        v-show="value"
        :class="positionClass"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
const objTransitionSlideType = {
  bottom: 'ry-slide-bottom',
  left: 'ry-slide-left',
  top: 'ry-slide-top',
  right: 'ry-slide-right',
  center: 'ry-fade'
}

export default {
  name: 'sq-popup',

  props: {
    position: {
      type: String,
      default: 'center'
    },
    value: {
      type: Boolean,
      required: true
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true
    },
    hideMask: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    positionClass () {
      return [ `sq-popup-${this.position}` ]
    },
    transitionSlideType () {
      return objTransitionSlideType[this.position]
    }
  },

  methods: {
    $_cancel () {
      if (!this.closeOnClickOverlay) return
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
/*依赖 base 里的动画 */
$prefixCls: sq-popup;

.#{$prefixCls} {
  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .5);
    z-index: 1010;
  }
  &-content {
    position: fixed;
    background-color: #fff;
    z-index: 1011;
    &.#{$prefixCls}-top {
      left: 0;
      right: 0;
      top: 0;
    }
    &.#{$prefixCls}-bottom {
      left: 0;
      right: 0;
      bottom: 0;
    }
    &.#{$prefixCls}-left {
      top: 0;
      left: 0;
      width: 60%;
      bottom: 0;
    }
    &.#{$prefixCls}-right {
      top: 0;
      right: 0;
      width: 60%;
      bottom: 0;
    }
    &.#{$prefixCls}-center {
      top: 50%;
      left: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
  }
}
</style>
