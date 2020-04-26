self.onmessage = function(e) {
  let time = e.data.value
  const timer = setInterval(() => {
    time -= 60
    if(time > 0) {
      self.postMessage({
        value: time
      })
    } else {
      clearInterval(timer)
      self.postMessage({
        value: 0
      })
      self.close()
    }
  }, 60)
}