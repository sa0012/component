<template>
  <div class="uploader">
    <div class="sq-uploader-input-wrap">
      <input
        class="sq-uploader-input"
        type="file"
        accept="image/*"
        name="file"
        @change="handleChange($event)"
      >
    </div>
    <img :src="imgUrl" alt="">
    <img :src="blob" alt="">
  </div>
</template>

<script>
const dataURLtoBlob = dataurl => {
  console.log('进来了吗')
  var arr = dataurl.split(',')
  console.log(arr, 'arr')
  var mime = arr[0].match(/:(.*?);/)[1]
  var bstr = atob(arr[1]); var n = bstr.length
  console.log('u8arr')
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  console.log(1222222, 'dataURLtoBlob')
  return new Blob([u8arr], { type: mime })
}

export default {
  name: 'uploader',
  data () {
    return {
      imgUrl: '',
      blob: null,
      disabled: false
    }
  },

  methods: {
    blobToDataURL (blob, cb) {
      let reader = new FileReader()
      reader.onload = function (evt) {
        var base64 = evt.target.result
        cb(base64)
      }
      reader.readAsDataURL(blob)
    },

    handleChange (e) {
      let { files } = e.target
      if (this.disabled || !files.length) {
        return
      }

      console.log(files, 'files')

      const urlObj = window.URL || window.webkitURL || window.mozURL
      var img = files[0]
      var url = urlObj.createObjectURL(img)
      var imageUrl = ''
      if (url) {
        imageUrl = url.split(':').slice(1).join('')
      }
      console.log(imageUrl, 'url')
      this.blobToDataURL(img, (base64Url) => {
        // console.log(base64Url, 'base64')
        this.imgUrl = base64Url
        var _blob = dataURLtoBlob(base64Url)
        this.blob = _blob
        console.log(_blob, 'blob')
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.sq-uploader {
  &-input-wrap {
    float: left;
    width: 30%;
    // height: 80px;
    padding-top: 30%;
    display: block;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    border: 1px solid #D9D9D9;
    position: relative;
    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      left: 20px;
      right: 20px;
      top: 50%;
      height: 2px;
      transform: translate(0, -50%);
      background-color: #D9D9D9;
    }
    &::after {
      content: '';
      position: absolute;
      top: 20px;
      bottom: 20px;
      left: 50%;
      width: 2px;
      transform: translate(-50%, 0);
      background-color: #D9D9D9;
    }
  }
  &-input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

img {
  width: 30%;
}
</style>