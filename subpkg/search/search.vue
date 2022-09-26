<template>
  <view>
    <view class="search-box">
      <uni-search-bar  @input="input" :radius="50" :cancelButton="'none'" :bgColor="'#ffffff'"></uni-search-bar>
    </view>
    <!-- 搜索列表 -->
    <view class="sugg-list" v-if="searchlist.length !==0">
      <view class="sugg-item" v-for="(obj,i) in searchlist" :key="i" @click="gotodetali(obj)">
        <view class="goods-name">{{obj.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clear"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotogoodslist(item)"></uni-tag>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        kw: '',//输入内容
        searchlist: [],//搜索列表
        historyList: ['a', 'app', 'apple']
      };
    },
    methods:{
      gotogoodslist(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + item
        })
      },
      input(e){
        //防抖
        clearTimeout(this.timer)//一段时间内重新触发，则重新计时1s
        this.timer = setTimeout(()=>{
          this.kw = e
          this.seaLiist()
          this.puhistory()
        },500)
      },
      async seaLiist(){
        if(this.kw === '') {
          this.searchlist = []
          return 
        }
        const {data:res} = await uni.$http.get('/goods/qsearch', {query : this.kw} )
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchlist = res.message
      },
      //跳转到商品详情界面
      gotodetali(val){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + val.goods_id
        })
      },
      puhistory(){//存放搜索关键词 
        // this.historyList.push(this.kw)
        const set = new Set(this.historyList)//要操作的数据
        set.delete(this.kw)//删除与即将存入数组一致的内容
        set.add(this.kw)//存入数组
        this.historyList = Array.from(set)//Array.from转化为数组（新数组）
        
        //数据存储至本地
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      clear(){
        this.historyList = []
        uni.setStorageSync('kw','[]')//清空缓存
      }
    },
    computed:{
      histories(){//道序显示
        return[...this.historyList].reverse()//...不改变原数组historyList
      }
    },
    onLoad(){
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">
  .search-box{
    background-color: #c00000;
    height: 50px;
    position: sticky;//粘性定位元素
    top:0;
    z-index: 999;//权重，层级置顶
  }
  // 搜索
.sugg-list {
  padding: 0 5px;

  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
// 搜索历史
.history-box {
  padding: 0 5px;

  .history-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }

  .history-list {
    display: flex;
    flex-wrap: wrap;

    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
