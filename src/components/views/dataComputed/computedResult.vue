<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- collapse -->
    <el-collapse v-model="activeName" accordion @change="collChange">
      <el-collapse-item
        v-for="(item,index) in collapseData"
        :key="index"
        :title="item.title"
        :name="index"
      >
        <!-- table -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column
            v-for="(item,index) in tableRow"
            :key="index"
            :label="item.label"
            :prop="item.prop"
          ></el-table-column>
        </el-table>
        <!-- echar -->
        <div class="echartsBox">
          <div id="chartColumn" style="width:100%; height:400px;"></div>
        </div>
      </el-collapse-item>
    </el-collapse>
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
     * @param {tableData}
     */
    return {
      nowLocation: ["数据导入计算"],
      activeName: "1",
      collapseData: [],
      tableData: [],
      tableRow: [
        { label: "飞机编号", prop: "FACTORYNUMBER" },
        { label: "飞机型号", prop: "PLANETYPE" },
        { label: "出厂年月", prop: "DELIVERYTIME" },
        { label: "服役日期", prop: "SERVICEDATE" },
        { label: "部队编号", prop: "UNITNUMBER" },
        { label: "使用编号", prop: "" },
        { label: "飞行小时(h)", prop: "SUMBCFXSJ" },
        { label: "当量飞行(h)", prop: "DLFXXS" },
        { label: "剩余飞行小时(h)", prop: "" },
        { label: "总起落次数", prop: "FLYCOUNT" }
      ],
      //echart
      chartColumn: null,
      drawData: []
    };
  },
  created() {
    this.dealData();
  },
  mounted() {},
  methods: {
    dealData() {
      let options = this.$route.query.param;
      this.collapseData = options;
      this.activeName = 0;
      this.getTable();
      console.log(this.collapseData);
    },
    getTable() {
      http("/data/djLL", "post", {
        BDBH: this.collapseData[this.activeName].bdbh,
        CCBH: this.collapseData[this.activeName].ccbh
      }).then(res => {
        this.tableData = res.records;
        //drawline
        this.$nextTick(() => {
          this.initEcharts();
        });
      });
    },
    initEcharts() {
      for (let val of this.tableData) {
        this.drawData.push(val.SUMBCFXSJ);
        this.drawData.push(val.DLFXXS);
      }
      this.chartColumn = this.$echarts.init(
        document.getElementById("chartColumn")
      );
      this.chartColumn.setOption({
        tooltip: {},
        xAxis: {
          data: ["飞行小时", "飞行当量小时", "剩余寿命"]
        },
        yAxis: {},
        series: [
          {
            name: "",
            type: "bar",
            data: this.drawData
          }
        ]
      });
    },
    collChange(op) {
      console.log(op);
    }
  }
};
</script>

<style lang="less" scoped>
</style>

