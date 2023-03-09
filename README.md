# vue-cli PC端开源项目

vue v2.6.14 、element-ui v2.15.9、eslint v7.32.0、eslint-plugin-vue v8.7.1、sass v1.53.0、sass-loader v12.6.0

1、[good-storage](https://github.com/ustbhuangyi/storage) 操作localstorage

2、crypto-js 加密，解密

3、vue/no-mutating-props错误 

原因：父组件传递到子组件的值，不能赋值到v-model上

解决办法：第一种：将父组件传递过来的值使用computed赋值到新值上，子组件使用新值 第二种：将父组件传递过来的值用:value赋值
