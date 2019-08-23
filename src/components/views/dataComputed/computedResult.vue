<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- table -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column v-for="item in tableRow" :key="item" :label="item.label" :prop="item.prop"></el-table-column>
    </el-table>
    <!-- echar -->
    <div class="echartsBox">
      <div id="chartColumn" style="width:100%; height:400px;"></div>
    </div>
  </div>
</template>

<script>
import { http } from "../../../api/http";

export default {
  components: {
    breadNav: () => import("../../common/bread.vue")
  },
  data() {
    /**
     * @param {nowLocation} 面包屑导航文字
     * @param {}
     */
    return {
      nowLocation: ["数据导入计算"],
      tableData: [],
      tableRow: [
        { label: "飞机编号", prop: "" },
        { label: "飞机型号", prop: "" },
        { label: "出厂年月", prop: "" },
        { label: "服役日期", prop: "" },
        { label: "部队编号", prop: "" },
        { label: "使用编号", prop: "" },
        { label: "飞行小时(h)", prop: "" },
        { label: "当量飞行(h)", prop: "" },
        { label: "剩余飞行小时(h)", prop: "" },
        { label: "总起落次数", prop: "" }
      ],
      chartColumn: null
    };
  },
  mounted() {
    console.log(this.$echarts);
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      this.chartColumn = this.$echarts.init(
        document.getElementById("chartColumn")
      );
      this.chartColumn.setOption({
        title: { text: "飞行数据" },
        tooltip: {},
        xAxis: {
          data: ["飞行小时", "飞行当量小时", "剩余寿命"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36]
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>

