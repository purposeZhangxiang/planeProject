<template>
  <div>
    <Bread :nowLocation="nowLocation" />
    <!-- table -->
    <!-- echarts -->
    <div id="chartLine" style="width:100%; height:400px;"></div>
  </div>
</template>

<script>
import { http } from "../../../api/http";
export default {
  components: {
    Bread: () => import("../../common/bread.vue")
  },
  data() {
    return {
      nowLocation: ["画线"],
      chartLine: null,
      dealXAxis: [],
      yAxis: []
    };
  },
  mounted() {
    this.renderTable(this.$route.query);
    this.getData(this.$route.query);
  },
  methods: {
    renderTable(options) {},
    getData(options) {
      http("/data/djbg", "post", {
        BDBH: options.UNITNUMBER,
        CCBH: options.FACTORYNUMBER
      }).then(res => {
        let xAxis = [];
        for (let val of res) {
          xAxis.push(val.BCFXSJ);
          this.yAxis.push(val.BCDLSS);
        }
        //deal x轴
        for (let index in xAxis) {
          if (index == 0) {
            this.dealXAxis.push(xAxis[index]);
          } else {
            let sum = 0;
            for (let i = index; i >= 0; i--) {
              sum += xAxis[i];
            }
            this.dealXAxis.push(sum);
          }
        }
        // console.log(this.dealXAxis);
        // console.log(this.yAxis);
        this.drawLineChart();
      });
    },
    drawLineChart() {
      this.chartLine = this.$echarts.init(document.getElementById("chartLine"));
      //x 轴
      let xAxis = {
        type: "category",
        name: "飞行总时间",
        nameLocation: "middle",
        boundaryGap: false,
        data: this.dealXAxis
      };
      //y轴
      let yAxis = {
        type: "value",
        name: "损伤值",
        nameLocation: "end"
      };
      let series = [
        {
          name: "单机当量损伤",
          type: "line",
          stack: "总量",
          // data: [120.22, 132.23, 101.342, 134.234, 90.234, 230.324, 210.234]
          data: this.yAxis
        }
      ];
      this.chartLine.setOption({
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["单机当量损伤"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis,
        yAxis,
        series
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>