<!--飞参曲线-->
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- operate bar -->
    <el-form :inline="true" class="demo-form-inline standMessage">
      <el-form-item>
        <el-select
          v-model="planeOptionsChecked"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="出厂编号"
          @change="planeOptionsCheck"
        >
          <el-option
            v-for="item in planeOptions"
            :key="item.FACTORYNUMBER"
            :label="item.FACTORYNUMBER"
            :value="item.FACTORYNUMBER"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 起落架次 -->
      <el-form-item>
        <el-select
          v-model="upDownsOptionsChecked"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="起落架次"
        >
          <el-option
            v-for="item in upDownsOptions"
            :key="item.QLBH"
            :label="item.QLBH"
            :value="item.QLBH"
          ></el-option>
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
  </div>
</template>

<script>
import { http } from "../../../api/http";
export default {
  name: "fdrBight",
  data() {
    return {
      echars: false,
      planeOptions: [],
      upDownsOptions: [],
      flyParamOptions: ["高度", "速度", "法向过载"],
      planeOptionsChecked: [],
      upDownsOptionsChecked: [],
      flyParamOptionsChecked: [],
      nowLocation: ["数据查询统计", "飞参曲线 "]
    };
  },
  components: {
    commomBread: () => import("../../common/bread.vue")
  },
  created() {
    this.getPlaneOptions();
  },
  methods: {
    getPlaneOptions() {
      http("/data/getccbh", "get").then(res => {
        this.planeOptions = res;
      });
    },
    planeOptionsCheck(val) {
      if (val.length == 0) {
        this.upDownsOptions = [];
        return;
      }
      this.getUpDownOptions(val.join(","));
    },
    getUpDownOptions(param) {
      http("/data/getqlbh", "post", { CCBH: param }).then(res => {
        this.upDownsOptions = res;
      });
    },
    search() {
      if (
        this.planeOptionsChecked.length == 0 ||
        this.upDownsOptionsChecked.length == 0 ||
        this.flyParamOptionsChecked.length == 0
      ) {
        this.$message.warning("搜索条件不能为空");
        return;
      }
      // deal param and search!
      // http().then(res=>{

      // })
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