<!--飞参曲线-->
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- operate bar -->
    <el-form :inline="true" class="demo-form-inline standMessage">
      <!-- 部队编号 -->
      <el-form-item label="部队编号">
        <el-select v-model="bdbhOptionsChecked" filterable allow-create default-first-option placeholder="部队编号">
          <el-option v-for="item in bdbhOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="planeOptionsChecked" filterable allow-create default-first-option placeholder="请选择出厂编号"
          @change="planeOptionsCheck">
          <el-option v-for="item in planeOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <!-- 起落架次 -->
      <el-form-item>
        <el-select v-model="upDownsOptionsChecked" filterable allow-create default-first-option placeholder="请选择起落架次">
          <el-option v-for="item in upDownsOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>

      <!-- 飞行参数 -->
      <el-form-item>
        <el-select v-model="flyParamOptionsChecked" multiple filterable allow-create default-first-option
          placeholder="请选择飞行参数">
          <el-option v-for="item in flyParamOptions" :key="item.val" :label="item.label" :value="item.val"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- eachrts -->
    <div id="chartLine" style="width:100%;"></div>
  </div>
</template>

<script>
  import {
    http,
    httpHasLoad
  } from "../../../api/http";
  export default {
    name: "fdrBight",
    data() {
      return {
        planeOptions: [],
        upDownsOptions: [],
        bdbhOptions: [],
        flyParamOptions: [{
            label: "高度",
            val: "hp"
          },
          {
            label: "速度",
            val: "vi"
          },
          {
            label: "法向过载",
            val: "nz"
          }
        ],
        //checked
        planeOptionsChecked: "",
        upDownsOptionsChecked: "",
        flyParamOptionsChecked: [],
        bdbhOptionsChecked: "",
        nowLocation: ["数据查询统计", "飞参曲线 "],
        //echars
        echartsName: "",
        series: [],
        xAxis: []
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
        this.getUpDownOptions(val);
      },
      getUpDownOptions(param) {
        http("/data/getQLBH", "post", {
          CCBH: param
        }).then(res => {
          this.upDownsOptions = res;
        });
      },
      getBDBH() {
        http("/data/getBDBH", "get").then(res => {
          this.bdbhOptions = res;
          this.bdbhOptionsChecked = res[0]; //default first
        });
      },
      search() {
        if (
          this.planeOptionsChecked == "" ||
          this.upDownsOptionsChecked == "" ||
          this.bdbhOptionsChecked == "" ||
          this.flyParamOptionsChecked.length == 0
        ) {
          this.$message.warning("搜索条件不能为空");
          return;
        }
        // deal param and search!
        httpHasLoad("/data/djFXQX", "post", {
          BDBH: this.bdbhOptionsChecked,
          CCBH: this.planeOptionsChecked,
          QLJC: this.upDownsOptionsChecked,
          PARAMS: this.flyParamOptionsChecked.join(",")
        }).then(res => {
          //deal xAxis
          // let xAxis = res.map(val => this.formatTime(val.FXSJ, "Y/M/D h:m:s"));
          // debugger
          // this.xAxis = xAxis;
          // this.xAxis = Array.from(xAixs);
          // console.log(this.xAxis)
          //deal kind
          this.kind(res);
        });
      },
      kind(data) {
        let vi = {
            name: "飞行速度",
            type: "line",
            data: []
          },
          hp = {
            name: "飞行高度",
            type: "line",
            data: []
          },
          nz = {
            name: "法向过载",
            type: "line",
            data: []
          };
        let xAxis = [];
        let li = [];
        const appendName = val => {
          li.indexOf(val) == -1 && li.push(val);
        };
        for (let val of data) {
          xAxis.push(val.FXSJ);
          switch (val.NAME) {
            case "vi":
              vi.data.push(val.VALUE);
              appendName(vi.name);
              break;
            case "hp":
              hp.data.push(val.VALUE);
              appendName(hp.name);
              break;
            case "nz":
              nz.data.push(val.VALUE);
              appendName(val.name);
              break;
          }
        }
        this.series = [vi, hp, nz];
        this.xAxis = Array.from(new Set(xAxis));
        this.drawLineChart(li);
      },
      drawLineChart(li) {
        const getZoomScale = function (itemLenth) {
          const itemWidth = 50;
          const clientWidth = document.documentElement.clientWidth;
          const scale = clientWidth * 1.0 / (itemLenth * itemWidth);
          const rScale = (scale - 1 > 0 ? 1 : scale) * 100;
          return rScale;
        }
        let element = document.getElementById("chartLine");
        element.style.height = (document.documentElement.clientHeight - 250) + "px";
        this.chartLine = this.$echarts.init(element);
        if (li.length <= 0) {
          this.$message.info("不存在符合查询条件的数据");
          this.chartLine.setOption({

          });
          return;
        }
        //x 轴
        let xAxis = {
          type: "category",
          name: "飞行时间",
          nameLocation: "middle",
          nameGap: 20,
          nameTextStyle: {
            padding: 2,
          },
          boundaryGap: false,
          axisLabel: {
            formatter: val => {
              return this.formatTime(val, "Y/M/D h:m:s");
            }
          },
          data: this.xAxis
        };
        const scale = getZoomScale(xAxis.data.length);
        const rScale = scale - 10 > 0 ? scale : 10;
        let dataZoom = [{
            type: 'slider', //数据滑块
            start: 0,
            minSpan: 5, //5min
            start: 0,
            end: rScale,
            showDetail: false,
            dataBackground: {
              lineStyle: {
                color: '#95BC2F'
              },
              areaStyle: {
                color: '#95BC2F',
                opacity: 1,
              }
            },
          },
          {
            type: 'inside' //使鼠标在图表中时滚轮可用
          }
        ]
        //y轴
        let yAxis = {
          type: "value",
          name: "",
          nameLocation: "end"
        };
        let series = this.series; //.concat(this.series);
        this.chartLine.setOption({
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: li
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis,
          yAxis,
          series,
          dataZoom,
          toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ["toolbox"],
              pixelRatio: 4
            }
          }
        },
        });
      },
      /**
       * 时间戳转化为年 月 日 时 分 秒
       * number: 传入时间戳
       * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
       */
      formatTime(number, format) {
        var formateArr = ["Y", "M", "D", "h", "m", "s"];
        var returnArr = [];

        var date = new Date(number * 1000);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));

        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
          format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
      },
      //数据转化
      formatNumber(n) {
        n = n.toString();
        return n[1] ? n : "0" + n;
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