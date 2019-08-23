<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <el-form :inline="true" :model="searchInput" class="searchInput standMessage">
      <el-form-item>
        <el-select clearable v-model="searchInput.condition">
          <el-option
            v-for="(item,index) in theadText"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchInput.include">
          <el-option label="包含" value="like"></el-option>
          <el-option label="等于" value="eq"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="searchInput.keyword" placeholder="请输入搜索内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">搜索</el-button>
        <el-button type="primary" @click="addForm">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="standMessage">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item,index) in theadText"
          :prop="item.prop"
          :label="item.name"
          :key="index"
        ></el-table-column>
        <el-table-column label="操作" width="232">
          <template slot-scope="scope">
            <el-button size="mini" type="info" plain @click="updata(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="30%" center>
      <span slot="footer" class="dialog-footer">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="人员姓名">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="登陆账号">
            <el-input v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input v-model="form.enterPassword"></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input v-model="form.mobile"></el-input>
          </el-form-item>
          <el-form-item label="移动电话">
            <el-input v-model="form.tel"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="备注说明">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uSubmint">确 定</el-button>
      </span>
    </el-dialog>
    <pages
      class="standMessage"
      @getTableData="getTableData"
      :tableData="tableData"
      :totalData="totalData"
    ></pages>
  </div>
</template>

<script>
import bread from "../../../components/common/bread";
import pages from "../../../components/common/pages";
import { http } from "../../../api/http";

export default {
  data() {
    return {
      id: "",
      totalData: 10,
      tableData: [],
      nowLocation: ["系统管理", "人员管理"],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      form: {
        username: "",
        account: "",
        password: "",
        enterPassword: "",
        mobile: "",
        tel: "",
        email: "",
        desc: ""
      },
      title: "",
      centerDialogVisible: false,
      theadText: [
        { name: "人员姓名", value: "username", prop: "username" },
        { name: "登陆账号", value: "account", prop: "account" },
        { name: "固定电话", value: "mobile", prop: "mobile" },
        { name: "移动电话", value: "tel", prop: "tel" },
        { name: "电子邮箱", value: "email", prop: "email" }
      ],
      currentPage: "",
      pageSize: "",
      multipleSelection: []
    };
  },
  created() {
    this.getTableData();
    this.searchInput.condition = this.theadText[0].value;
  },
  components: {
    bread,
    pages
  },
  methods: {
    getTableData(currentPage, pageSize) {
      this.currentPage = currentPage;
      this.pagesize = pageSize;
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/user/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    searchForm() {
      // if (
      //   this.searchInput.condition == "" ||
      //   this.searchInput.keyword == "" ||
      //   this.searchInput.include == ""
      // ) {
      //   this.$message({ message: "输入框不能为空！", type: "warning" });
      //   return;
      // }
      let json = {
        currentPage: this.currentPage || 1,
        pageSize: this.pageSize || 10,
        [this.searchInput.condition]: this.searchInput.keyword,
        selectType: this.searchInput.include
      };
      http("/user/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    addForm() {
      this.title = "新增";
      this.centerDialogVisible = true;
      this.form.username = "";
      this.form.account = "";
      this.form.password = "";
      this.form.enterPassword = "";
      this.form.mobile = "";
      this.form.tel = "";
      this.form.email = "";
      this.form.desc = "";
    },
    updata(index, row) {
      console.log(row);
      this.title = "修改";
      this.centerDialogVisible = true;
      this.id = row.id;
      this.form.username = row.username;
      this.form.account = row.account;
      this.form.password = row.password;
      this.form.enterPassword = "";
      this.form.mobile = row.mobile;
      this.form.tel = row.tel;
      this.form.email = row.email;
      this.form.desc = row.remarks;
    },
    uSubmint() {
      if (
        this.form.username == "" ||
        this.form.account == "" ||
        this.form.password == "" ||
        this.form.enterPassword == "" ||
        this.form.mobile == "" ||
        this.form.tel == "" ||
        this.form.email == "" ||
        this.form.desc == ""
      ) {
        this.$message({ message: "输入框不能为空！", type: "warning" });
        return;
      }
      if (this.form.password != this.form.enterPassword) {
        this.$message({ message: "两次密码输入不一致！", type: "warning" });
        return;
      }
      let json = {
          id: this.id,
          username: this.form.username,
          account: this.form.account,
          password: this.form.password,
          mobile: this.form.mobile,
          tel: this.form.tel,
          email: this.form.email,
          remarks: this.form.desc
        },
        addJson = {
          username: this.form.username,
          account: this.form.account,
          password: this.form.password,
          mobile: this.form.mobile,
          tel: this.form.tel,
          email: this.form.email,
          remarks: this.form.desc
        };
      if (this.title == "修改") {
        http("/user/editKwuser", "post", json).then(res => {
          if (res == "修改成功！") {
            this.centerDialogVisible = false;
            this.$message({ message: res, type: "success" });
            this.getTableData();
          }
        });
      } else {
        http("/user/addKwuser", "post", addJson).then(res => {
          if (res == "添加成功！") {
            this.centerDialogVisible = false;
            this.$message({ message: res, type: "success" });
            this.getTableData();
          }
        });
      }
    },
    deletes(index, row) {
      let json = {
        id: row.id
      };
      this.$confirm("确定要删除吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          http("/user/delKwuser", "post", json).then(res => {
            this.getTableData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="less" scoped>
.block {
  text-align: right;
}
</style>
