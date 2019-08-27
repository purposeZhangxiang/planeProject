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
          node-key="label"
          default-expand-all
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
                  <el-select v-model="form.region" placeholder="请选择" style="width:100%;" clearable>
                    <el-option
                      v-for="(item,index) in departOptions"
                      :key="index"
                      :label="item.username"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注" label-width="100px">
                  <el-input type="textarea" v-model="form.bz" clearable></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="saveForm">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="人员信息" name="second">
              <!-- operate-bar -->
              <div class="table-bar">
                <el-form>
                  <el-form-item>
                    <el-button type="primary" @click="checkPerson">选择人员</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!-- table -->
              <el-table :data="tableData" border @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
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
    <el-dialog title="新增" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="dialogForm">
        <el-form-item label="部门名称" label-width="120px">
          <el-input v-model="dialogForm.name" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" label-width="120px">
          <el-select v-model="dialogForm.region" placeholder="请选择" style="width:100%" clearable>
            <el-option
              v-for="(item,index) in departOptions"
              :key="index"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" v-model="dialogForm.bz" clearable></el-input>
        </el-form-item>
      </el-form>
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
      treeData: [
        {
          label: 611
        }
      ],
      defaultProps: [],
      //tree end
      activeName: "first", //tab默认
      form: {},
      departOptions: [],
      tableData: [],
      multipleSelection: [], //已勾选列
      thead: [
        { label: "人员名称", prop: "account" },
        { label: "登陆账户", prop: "username" }
      ],
      //   dialog
      dialogFormVisible: false,
      dialogForm: {}
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
     * @method {reshowChecked} 回显已勾选
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
        debugger;
        this.treeData = res;
      });
    },
    getPersonList() {
      http("/user/deptfindAllList", "post").then(res => {
        this.tableData = res;
        this.departOptions = res;
      });
    },
    reshowChecked() {},
    checkPerson() {},
    add() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleDelete() {},
    nodeTable() {},
    handleClick(tab, event) {
      if (tab.paneName == "second") {
      }
    },
    saveForm() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogOk() {}
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
    .form {
      width: 50%;
      min-width: 300px;
    }
  }
}
</style>