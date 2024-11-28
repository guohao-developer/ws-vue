<!-- 销售排行图标 -->
<template>
    <div class="com-container">
      <div class="com-chart" ref="rankRef">

      </div>
    </div>
  </template>
<script>
export default {
  // 商家销售统计
  name: 'Rank',
  data () {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 柱形图 区域缩放起点值
      startValue: 0,
      // 柱形图结 区域缩放终点值
      endValue: 9,
      // 定时器
      timerId: null
    }
  },
  created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    // 由于初始化 使用到了DOM元素，因此需要在 mounted生命周期内调用
    this.initChart()
    // websocket 请求数据
    this.$socket.send({
      action: 'getData',
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    // this.screenAdapter()
    // window.addEventListener('resize', this.screenAdapter)
  },
  // 实例销毁后触发
  destroyed () {
    clearInterval(this.timerId)
    // 在组件销毁的时候，把监听器取消掉
    // window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('rankData')
  },
  methods: {
    // 初始化图表的方法
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'dark')

      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          // 把x轴和y轴纳入 grid
          containLabel: true
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          value: 'value'
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'top',
              color: 'white',
              rotate: 30
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)

      // 鼠标经过关闭 动画效果
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 鼠标离开 开启动画效果
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },

    // 获取服务器数据
    async getData (ret) {
      this.allData = ret
      this.updateChart()
    },

    // 更新图表配置项
    updateChart () {
      // 渐变色数组
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]

      // 所有省份组成的数组
      const provinceInfo = this.allData.map(item => item.name)
      // 所有省份对应的销售金额
      const valueArr = this.allData.map(item => item.value)

      const dataOption = {
        xAxis: {
          data: provinceInfo
        },
        dataZoom: {
          // 区域缩放组件
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: arg => {
                let targetColorArr = null

                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }

                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // 0%
                  { offset: 0, color: targetColorArr[0] },
                  // 100%
                  { offset: 1, color: targetColorArr[1] }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 当浏览器窗口大小发生变化，完成屏幕适配
    screenAdapter () {
      const titleFontSzie = (this.$refs.rankRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSzie
          }
        },
        series: [
          {
            barWidth: titleFontSzie,
            itemStyle: {
              barBorderRadius: [titleFontSzie / 2, titleFontSzie / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 改变柱形图 区域缩放起始与终点值的函数
    startInterval () {
      // 如果存在则关闭
      this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>
<style>

</style>
