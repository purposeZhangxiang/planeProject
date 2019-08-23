<!--飞参曲线-->
<template>
    <div>
        <commomBread :nowLocation="nowLocation"></commomBread>
        <el-form :inline="true" :model="formInline" class="demo-form-inline standMessage">
            <el-form-item>
                <el-select v-model="value1" multiple filterable allow-create default-first-option placeholder="飞机选择">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="value2" multiple filterable allow-create default-first-option placeholder="起落选择">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="value3" multiple filterable allow-create default-first-option placeholder="参数选择">
                    <el-option v-for="item in options3" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>

        <section class="chart-container" v-show="echars == true">
            <div id="chartLine" style="width:1000px; height:600px;"></div>
            <!--<el-col :span="24">-->
            <!--<div id="chartLine" style="width:70vw; height:400px;"></div>-->
            <!--</el-col>-->
        </section>

        <div class="message" v-show="echars == false">
            <h1>当前没有搜索数据,请选择你要搜索的数据</h1>
        </div>
    </div>
</template>

<script>
  export default {
    name: "fdrBight",
    data() {
      return {
        echars: false,
        options1: [
          {
          value: '1111',
          label: '1111'
        },
          {
            value: '256',
            label: '256'
          },
          {
            value: '345',
            label: '345'
          },],
        options2: [
          {
          value: '124',
          label: '124'
        },
          {
            value: '222',
            label: '222'
          },
          {
            value: '333',
            label: '333'
          },],
        options3: [
          {
          value: '100',
          label: '100'
        },
          {
            value: '1200',
            label: '1200'
          },
          {
            value: '1321',
            label: '1321'
          },],
        value1: [],
        value2: [],
        value3: [],
        formInline: {
          user: '',
          obj: '',
          region: ''
        },
        nowLocation: ['数据查询统计', '飞参曲线 '],
      }
    },
    components: {
      commomBread: () => import('../../common/bread.vue')
    },
    methods: {
      search() {
        if (this.value1 == '' && this.value2 == '' && this.value3 == '') {
          this.echars = false;
        } else {
          this.echars = true;
          this.chartLines(this.value1, this.value2, this.value3);
        }
      },
      chartLines(value1, value2, value3) {
        let charts = document.getElementById("chartLine");
        let chartLine = this.$echarts.init(charts);
        chartLine.setOption({
          title: {
            text: "Line Chart"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["飞机选择", "起落选择", "参数选择"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "飞机选择",
              type: "line",
              stack: "总量",
              data: value1
            },
            {
              name: "起落选择",
              type: "line",
              stack: "总量",
              data: value2
            },
            {
              name: "参数选择",
              type: "line",
              stack: "总量",
              data: value3
            }
          ]
        });
        chartLine.resize();
        /*窗口自适应，关键代码*/
        setTimeout(function () {
          window.onresize = function () {
            chartLine.resize();
          }
        }, 200)
      },
    }
  }
</script>
<style>
    .chart-container {
        width: 1000px;
        margin: 0 auto;
        /* float: left; */
    }

    #chartLine {
        padding: 30px 20px;
        box-sizing: border-box;
    }

    .el-dialog--center {
        height: 74vh;
    }
</style>
