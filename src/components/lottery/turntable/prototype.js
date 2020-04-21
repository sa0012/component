var ball = function (r, x, y, useCache) {
  this.r = r
  this.x = x
  this.y = y

  this.cacheCanvas = document.createElement('canvas')
  this.cacheCtx = this.cacheCanvas.getContext('2d')
  this.cacheCanvas.width = 2 * this.r
  this.cacheCanvas.height = 2 * this.r

  this.useCache = useCache
  if (useCache) {
    this.cache()
  }
}

ball.prototype = {
  paint (ctx) {
    if (!this.useCache) {
      ctx.save()
      ctx.beginPath()
      this.start++
      if (this.start >= 2) {
        this.start = 0
      }
      for (var j = 0; j < 24; j++) {
        ctx.beginPath()
        if (j % 2 === 0) { // 整点的圆圈是黑色的，非整点的部分是灰色的
          if (this.start === 0) {
            ctx.fillStyle = '#fff'
          } else {
            ctx.fillStyle = '#FBD700'
          }
          // ctx.arc(x, y, 5 * this.px2Rem, 0, 2 * Math.PI, false)
        } else {
          if (this.start === 0) {
            ctx.fillStyle = '#FBD700'
          } else {
            ctx.fillStyle = '#fff'
          }
        }
        ctx.arc(this.x, this.y, 5 * this.px2Rem, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    } else {
      ctx.drawImage(this.cacheCanvas, this.x - this.r, this.y - this.r)
    }
  },

  cache () {
    this.cacheCtx.save()
    this.cacheCtx.restore()
  }
}