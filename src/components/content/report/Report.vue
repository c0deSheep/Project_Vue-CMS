<template>
  <div>
    <!--面包屑导航区域-->
    <breadcrumb>
      <span slot="subName">数据统计</span>
      <span slot="itemName">数据报表</span>
    </breadcrumb>

    <!--卡片视图-->
    <card>
      <!--2.为Echarts准备一个具备大小（宽高）的Dom-->
      <div id="main" style="width: 1000px; height: 600px; margin: 30px auto" slot="row"></div>
    </card>
  </div>
</template>

<script>
  import { get } from  '../../../network/get'

  // 1.导入echarts
  import echarts from 'echarts'

  import _ from 'lodash'

  import Breadcrumb from '../../common/breadcrumb/Breadcrumb'
  import Card from '../../common/card/Card'

  export default {
    name: "Report",
    components:{
      Breadcrumb,
      Card
    },
    data () {
      return {
        // 需要和从API中获取的数据合并
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    methods:{
      /**
       * 网络请求
       * */
      // a.封装get获取report数据
      getReportData(){
       return get('reports/type/1').then(res => {
          if (res.meta.status !== 200) {
            return this.$message.error('获取图形数据失败')
          }
          return res
        })
      },
    },
    // mounted执行时，页面的元素已被渲染完毕
    mounted () {
      // 3.基于准备好的dom，初始化echarts实例
      const  myChart = echarts.init(document.getElementById('main'))

      // 4.准备数据和配置项
      const option = {
        title: {
          text: '第一个 ECharts 实例'
        },
        tooltip: {},
        legend: {
          data:['销量']
        },
        xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      };

      // 再展示数据之前再用API获取数据
      this.getReportData().then( (res)=>{


        // 4.5将服务器返回的数据和data中的option配置项合并，使用lodash
        const result = _.merge(res.data, this.options)

        // 5.展示数据
        myChart.setOption(result)
      })

    }
  }
</script>

<style scoped>

</style>