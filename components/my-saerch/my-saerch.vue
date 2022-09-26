<template>
  <view class="my-search-container" :style="{'background-color': bgcolor}">
    <view class="my-search-box" :style="{'border-radius': rad + 'px'}" @click="btn">
      <uni-icons type="search" size="17"></uni-icons>
      <text  class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-saerch",
    props:{
      bgcolor:{
        type:String,//传入数据属性
        default:'#c00000'//默认值
      },
      rad:{
        type:Number,
        default:18 //px
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      btn(){
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
.my-search-container{
  height: 50px; 
  // background-color: #c00000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  .my-search-box{
    height: 36px;
    background-color: #fff;
    // border-radius: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder{
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>