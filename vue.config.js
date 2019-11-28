module.exports = {
  publicPath: '/',
  pages: {
    app: {
      entry: 'src/main.js',
      template: 'src/index.html',
      filename: 'index.html'
    }
  },
  outputDir: 'dist',
  assetsDir: 'static',
  runtimeCompiler: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // version
    config
      .plugin('html-app')
      .tap(args => {
        // 添加 build 时间 -- version
        args[0].version = getVersion()
        return args
      })
  }
}

function getVersion() {
  let date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()) // toJSON 的时区补偿
  return date.toJSON().substr(0,19).replace(/[-T:]/g,'')
}
