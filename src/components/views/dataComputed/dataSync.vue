<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- 搜索框 -->
    <div class="serachInput">
      <el-form :inline="true" :model="searchInput" class="searchInput">
        <el-form-item label="部队编号">
          <el-select clearable v-model="searchInput.unitnumber" placeholder="部队编号">
            <el-option v-for="(item,index) in unitOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable multiple v-model="searchInput.factorynum" placeholder="飞机编号">
            <el-option
              v-for="(item,index) in planeOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-model="searchInput.starttime"
            type="date"
            placeholder="开始时间"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchInput.endtime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="handleDownload">全部下载</el-button>
        </el-form-item>
        <el-form-item>
          <el-upload
            :action="action"
            :before-upload="handleBeforeUpload"
            :on-success="handleSuccess"
            :on-error="handleError"
            multiple
            :on-exceed="handleExceed"
          >
            <el-button size="middle" type="primary">数据上报</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <!-- table -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(item,index) in tableRow"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { baseUrl } from "../../../api/env";
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
      nowLocation: ["数据同步"],
      planeOptions: [],
      unitOptions: [],
      searchInput: {
        factorynum: "",
        unitnumber: "",
        starttime: "",
        endtime: ""
      },
      tableData: [],
      tableRow: [
        { label: "创建者", prop: "czr" },
        { label: "出厂编号", prop: "ccbh" },
        { label: "部队编号", prop: "bdbh" },
        { label: "本次飞行时间", prop: "bcfxsj" },
        { label: "本次当量损伤", prop: "bcdlss" },
        { label: "起飞时间", prop: "qfsj" },
        { label: "起落编号", prop: "qlbh" },
        { label: "飞参数据地址", prop: "fcsjwjdz" }
      ],
      action: `${baseUrl}/data/updata`
    };
  },
  created(){
    //get router query
    // this.getData();
  },
  mounted() {
    this.getSelectOptions();
  },
  methods: {
    getData(){
      http("","",).then(res=>{

      })
    },
    getSelectOptions() {
      // 飞机编号
      http("/data/getfactorynumber", "get").then(res => {
        this.planeOptions = res;
      });
      // 部队编号
      http("/data/getunitnumber", "get").then(res => {
        this.unitOptions = res;
        //setting deafult
        this.searchInput.unitnumber=this.unitOptions[0];
      });
    },
    search() {
      //deal data and sumbit!
      let json = JSON.parse(JSON.stringify(this.searchInput));
      json.factorynum = json.factorynum.join(",");
      json.starttime = this.dealTime(json.starttime);
      json.endtime = this.dealTime(json.endtime);
      http("/data/getsearchdownloadfile", "post", json).then(res => {
        this.tableData = res;
      });
    },
    dealTime(time) {
      let res = time.replace(/-/g, "");
      return res;
    },
    handleDownload() {
      let json = JSON.parse(JSON.stringify(this.searchInput));
      json.factorynum = json.factorynum.join(",");
      json.starttime = this.dealTime(json.starttime);
      json.endtime = this.dealTime(json.endtime);
      let arr = [];
      for (let val of this.tableData) {
        arr.push(val.fcsjwjdz);
      }
      json.path = arr;
      http("/data/downloadfile", "post", json, "blob").then(res => {
        this.$message.success("下载成功");
      });
    },
    //上传前
    handleBeforeUpload(file) {
      let isZip = file.type == "application/zip" ? true : false;
      if (!isZip) {
        this.$message.error("上传文件只能是 ZIP 格式!");
      }
      return isZip;
    },
    //上传成功
    handleSuccess(res, file, fileList) {
      this.$message.success("上传成功");
    },
    handleError(err, file, fileList) {
      this.$message.error("上传失败,请重试");
    },
    handleExceed() {}
  }
};
</script>

<style lang="less" scoped>
</style>

