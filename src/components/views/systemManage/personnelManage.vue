<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <el-form :inline="true" :model="searchInput" class="searchInput standMessage">
      <el-form-item>
        <el-select clearable v-model="searchInput.condition">
          <el-option v-for="(item,index) in theadText" :key="index" :label="item.name" :value="item.value"></el-option>
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
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-for="(item,index) in theadText" :prop="item.prop" :label="item.name" :key="index">
        </el-table-column>
        <el-table-column label="操作" width="232">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="updata(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" plain @click="updatePass(scope.$index, scope.row)">修改密码</el-button>
            <el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="title" :visible.sync="centerDialogVisible" width="30%">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="人员姓名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="登陆账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="移动电话" prop="tel">
          <el-input v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uSubmint">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" width="30%">
      <el-form ref="modifyPassForm" :model="modifyPassForm" label-width="80px" :rules="modifyRules">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="modifyPassForm.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="enterPassword">
          <el-input v-model="modifyPassForm.enterPassword" type='password'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyPass">确 定</el-button>
      </span>
    </el-dialog>
    <pages class="standMessage" @getTableData="getTableData" :tableData="tableData" :totalData="totalData"></pages>
  </div>
</template>

<script>
  import bread from "../../../components/common/bread";
  import pages from "../../../components/common/pages";
  import {
    http
  } from "../../../api/http";

  const isTelphone = (rule, value, callback) => {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    !value ? callback() : !reg.test(value) ? callback(new Error(
      "请输入正确的11位手机号码")) : callback();
  }
  const isEmail = (rule, value, callback) => {
    const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    !value ? callback() : !mailReg.test(value) ?
      callback(new Error("请输入正确的电子邮箱")) : callback();
  }
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
        modifyPassForm: {
          password: "",
          enterPassword: "",
        },
        title: "",
        centerDialogVisible: false,
        modifyPasswordVisible: false,
        rules: {
          username: [{
              required: true,
              message: '用户名不能为空',
              trigger: "blur"
            },
            {
              message: "最多支持输入32个字符",
              max: 32,
              trigger: "blur"
            }
          ],
          account: [{
              required: true,
              message: "登录账户不能为空",
              trigger: "blur"
            },
            {
              max: 32,
              message: "最多支持输入32个字符",
              trigger: "blur"
            }
          ],
          tel: [{
            trigger: "blur",
            validator: isTelphone
          }],
          mobile: [{
            trigger: "blur",
            validator: isTelphone
          }],
          email: [{
            trigger: "blur",
            validator: isEmail
          }],
        },
        modifyRules: {
          password: [{
              required: true,
              message: '新密码不能为空',
              trigger: "blur"
            },
            {
              message: "最多支持输入32个字符",
              max: 32,
              trigger: "blur"
            }
          ],
          enterPassword: [{
              required: true,
              message: '确认密码不能为空',
              trigger: "blur"
            },
            {
              message: "最多支持输入32个字符",
              max: 32,
              trigger: "blur",
              trigger: "blur"
            }
          ],
        },
        theadText: [{
            name: "人员姓名",
            value: "username",
            prop: "username"
          },
          {
            name: "登陆账号",
            value: "account",
            prop: "account"
          },
          {
            name: "固定电话",
            value: "mobile",
            prop: "mobile"
          },
          {
            name: "移动电话",
            value: "tel",
            prop: "tel"
          },
          {
            name: "电子邮箱",
            value: "email",
            prop: "email"
          }
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
        this.form = {};
        this.$refs.form.clearValidate();
      },
      updatePass(index, row) {
        this.modifyPasswordVisible = true;
        this.modifyPassForm = {};
        this.form = {
          ...row
        };
        this.$refs.modifyPassForm.clearValidate();
      },
      modifyPass() {
        this.$refs.modifyPassForm.validate(validate => {
          if (!validate) {
            return this.$message({
              message: "请输入正确数据后,在点击确定按钮",
              type: "error"
            });
          }
          if (this.modifyPassForm.password != this.modifyPassForm.enterPassword) {
            this.$message({
              message: "两次输入的密码不一致",
              type: "error"
            });
            return
          }
          this.form.password = this.modifyPassForm.password;
          this.form.enterPassword = this.modifyPassForm.enterPassword;
          http("/user/editKwuser", "post", {
            ...this.form
          }).then(res => {
            this.modifyPasswordVisible = false;
            const {
              account
            } = sessionStorage.getItem("curentUser");
            if (account == this.form.account) {
              this.$message({
                message: "密码修改成功,请重新登录",
                type: "success",
                time: 1000
              });
              setTimeout(e => {
                window.location.href = "/login.html";
              }, 1000)
            } else {
              this.$message({
                message: "密码修改成功",
                type: "success"
              });
            }
          });
        });
      },
      updata(index, row) {
        this.title = "修改";
        this.centerDialogVisible = true;
        this.$refs.form.clearValidate();
        this.form = {
          ...row
        };
      },
      uSubmint() {
        this.$refs.form.validate(validate => {
          if (!validate) {
            return this.$message({
              message: "请录入正确数据后,再点击确定按钮",
              type: "error"
            });
          }
          var item = {
            ...this.form
          };
          item.remarks = item.desc;
          delete(item.enterPassword);
          delete(item.desc);
          const callback = (res) => {
            this.centerDialogVisible = false;
            this.$message({
              message: res,
              type: "success"
            });
            this.getTableData();
          }
          http(item.id ? "/user/editKwuser" : "/user/addKwuser", "post", item).then(callback);
        })

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