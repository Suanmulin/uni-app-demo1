
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 网络请求对象
import { $http } from '@escook/request-miniprogram'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
//请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title:'数据加载中'
  })
}
$http.afterRequest = function () {
  //请求结束隐藏loading效果
  uni.hideLoading()
}

//封装请求失败时的方法，方便其他页面调用
uni.$showMsg = function(title = '数据请求失败',duration = 1500){//没有输入title、持续时间默认使用“数据请求失败”，持续1500秒
  uni.showToast({//showToast弹窗提示
    title,
    duration,//1.5秒后自动关闭
    icon:'none'//无需展示图标
  })
}



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif