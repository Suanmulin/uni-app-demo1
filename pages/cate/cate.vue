<template>
  <view>
    <!-- 自定义组件 搜索  -->
    <my-saerch :bgcolor="'black'" :rad="50" @myclick="gotoSearch"></my-saerch>
    <view class="scroll-view-container">
      <!-- 左 -->
      <scroll-view class="left-scroll-view"  :style="{height: wh + 'px'}" scroll-y="true">
         <block v-for="(obj,i) in cateList" :key="i">
           <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{obj.cat_name}}</view>
         </block>
      </scroll-view>
      <!-- 右 -->
      <scroll-view class="right-scroll-view"  :style="{height: wh + 'px'}" scroll-y="true" :scroll-top="st">
        <!-- 二级分类 Item 项 -->
        <view class="cate-lv2" v-for="(item2, i2) in cateList2" :key="i2">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 三级分类 Item 项 -->
          <view class="cate-lv3-list">
          <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="togoodslist(item3)">
            <!-- 图片 -->
          <image :src="item3.cat_icon"></image>
        <!-- 文本 -->
          <text>{{item3.cat_name}}</text>
          </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh:0,
        cateList:[],
        active:0,
        cateList2:[],
        st:0
      };
    },
    onLoad() {
      // const sysInFo = uni.getSystemInfo()
      // this.wh = sysInFo.windowHeight
      // 获取当前系统的信息
      const sysInfo = uni.getSystemInfoSync()
            // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight -50//搜索栏高50
      this.getCateList()
    },
    methods:{
      gotoSearch(){//搜索栏
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      }
      ,async getCateList(){
        const{data:res} = await uni.$http.get('/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateList2 = res.message[0].children
      },
      activeChanged(val){//点击切换3级菜单栏
        this.active = val
        this.cateList2 = this.cateList[val].children
        //点击后，滚动条重置位置，因为连续点击st值不变的情况下，不会更新视图
        this.st = this.st === 0 ? 1 : 0
      },
      togoodslist(val){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid=' + val.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;

  .left-scroll-view {
    width: 120px;

    .left-scroll-view-item {
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;

      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;

        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  .cate-lv2-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
  
    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
  
      image {
        width: 60px;
        height: 60px;
      }
  
      text {
        font-size: 12px;
      }
    }
  }
}
</style>
