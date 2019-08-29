<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <div class="section">
      <div class="treeBox">
        <div class="operated">
          <el-form :inline="true">
            <el-form-item>
              <el-button size="middle" type="primary" @click="add">新增</el-button>
              <el-button size="middle" type="danger" @click="handleDelete">删除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeTable"
          node-key="name"
          :expand-on-click-node="false"
          default-expand-all
          ref="tree"
        ></el-tree>
      </div>
      <div class="infoBox">
        <div class="tab">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="部门信息" name="first">
              <!-- form -->
              <el-form ref="form" :model="form" label-width="100px" class="form">
                <el-form-item label="部门名称">
                  <el-input v-model="form.name" clearable></el-input>
                </el-form-item>
                <el-form-item label="部门负责人">
                  <el-select
                    v-model="form.manager"
                    placeholder="请选择"
                    style="width:100%;"
                    multiple
                    clearable
                  >
                    <el-option
                      v-for="(item,index) in departOptions"
                      :key="index"
                      :label="item.username"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                  <el-input type="textarea" v-model="form.alias" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveForm">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="部门内人员信息" name="second">
              <!-- operate-bar -->
              <div class="table-bar">
                <el-form>
                  <el-form-item>
                    <el-button type="primary" @click="checkPerson">选择人员</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!-- table -->
              <el-table :data="tableData" border>
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column
                  v-for="(item,index) in thead"
                  :key="index"
                  :prop="item.prop"
                  :label="item.label"
                ></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="40%">
      <!-- 新增部门 -->
      <el-form v-if="dialogTitle=='新增部门' " :model="dialogForm" :rules="rules" ref="ruleForm">
        <el-form-item label="部门名称" label-width="120px" prop="name">
          <el-input v-model="dialogForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" label-width="120px">
          <el-select
            v-model="dialogForm.manager"
            placeholder="请选择"
            style="width:100%"
            clearable
            multiple
          >
            <el-option
              v-for="(item,index) in departOptions"
              :key="index"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" v-model="dialogForm.alias" clearable></el-input>
        </el-form-item>
      </el-form>
      <!-- 选择人员 -->
      <el-table
        v-if="dialogTitle=='选择人员' "
        :data="dialogtableData"
        border
        @selection-change="handleSelectionChange"
        ref="table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item,index) in thead"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        ></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import bread from "../../../components/common/bread";
import { http } from "../../../api/http";

