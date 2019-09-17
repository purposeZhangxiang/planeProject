<!--单机飞行情况-->
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <el-form :inline="true" :model="formInline" class="demo-form-inline standMessage">
      <el-form-item>
        <el-select clearable v-model="formInline.val" placeholder="出厂编号">
          <el-option v-for="(items,index) in theadText" :key="index" :label="items.name" :value="items.prop">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.selectType" placeholder="包含">
          <el-option label="包含" value="like"></el-option>
          <el-option label="等于" value="eq"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="formInline.keyword" placeholder="字段"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" class="elTable" style="width: 100%;">
      <el-table-column align="center" v-for="(item,index) in theadText" :key="index" :label="item.name"
        :prop="item.prop" :show-overflow-tooltip="true" width="120px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleLook(scope.$index, scope.row)">报告</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    http
  } from "../../../api/http";
  export default {
    name: "standMessage",
    components: {
      commomBread: () => import("../../common/bread.vue")
    },
    data() {
      return {
        nowLocation: ["数据查询统计", "单机飞行情况"],
        formInline: {
          selectType: "like",
          val: "",
          keyword: ""
        },
        theadText: [{
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
            name: "部队编号",
            value: "",
            prop: "UNITNUMBER"
          },
          {
            name: "使用机号",
            value: "",
            prop: "USERNUMBER"
          },

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
            name: "寿命比",
            prop: "SMB"
          },

          {
            name: "剩余飞行小时",
            value: "",
            prop: "SYFXXS"
          },
          {
            name: "单机当量损伤率",
            value: "",
            prop: "DWSJDLSS"
          }

          // {
          //   name: "预计总寿命",
          //   prop: "YJZSM"
          // },

          // {
          //   name: "出厂年月",
          //   value: "",
          //   prop: "DELIVERYTIME"
          // },
          // {
          //   name: "服役日期",
          //   value: "",
          //   prop: "SERVICEDATE"
          // },
          // {
          //   name: "部队编号",
          //   value: "",
          //   prop: "UNITNUMBER"
          // },
          // {
          //   name: "累计损伤",
          //   value: "",
          //   prop: "SUMBCDLSS"
          // },
        ],
        tableData: [],
        currentPage: 1,
        currentPagesize: 10
      };
    },
    created() {
      this.getTable();
    },
    methods: {
      getTable(options) {
        let defaultOptions = {
          currentPage: this.currentPage,
          pagesize: this.currentPagesize
        };
        if (options) {
          Object.assign(defaultOptions, options);
        }
        http("/data/djLL", "post", defaultOptions).then(res => {
          this.tableData = res.records;
        });
      },
      search() {
        // create param
        let json = {
          [this.formInline.val]: this.formInline.keyword,
          selectType: this.formInline.selectType
        };
        this.getTable(json);
      },
      handleLook(index, row) {
        this.$router.push({
          path: "/home/drawgLine",
          query: row
        });
      }
    }
  };
</script>

<style>
  .el-table tr div {
    text-align: center !important;
  }

  .el-table .cell {
    white-space: nowrap !important;
  }
</style>