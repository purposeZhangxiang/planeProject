<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- collapse -->
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="一致性 Consistency" name="1">
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
      <el-collapse-item title="反馈 Feedback" name="2">
        <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
        <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
      </el-collapse-item>
      <el-collapse-item title="效率 Efficiency" name="3">
        <div>简化流程：设计简洁直观的操作流程；</div>
        <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
        <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
      </el-collapse-item>
      <el-collapse-item title="可控 Controllability" name="4">
        <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
        <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
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
      tableData: [],
      tableRow: [
        { label: "飞机编号", prop: "" },
        { label: "飞机型号", prop: "" },
        { label: "出厂年月", prop: "" },
        { label: "服役日期", prop: "" },
        { label: "部队编号", prop: "bdbh" },
        { label: "使用编号", prop: "" },
        { label: "飞行小时(h)", prop: "" },
        { label: "当量飞行(h)", prop: "" },
        { label: "剩余飞行小时(h)", prop: "" },
        { label: "总起落次数", prop: "" }
      ],
      //echart
      chartColumn: null,
      drawData: [5, 20, 36]
    };
  },
  created() {
    console.log(this.$route.query);
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      this.chartColumn = this.$echarts.init(
        document.getElementById("chartColumn")
      );
      this.chartColumn.setOption({
        // title: { text: "飞行数据" },
        tooltip: {},
        xAxis: {
          data: ["飞行小时", "飞行当量小时", "剩余寿命"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.drawData
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>

