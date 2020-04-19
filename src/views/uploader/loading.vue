<template>
  <div class="loading" v-show="showLoading">
    <i class="iconfont icon-loading"></i>
  </div>
</template>

<script>
export default {
  name: 'imageLoading',
  props: {
    showLoading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      visible: this.showLoading
    }
  },

  watch: {
    showLoading (newVal) {
      this.visible = newVal
    },

    visible (newVal) {
      this.$emit('update:showLoading', newVal)
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 1;
  background: rgba(0, 0, 0, 0.3);
  color: #333;
  font-size: 24px;
  z-index: 333;
  display: flex;
  align-items: center;
  justify-content: center;

  .icon-loading {
    font-size: 30px;
    display: inline-block;
    animation: rotate 1s 0.2s linear infinite forwards;
  }
}
</style>

<style>
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0);
  }
}
</style>
