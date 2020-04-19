(function () {
  let lastTime = 0
  let vendors = ['ms', 'moz', 'webkit', 'o']
  window.test = window.setTimeout
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']

    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function (callback) {
      let currTime = new Date().getTime()

      let timeToCall = Math.max(0, 1000 / 60 - (currTime - lastTime))

      let id = window.setTimeout(function () {
        // eslint-disable-next-line standard/no-callback-literal
        callback(currTime + timeToCall)
      }, timeToCall)

      lastTime = currTime + timeToCall

      return id
    }
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
  }
}())
