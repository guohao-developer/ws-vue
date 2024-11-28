<!-- 商家地图分布 -->
<template>
    <div class="com-container" @dblclick="returnChinaMap">
      <div class="com-chart" ref="mapRef">

      </div>
    </div>
  </template>
<script>
import axiox from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  // 商家地图分布
  name: 'Map',
  data () {
    return {
      // axios实例对象
      axiosInstance: null,
      // 图表的实例对象
      chartInstance: null,
      // 中国地图数据
      chinaMapData: null,
      // 从服务器中获取的所有数据
      allData: null,
      // 获取省份矢量地图数据缓存
      cityMapData: {}
    }
  },
  created () {
    // 在组件创建完成之后，进行回调函数的注册
    this.$socket.registerCallBack('mapData', this.getData)
  },
  mounted () {
    // 由于初始化 使用到了DOM元素，因此需要在 mounted生命周期内调用
    this.initChart()
    // this.getData()
    // websocket 请求数据
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    // this.screenAdapter()
    // window.addEventListener('resize', this.screenAdapter)
  },
  // 实例销毁后触发
  destroyed () {
    clearInterval(this.timeID)
    // 在组件销毁的时候，把监听器取消掉
    // window.removeEventListener('resize', this.screenAdapter)
    // 销毁注册的事件
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    // 初始化 echartsInstance 对象
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'dark')
      // 获取中国地图的矢量数据
      const ret = await axiox.get('http://localhost:8080/static/map/china.json')
      // console.log(ret)
      // 注册地图
      this.$echarts.registerMap('china', ret.data)
      const initOption = {
        title: {
          text: '▉ 商家分布图',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          roam: false,
          // top: '2%',
          // bottom: '2%',
          // 省市效果
          itemStyle: {
            areaColor: '#2E72BF',
            // 边框颜色
            borderColor: '#044e67'
          },
          label: {
            color: '#ccc'
          }

        },
        // 配置图例效果 位置
        legend: {
          left: '2%',
          bottom: '2%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      // 点击事件监听
      this.chartInstance.on('click', async (params) => {
        console.log(params)
        // 获取点击省份的名字
        const provinceInfo = getProvinceMapInfo(params.name)

        if (!this.cityMapData[provinceInfo.key]) {
          // 获取该省份的矢量数据
          const ret = await axiox.get('http://localhost:8080/static' + provinceInfo.path + '.json')
          this.cityMapData[provinceInfo.key] = ret
          // 注册省份的矢量数据
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },

    // 获取服务器数据
    async getData (ret) {
      this.allData = ret
      console.log(this.allData, 'ggggg')
      this.updateChart()
    },

    // 更新图表
    updateChart () {
      // this.allData = ret
      console.log(this.allData, 'tettse')
      // 图例数据
      const legendArr = this.allData.map(item => item.name)
      // 图表散点数据
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          // 设置涟漪效果
          rippleEffect: {
            scale: 5,
            // brushScale: 2,
            brushType: 'stroke'
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    // 开启动态渲染的定时器
    startInterval () {

    },
    // 当浏览器窗口大小发生变化，完成屏幕适配
    screenAdapter () {
      // 当前比较合适的字体大小
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6

      // 响应式的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          // 图例宽度
          itemWidth: titleFontSize / 2,
          // 图例高度
          itemHeight: titleFontSize / 2,
          // 间隔
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }

      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 回到中国地图
    returnChinaMap () {
      const chinaMapOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(chinaMapOption)
    }
  }
}
</script>
<style>

</style>
