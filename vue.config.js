const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = defineConfig({
  transpileDependencies: true,
  // 公共路径(必须有的)
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // 静态资源存放的文件夹(相对于ouputDir)
  assetsDir: 'assets',
  productionSourceMap: true, // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  devServer: {
    // open: true, // vue-cli 5.0.6项目启动后自动打开浏览器Url为0.0.0.0，这个Bug还没有修复
    proxy: {
      '/api': {
        target: 'https://192.168.0.132:8888/',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false // 接受 运行在 https 上的服务
      }
    }
  },
  chainWebpack: config => {
    config
      .resolve
      .alias
      .set('@', resolve('src'))
      .set('core', resolve('src/core'))

    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'vue-cli PC端开源项目'
        return args
      })
  }
})
