<template>
  <view>
    <!-- 轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <!-- view无法跳转，改造为navigator ；点击带id跳转-->
        <navigator class="swiper-item" :url = "'/subpkg/goods_detail/goods_detail?good_id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src"class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item,i) in floorList" :key="i">
        <!-- 标题 -->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <view class="floor-img-box">
          <!-- 左侧图 -->
          <navigator class="left-img-box" :url="item.product_list[0].url" open-type="navigate">
              <image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!-- 右侧图 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url" open-type="navigate">
                  <image :src="item2.image_src" mode="widthFix" :style="{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
      
    </view>
    
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //轮播图的数据列表
        swiperList:[],
        //分类导航数据
        navList:[],
        //楼层数据
        floorList:[],
      };
    },
    onLoad() {//load时发起请求
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods:{
      //获取轮播图
      async getSwiperList(){
        const {data:res} = await uni.$http.get('/home/swiperdata')
        // console.log(res),200成功
        if(res.meta.status !== 200) return uni.$showMsg()//$showMsg,在main.js中封装的方法
        //请求成功
        this.swiperList = res.message
        uni.$showMsg('数据请求成功')
      },
      //获取列表
      async getNavList(){
        const {data:res} = await uni.$http.get('/home/catitems')
        if(res.meta.status !== 200) return uni.$showMsg()//$showMsg,在main.js中封装的方法
        this.navList = res.message
      },
      navClickHandler(item){//点击跳转页面方法
        //点击判断返回数据的name为哪个
        if(item.name === '分类'){
          uni.switchTab({//切换跳转switchTab
            url:'/pages/cate/cate'
          })
        }
      },
      //获取楼层图
      async getFloorList(){
        const {data:res} = await uni.$http.get('/home/floordata')
        if(res.meta.status !== 200) return uni.$showMsg()//$showMsg,在main.js中封装的方法
        //更改跳转地址url
        res.message.forEach(floor => {
          floor.product_list.forEach(prod =>{
            //原来没有url。直接加上
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
        console.log(this.floorList)
      }
    }
  }
</script>

<style lang="scss">
swiper {
  height: 330rpx;
  .swiper-item,
  image{
    width: 100%;
    height: 100%;
  }
}
.nav-list{
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  .nav-img{
    width: 128rpx;
    height: 140rpx;
  }
}
.floor-title{
  height: 60rpx;
  width: 100%;
  display: flex;
}
.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
.right-img-box {
  display: flex;
  // 一行放不下自动换行
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
