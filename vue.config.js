module.exports = {
  publicPath: './',
  pages: {
    app: {
      entry: './src/main.js',
      template: './src/index.html',
      filename: 'index.html'
    }
  },
  outputDir: 'dist',
  assetsDir: 'static',
  runtimeCompiler: true,
  productionSourceMap: false,
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'error' : false,
      maxEntrypointSize: 512000, // 500kb * 1024 = 512000字节
      maxAssetSize: 512000, // 500kb * 1024 = 512000字节
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  },
  // scss变量引入，实现自定义样式主题
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/assets/style/variables.scss";`
      }
    }
  },
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
