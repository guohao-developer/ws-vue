<!-- 库存和销量分析 -->
<template>
    <div class="com-container">
      <div class="com-chart" ref="stockRef">

      </div>
    </div>
  </template>
<script>
export default {
  // 商家销售统计
  name: 'Stock',
  data () {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 当前显示数据的页数
      currentIndex: 1,
      // 定时器标识
      timerId: null,
      // 圆环坐标
      centerArr: [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ],
      // 圆环渐变色
      colorArr: [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
    }
  },
  created () {
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    // 由于初始化 使用到了DOM元素，因此需要在 mounted生命周期内调用
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'stockData',
      chartName: 'stock',
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
    this.$socket.unRegisterCallBack('stockData')
  },
  methods: {
    // 初始化图表的方法
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.stockRef, 'dark')
      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)

      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.chartInstance.on('mouseout', this.startInterval)
    },

    // 获取服务器数据
    async getData (ret) {
      this.allData = ret
      console.log(this.allData, 'ggggg')
      this.updateChart()
    },

    // 更新图表配置项
    updateChart () {
      // 需要显示的原始数据   包含0，不好含5
      const start = (this.currentIndex - 1) * 5
      const end = start + 5
      const showData = this.allData.slice(start, end)
      // 真实显示的数据
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          // 设置成圆环图，外圆半径，内圆半径 在响应式处指定
          // radius: [120, 100],

          // 饼图的位置
          center: this.centerArr[index],
          // 关闭鼠标移入到饼图的动画效果
          hoverAnimation: false,
          // 隐藏指示线条
          labelLine: {
            show: false
          },
          label: {
            position: 'center',
            color: this.colorArr[index][0]
          },
          data: [
            // 销量
            {
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                // 创建线性渐变的颜色 从下往上
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  // 0%
                  { offset: 0, color: this.colorArr[index][0] },
                  // 100%
                  { offset: 1, color: this.colorArr[index][1] }
                ])
              },
              // 内部的提示框 c数值 d百分比
              tooltip: {
                formatter: `${item.name} <br/>销量：{c} <br/>占比：{d}%`
              }
            },
            // 库存
            {
              value: item.stock,
              itemStyle: {
                color: '#bbb'
              },
              // 内部的提示框
              tooltip: {
                formatter: `${item.name} <br/>库存：{c} <br>占比：{d}%`
              }
            }
          ]
        }
      })

      const dataOption = {
        tooltip: {
          // 这里为item 可以为内部的数据开启 单独的 tooltip
          trigger: 'item'
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)

      // 开启定时切换
      this.startInterval()
    },
    // 定时器不断切换当前页数
    startInterval () {
      this.timerId && clearInterval(this.timerId)

      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 2) this.currentIndex = 1
        // 在更新完数据后，需要更新页面
        this.updateChart()
      }, 5000)
    },
    // 不同分辨率的响应式
    screenAdapter () {
      const titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6
      // 圆的内院半径和 外圆半径
      const innerRadius = titleFontSize * 2.8
      const outerRadius = innerRadius * 1.2

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 1.2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  }
}
</script>
<style>

</style>
