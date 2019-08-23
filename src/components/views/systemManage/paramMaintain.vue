<template>
    <div>
        <bread :nowLocation="nowLocation"></bread>
        <el-form :inline="true" :model="searchInput" class="searchInput standMessage">
            <el-form-item>
                <el-select clearable v-model="searchInput.condition">
                    <el-option v-for="(item,index) in theadText" :key="index" :label="item.name"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select clearable v-model="searchInput.include">
                    <el-option label="包含" value="like"></el-option>
                    <el-option label="等于" value="eq"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="searchInput.keyword" placeholder="请输入登陆账号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchForm">搜索</el-button>
                <el-button type="primary" @click="addForm">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="standMessage">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column v-for="(item,index) in theadText" :prop="item.prop" :label="item.name"
                                 :key="index"></el-table-column>
                <el-table-column label="操作" width="232">
                    <template slot-scope="scope">
                        <el-button size="mini" type="info" plain @click="updata(scope.$index, scope.row)">修改
                        </el-button>
                        <el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="tiTitle" :visible.sync="centerDialogVisible" width="30%" center>
            <el-input></el-input>
        </el-dialog>
        <pages class="standMessage" @getTableData="getTableData" :tableData="tableData" :totalData="totalData"></pages>
    </div>
</template>

<script>
  import bread from "../../../components/common/bread";
  import pages from "../../../components/common/pages"
  import {http} from '../../../api/http';

  export default {
    data() {
      return {
        totalData: 10,
        searchInput: {
          condition: "",
          include: "like",
          keyword: ""
        },
        tiTitle: "",
        tableData: [],
        centerDialogVisible: false,
        theadText: [
          {name: "参数代码", value: "name", prop: "name"},
          {name: "参数名称", value: "accountNumber", prop: "accountNumber"},
          {name: "参数显示", value: "fixationPhone", prop: "fixationPhone"},
          {name: "参数排序", value: "movePhone", prop: "movePhone"},
          {name: "注释", value: "emailAddress", prop: "emailAddress"},
        ],
        nowLocation: ["系统管理", "参数维护"],
        multipleSelection: [],
      }
    },
    components: {
      bread,
      pages
    },
    created() {
      this.getTableData();
      this.searchInput.condition = this.theadText[0].value;
    },
    methods: {
      getTableData(currentPage, pageSize) {
        let json = {
          currentPage: currentPage || 1,
          pageSize: pageSize || 10
        };
        // http("post",json).then(res => {
        //
        // })
      },
      searchForm() {
        let json = {
          // this.searchInput.keyword
          [this.searchInput.condition]: this.searchInput.include,
        };

        //   http("", "post", json).then(res => {
        //
        //   })
      },
      updata() {
        let json = {};
        // http("post", json).then(res => {
        //
        // })
      },
      addForm() {

      },
      deletes() {
        let json = {
          id: this.id,
        };
        // http("", "post", json).then(res => {
        //
        // })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    }
  }
</script>

<style lang="less" scoped>
    .block {
        text-align: right;
    }
</style>
