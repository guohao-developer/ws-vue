<template>
<div class="screen-container">
        <header class="screen-header">
          <div>
            <img src="/static/images/header_border_light.png" alt="" />
          </div>
          <span class="logo">
          </span>
          <span class="title">电商平台实时监控系统</span>
          <div class="title-right">
            <!-- <div class="datetime">{{ systemDateTime }}</div> -->
            <div class="datetime">{{ systemDateTime }}</div>
          </div>
        </header>
        <div class="screen-body">

          <section class="screen-left">
            <div id="left-top" >

              <!-- 销量趋势图表 -->
              <Trend></Trend>

            </div>
            <div id="left-bottom" >

              <!-- 商家销售金额图表 -->
              <Seller></Seller>

            </div>
          </section>

          <section class="screen-middle">
            <div id="middle-top" >

              <!-- 商家分布图表 -->
              <Map></Map>

            </div>
            <div id="middle-bottom" >

              <!-- 地区销量排行图表 -->
              <Rank ref="rank"></Rank>

            </div>
          </section>

          <section class="screen-right">
            <div id="right-top" >

              <!-- 热销商品占比图表 -->
              <Hot></Hot>

            </div>
            <div id="right-bottom" >

              <!-- 库存销量分析图表 -->
              <Stock ref="stock"></Stock>

            </div>
          </section>
        </div>
      </div>
</template>

<script>
import Map from '@/components/Map'
import Seller from '@/components/Seller'
import Trend from '@/components/Trend'
import Hot from '@/components/Hot'
import Rank from '@/components/Rank'
import Stock from '@/components/Stock'
// 导入自己定义的主题工具函数 用于返回不同主题下的配置对象
// import { getThemeValue } from '@/utils/theme_utils'

export default {
  name: 'ScreenPage',
  components: {
    Map,
    Seller,
    Trend,
    Hot,
    Stock,
    Rank
  },
  data () {
    return {
      // // 各组件是否全屏状态
      // fullScreenStatus: {
      //   trend: false,
      //   seller: false,
      //   map: false,
      //   rank: false,
      //   hot: false,
      //   stock: false
      // },
      // // 当前的系统时间
      systemDateTime: new Date().toLocaleString() // 初始值为当前日期和时间
      // // 用于保存当前系统日期的定时器id
      // timerID: null,
      // theme: 'chalk'
    }
  },
  computed: {

  },
  created () {
    this.currentTime()
  },
  methods: {
    // 获取服务器时间
    currentTime () {
      this.systemDateTime = new Date().toLocaleString()

      this.timerID && clearInterval(this.timerID)

      this.timerID = setInterval(() => {
        this.systemDateTime = new Date().toLocaleString()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
  overflow: hidden
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
// section > div {
//   border: 1px solid red;
// }
</style>
