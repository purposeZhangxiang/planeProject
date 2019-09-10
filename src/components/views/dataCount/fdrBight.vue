<!--飞参曲线-->
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- operate bar -->
    <el-form :inline="true" class="demo-form-inline standMessage">
      <el-form-item>
        <el-select
          v-model="planeOptionsChecked"
          filterable
          allow-create
          default-first-option
          placeholder="出厂编号"
          @change="planeOptionsCheck"
        >
          <el-option v-for="item in planeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- 起落架次 -->
      <el-form-item>
        <el-select
          v-model="upDownsOptionsChecked"
          filterable
          allow-create
          default-first-option
          placeholder="起落架次"
        >
          <el-option
            v-for="item in upDownsOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 部队编号 -->
      <el-form-item>
        <el-select
          v-model="bdbhOptionsChecked"
          filterable
          allow-create
          default-first-option
          placeholder="部队编号"
        >
          <el-option v-for="item in bdbhOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- 飞行参数 -->
      <el-form-item>
        <el-select
          v-model="flyParamOptionsChecked"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="飞行参数"
        >
          <el-option v-for="item in flyParamOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- eachrts -->
    <div id="chartLine" style="width:100%; height:400px;"></div>
  </div>
</template>

<script>
import { http } from "../../../api/http";
export default {
  name: "fdrBight",
  data() {
    return {
      planeOptions: [],
      upDownsOptions: [],
      bdbhOptions: [],
      flyParamOptions: ["高度", "速度", "法向过载"],
      //checked
      planeOptionsChecked: "",
      upDownsOptionsChecked: "",
      flyParamOptionsChecked: [],
      bdbhOptionsChecked:"",
      nowLocation: ["数据查询统计", "飞参曲线 "],
      //echars
      echartsName:'',
      yAxis:[],
      dealXAxis:[],
    };
  },
  components: {
    commomBread: () => import("../../common/bread.vue")
  },
  created() {
    this.getPlaneOptions();
    this.getBDBH();
  },
  methods: {
    getPlaneOptions() {
      http("/data/getCCBH", "get").then(res => {
        this.planeOptions = res;
      });
    },
    planeOptionsCheck(val) {
      if (val == "") {
        this.upDownsOptions = "";
        return;
      }
      // this.getUpDownOptions(val.join(","));
      this.getUpDownOptions(val);
      
    },
    getUpDownOptions(param) {
      http("/data/getQLBH", "post", { CCBH: param }).then(res => {
        this.upDownsOptions = res;
      });
    },
    //出厂编号
    getBDBH() {
      http("/data/getBDBH", "get").then(res => {
        this.bdbhOptions = res;
      });
    },
    search() {
      if (
        this.planeOptionsChecked == "" ||
        this.upDownsOptionsChecked == "" ||
        this.bdbhOptionsChecked == ""||
        this.flyParamOptionsChecked.length == 0
      ) {
        this.$message.warning("搜索条件不能为空");
        return;
      }
      // deal param and search!
      http("/data/djFXQX", "post", {
        BDBH: this.bdbhOptionsChecked,
        CCBH: this.planeOptionsChecked,
        QLJC: this.upDownsOptionsChecked,
        PARAMS: this.flyParamOptionsChecked.join(",")
      }).then(res => {
        for(let val of res){
          console.log(val)
          this.yAxis.push(val.VALUE)
        }
        this.drawLineChart()
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



<style>
/* .el-dialog--center {
  height: 74vh;
} */
</style>