export default {
  components: { bread },
  data() {
    return {
      nowLocation: ["系统管理", "部门管理"],
      //tree
      treeData: [],
      defaultProps: {
        label: "NAME",
        children: "children"
      },
      //tree end
      activeName: "first", //tab默认
      //form
      form: {
        name: "",
        manager: [],
        alias: ""
      },
      departOptions: [],
      tableData: [],
      multipleSelection: [], //table已勾选列
      thead: [
        { label: "人员名称", prop: "account" },
        { label: "登陆账户", prop: "username" }
      ],
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
      },
      //   dialog
      dialogTitle: "",
      dialogFormVisible: false,
      dialogForm: {
        alias: "",
        manager: [],
        name: ""
      },
      dialogtableData: []
    };
  },
  created() {
    this.getTree();
    this.getPersonList();
  },
  mounted() {},
  methods: {
    /**
     * @method {getTree}  请求树
     * @method {getPersonList} 请求人员列表
     * @method {checkPerson}   选择人员
     * @method {add}           新增部门触发模态框打开
     * @method {handleDelete}  删除部门
     * @method {nodeTable}     点击树节点回调
     * @method {handleClick}   点击tab回调
     * @method {saveForm}      保存按钮
     * @method {handleSelectionChange} checkbox回调
     * @method {dialogOk}      模态框确定按钮
     */
    getTree() {
      http("/dept/findDeptTree", "post").then(res => {
        this.treeData = res;
      });
    },
    getPersonList() {
      http("/user/deptfindAllList", "post").then(res => {
        this.dialogtableData = res;
        this.departOptions = res;
      });
    },
    checkPerson() {
      this.dialogTitle = "选择人员";
      this.dialogFormVisible = !this.dialogFormVisible;
      this.reshowDialogTable();
    },
    add() {
      //判断是否有点击选中的树节点
      if (!this.$refs.tree.getCurrentNode()) {
        this.$message.warning("请先选择树节点,再做新增操作");
        return;
      }
      this.dialogTitle = "新增部门";
      this.dialogForm.parentid = this.$refs.tree.getCurrentNode().ID;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleDelete() {
      if (!this.$refs.tree.getCurrentNode()) {
        this.$message.warning("请先选择树节点,再做删除操作");
      } else if (this.$refs.tree.getCurrentNode().ID == "0") {
        this.$message.warning("根节点无法删除");
      } else {
        //delete
        let currentNodeId = this.$refs.tree.getCurrentNode().ID;
        http("/dept/delKwdept", "post", { id: currentNodeId }).then(res => {
          this.$message.success(res);
          this.getTree();
        });
      }
    },
    nodeTable(data, node, label) {
      http("/dept/getKwdeptById", "get", { id: data.ID }).then(res => {
        this.reshowOption(res);
        //存下表格数据等待切换表格tab时候进行回显
        this.storeTable = res.user;
      });
    },
    reloadUser(data) {
      http("/dept/getKwdeptById", "get", { id: data.ID }).then(res => {
        this.reshowOption(res);
        //存下表格数据等待切换表格tab时候进行回显
        this.storeTable = res.user;
        this.reshowTable();
      });
    },
    //reshowOptions
    reshowOption(data) {
      let manager = [];
      for (let index in data.listmanager) {
        manager.push(data.listmanager[index].username);
      }
      let obj = {
        name: data.name,
        manager,
        alias: data.alias
      };
      Object.assign(this.form, obj);
    },
    //reshowTable(外层表格)
    reshowTable() {
      this.tableData = this.storeTable;
    },
    reshowDialogTable() {
      if (this.storeTable) {
        this.$nextTick(() => {
          this.clearSelection();

          let newArr = [];
          for (let index in this.dialogtableData) {
            for (let val of this.storeTable) {
              if (val.id === this.dialogtableData[index].id) {
                newArr.push(this.dialogtableData[index]);
              }
            }
          }
          newArr.forEach(row => {
            this.$refs.table.toggleRowSelection(row);
          });
        });
      }
    },
    clearSelection() {
      this.$refs.table.clearSelection();
    },
    handleClick(tab, event) {
      //判断是否有点击选中的树节点
      if (!this.$refs.tree.getCurrentNode()) {
        this.$message.warning("请先选择树节点,再做新增操作");
        return;
      }
      if (tab.paneName == "second") {
        this.reshowTable();
      }
    },
    saveForm() {
      //deal and sumbit
      let param = JSON.parse(JSON.stringify(this.form));
      param.manager = param.manager.join(",");
      param.id = this.$refs.tree.getCurrentNode().ID;
      http("/dept/addKwdept", "post", param).then(res => {
        this.$message.success(res);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogOk() {
      if (this.dialogTitle == "新增部门") {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            //detal and submit
            let json = {
              parentid: this.dialogForm.parentid,
              name: this.dialogForm.name,
              manager: this.dialogForm.manager.join(","),
              alias: this.dialogForm.alias
            };
            http("/dept/addKwdept", "post", json).then(res => {
              this.$message.success(res);
              this.getTree();
              this.dialogFormVisible = !this.dialogFormVisible;
            });
          } else {
            return false;
          }
        });
      } else if (this.dialogTitle == "选择人员") {
        if (!this.$refs.tree.getCurrentNode()) {
          this.$message.warning("请先选择部门树节点");
          return;
        }
        let deptid = this.$refs.tree.getCurrentNode().ID;
        let userid = [];
        for (let val of this.multipleSelection) {
          userid.push(val.id);
        }
        http("/dept/addKwdeptuser", "post", {
          deptid,
          userid: userid.join(",")
        }).then(res => {
          this.$message.success(res);
          this.dialogFormVisible = !this.dialogFormVisible;
          this.reloadUser({ ID: deptid });
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.section {
  display: flex;
  padding: 10px 0;
  .treeBox {
  }
  .infoBox {
    flex: 1;
    padding-left: 10px;
    // border-left: 1px solid #ccc;
    .form {
      width: 50%;
      min-width: 300px;
    }
  }
}
</style>

<style lang="less">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
}
</style>