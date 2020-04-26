<template>
  <div class="loading" v-if="showPage">
    <div class="loading-wrap">
      <img src="~@/assets/images/spike/loading.png" alt="" class="loading-icon">
      <span>页面加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPage: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #fff;
  color: #666;
  font-size: 12px;

  &-wrap {
    text-align: center;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-icon {
    width: 20px;
    margin-right: 10px;
    vertical-align: middle;
    animation: rotate 1.8s linear infinite forwards;
  }

  &-text {
    padding-top: 10px;
  }
}
</style>

<style lang="scss">
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
  from {
    transform: rotate(0);
  }
}
</style>
