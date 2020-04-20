<template>
  <div class="upload">
    <div class="upload-area">
      <upload-card
        :addImg="addImg"
        :deleteImg="deleteImg"
        :filterPreviewImage="filterPreviewImage"
        :imageList="imageList"
        :uploadToServer="uploadToServer"
        :productCategory="insured.productCategory"
        :writeCode="insured.writeCode"
        :settlementId="insured.settlementId"
        :multipartUpload="multipartUpload"
        />
    </div>
  </div>
</template>

<script>
import Controller from './handle'
export default Controller
</script>

<style lang="scss" scoped>
.upload {
  &-area {
    background: #fff;
  }
}
</style>