<!-- 热点销售图 -->
<template>
    <div class="com-container">
      <div class="com-chart" ref="hotRef">

      </div>
    </div>
  </template>
<script>

import _ from 'lodash'
export default {
  // 商家销售统计
  name: 'Hot',
  data () {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 当前显示的一级分类数据类型
      currentIndex: 0,
      // 字体响应式大小
      titleFontSize: null
    }
  },
  created () {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  mounted () {
    // 由于初始化 使用到了DOM元素，因此需要在 mounted生命周期内调用
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hotproduct',
      value: ''
    })
    this.screenAdapter()
    window.addEventListener('resize', this.screenAdapter)
  },
  // 实例销毁后触发
  destroyed () {
    clearInterval(this.timeID)
    // 在组件销毁的时候，把监听器取消掉
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  methods: {
    // 初始化图表的方法
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.hotRef, 'dark')

      const initOption = {
        title: {
          text: '▎热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          // 图标类型 圆形
          icon: 'circle'
        },
        tooltip: {
          show: true,
          // formatter:'hhh'
          formatter: arg => {
            // 拿到三级分类的数据
            const thirdCategory = arg.data.children
            // 计算所有三级分类的数值总和，才能计算出百分比
            let total = 0
            thirdCategory.forEach(item => {
              total += item.value
            })
            // 显示的文本
            let showStr = ''
            thirdCategory.forEach(item => {
              showStr += `
                ${item.name}：${_.round((item.value / total) * 100, 2)}% <br/>
              `
            })
            return showStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              formatter: '{b}{d}%'
            },
            // 高亮状态下的样式
            emphasis: {
              labelLine: {
                // 连接文字的线条
                show: true
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },

    // 获取服务器数据
    async getData (ret) {
      this.allData = ret
      this.updateChart()
    },

    // 更新图表配置项
    updateChart () {
      // 处理数据
      const legenDateArr = this.allData[this.currentIndex].children.map(item => item.name)
      const seriesDataArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      const dataOption = {
        legend: {
          data: legenDateArr
        },
        series: [
          {
            data: seriesDataArr
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 不同分辨率的响应式
    screenAdapter () {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          // 图例的间隔
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.2
          }
        },
        series: [
          {
            // 饼图的大小 半径
            radius: this.titleFontSize * 4.5,
            // 控制饼图的位置 x,y
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>
<style lang="less" scoped>
.com-container {
  i {
    z-index: 999;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    cursor: pointer;
  }
  i.icon-left {
    left: 10%;
  }
  i.icon-right {
    right: 10%;
  }
  .cate-name {
    position: absolute;
    right: 10%;
    bottom: 20px;
    z-index: 999;
  }
}
</style>
