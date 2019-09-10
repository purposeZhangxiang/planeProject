<template>
  <div>
    <Bread :nowLocation="nowLocation" />
 
    <!-- table -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item,index) in thead"
        :key="index"
        :label="item.name"
        :prop="item.prop"
        width="120px"
      ></el-table-column>
    </el-table>
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
      nowLocation: ["绘制"],
      thead: [
         {
          name: "总起落次数",
          value: "",
          prop: "FLYCOUNT"
        },
        {
          name: "飞行小时",
          value: "",
          prop: "SUMBCFXSJ"
        },
        {
          name: "当量飞行小时",
          value: "",
          prop: "DLFXXS"
        },
        {
          name: "剩余飞行小时",
          value: "",
          prop: "SYFXXS"
        },
        {
          name:'寿命比',
          prop: "SMB"
        },
        {
          name:'预计总寿命',
          prop:'YJZSM'
        },
        {
          name: "出厂编号",
          value: "",
          prop: "FACTORYNUMBER"
        },
        {
          name: "飞机型号",
          value: "",
          prop: "PLANETYPE"
        },
        {
          name: "出厂年月",
          value: "",
          prop: "DELIVERYTIME"
        },
        {
          name: "服役日期",
          value: "",
          prop: "SERVICEDATE"
        },
        // {
        //   name: "部队编号",
        //   value: "",
        //   prop: "UNITNUMBER"
        // },
        {
          name: "累计损伤",
          value: "",
          prop: "SUMBCDLSS"
        },
        {
          name: "单位时间损伤",
          value: "",
          prop: "DWSJDLSS"
        },
        
        
      ],
      tableData: [],
      chartLine: null,
      dealXAxis: [],
      yAxis: []
    };
  },
  created() {
    this.tableData.push(this.$route.query);
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