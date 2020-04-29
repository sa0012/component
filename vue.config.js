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
      maxEntrypointSize: 612000, // 500kb * 1024 = 612000字节
      maxAssetSize: 612000, // 500kb * 1024 = 512000字节
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
        // 添加 CDN 参数到 htmlWebpackPlugin 配置中，见 src/index.html 修改
        if (process.env.NODE_ENV === 'production') {
          // 添加 build 时间 -- version
          args[0].version = getVersion()
          // args[0].cdn = cdnConfig().build
        } else if (process.env.NODE_ENV === 'development') {
          // args[0].cdn = cdnConfig().dev
        }
        return args
      })
    // 提取公共资源，并使用cdn加载
    // config
    //   .when(process.env.NODE_ENV === 'production',
    //     config => {
    //       // 提取公共资源，并使用cdn加载
    //       config.externals({
    //         // 'ali-oss': 'OSS'
    //       })
    //     }
    //   )

    // 配置worjer-loader
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .options({
        inline: true
      })
      .end()

    config.module
      .rule('js')
      .exclude
      .add(/\.worker\.js$/)

    config.module
      .rule('babel-worker')
      .test(/\.worker\.js$/)
      .use('babel-loader')
      .loader('babel-loader')
      .end()
  }
}

function getVersion() {
  let date = new Date()
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset()) // toJSON 的时区补偿
  return date.toJSON().substr(0,19).replace(/[-T:]/g,'')
}

function cdnConfig () {
  return {
    dev: {
      css: [],
      js: []
    },
    build: {
      css: [],
      js: [
        'http://gosspublic.alicdn.com/aliyun-oss-sdk-6.7.0.min.js'
      ]
    }
  }
}
