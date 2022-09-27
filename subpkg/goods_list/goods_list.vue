<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotodetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj:{
          //关键词
          query:'',
          //商品分类ID
          cid:'',
          //页码
          pagenum:1,
          //每页显示多少数据
          pagesize:10
        },
        goodsList:[],//商品列表数据
        total:0,//总数量，用于分页
        isloading:false//用于检测是否正在请求数据
      };
    },
    onLoad(options){
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods:{
      gotodetail(val){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + val.goods_id
        })
      },
      async getGoodsList(cd){//获取商品列表数据
      this.isloading = true//打开节流阀
        const{data:res} = await uni.$http.get('/goods/search',this.queryObj)
        this.isloading = false//请求数据后，关闭节流阀
        //检查是否有cd，有的话，执行cd回调。没有不执行
        cd && cd()
        
        if(res.meta.status !== 200)return uni.$showMsg()
        //成功为数据赋值
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      }
    },
    onReachBottom(){//触底事件
    //判断数据是否加载完毕
    if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
    //检测节流阀，打开的时候，证明正在请求数据，则return，
    if(this.isloading) return
      this.queryObj.pagenum += 1
      //重新获取列表数据
      this.getGoodsList()
    },
    onPullDownRefresh(){//下拉刷新事件
      this.queryObj.pagenum = 1
      this.goodsList = []
      this.total = 0
      this.isloading = false
      //重新发起请求并停止下拉刷新事件
      this.getGoodsList(()=>{uni.stopPullDownRefresh()})
    }
  }
</script>

<style lang="scss">

</style>
