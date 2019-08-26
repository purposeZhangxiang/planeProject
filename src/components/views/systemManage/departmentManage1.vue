<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <div class="standMessage el-tree-demo">
      <div class="el-tree-h">
        <h3>
          <i class="el-icon-share"></i>
          {{message}}
        </h3>
        <el-tree
          :data="data"
          :highlight-current="current"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div style="width:85%;">
        <div class="addMenu">
          <h4>新增菜单</h4>
          <div class="el-button-val">
            <div v-if="data == null">
              <el-switch
                v-model="value2"
                style="margin: 0 0 0 15px"
                @change="hanldChanget"
                inactive-text="添加子部门"
              ></el-switch>
            </div>
            <div v-else>
              <el-switch
                v-model="value1"
                @change="hanldChangeo"
                style="margin: 0 40px 0 15px"
                inactive-text="添加同级部门"
              ></el-switch>
              <el-switch
                v-model="value2"
                @change="hanldChanget"
                style="margin: 0 0 0 15px"
                inactive-text="添加子部门"
              ></el-switch>
            </div>
          </div>
        </div>
        <div v-if="value1 == true || value2 == true">
          <h1>111111</h1>
        </div>
        <div v-else class="addMenu personnel">
          <h4>
            已选人员&nbsp;&nbsp;
            <el-button size="mini" plain @click="personnelSelection">人员选择</el-button>
          </h4>
          <div v-if="presonData.length > 0" style="overflow-y: scroll;height: 350px;">
            <div class="standMessage">
              <el-table
                ref="multipleTable"
                :data="presonData"
                tooltip-effect="dark"
                style="width: 100%"
              >
                <el-table-column
                  v-for="(item,index) in theadText"
                  :key="index"
                  :label="item.name"
                  :prop="item.prop"
                ></el-table-column>
                <el-table-column label="操作" width="240" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="height: 100px;line-height: 100px" v-else>
            <h2>请选择人员!</h2>
          </div>
        </div>
        <div class="addMenu">
          <h4>部门信息</h4>
          <div class="menuMessage department">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="部门名称">
                <el-input size="small" clearable v-model="formInline.user" placeholder="部门名称"></el-input>
              </el-form-item>
              <el-form-item label="部门负责人" style="width: 50%">
                <el-select v-model="formInline.region" multiple style="width: 400px">
                  <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item.username"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="el-formItem">
                <el-form-item label="注释">
                  <el-input type="textarea" v-model="formInline.desc"></el-input>
                </el-form-item>
              </div>
              <el-col v-if="value1 == true || value2 == true" :span="12" style="text-align: center">
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-col>
              <el-col v-else :span="12" style="text-align: center">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button type="danger" @click="onDelete">删除</el-button>
              </el-col>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="人员选择" :visible.sync="dialogVisible" width="30%" center>
      <div class="standMessage">
        <el-table
          ref="table"
          :data="tableData"
          class="multipleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column
            v-for="(item,index) in theadText"
            :key="index"
            :label="item.name"
            :prop="item.prop"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Psuccess">确 定</el-button>
      </span>
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
      title: "",
      id: "",
      parentid: "",
      sectionId: "",
      message: "611所",
      nowLocation: ["系统管理", "部门管理"],
      data: [],
      select: [],
      presonData: [],
      tableData: [],
      multipleSelection: [],
      options: [],
      dialogVisible: false,
      current: true,
      value1: false,
      value2: false,
      formInline: {
        user: "",
        region: "",
        desc: ""
      },
      defaultProps: {
        children: "children",
        label: "NAME",
        id: "ID"
      },
      theadText: [
        {
          name: "人员选择",
          value: "username",
          prop: "username"
        }
      ]
    };
  },
  mounted() {
    this.tree();
    this.principal();
  },
  methods: {
    tree() {
      http("/dept/findDeptTree", "post").then(res => {
        this.data = res;
      });
    },
    //部门负责人
    principal() {
      http("/user/deptfindAllList", "post").then(res => {
        this.options = res;
      });
    },
    handleNodeClick(data) {
      this.value1 = false;
      this.value2 = false;
      this.id = data.ID;
      this.sectionId = data.ID;
      http("/dept/getKwdeptById", "get", { id: data.ID }).then(res => {
        let arr = [];
        if (res.listmanager != null) {
          for (let i = 0, len = res.listmanager.length; i < len; i++) {
            arr.push(res.listmanager[i].id);
          }
          this.formInline.region = arr;
        } else {
          this.formInline.region = [];
        }
        this.parentid = res.parentid;
        this.formInline.user = res.name;
        this.formInline.region = arr;
        res.user == null
          ? (this.presonData = [])
          : (this.presonData = res.user);
      });
      this.select = data;
    },
    onSubmit() {
      this.formInline.user == "" || this.formInline.region == ""
        ? this.$message({
            message: "部门名称或部门负责人不能为空!",
            type: "warning"
          })
        : false;
      if (this.select.ID == undefined) {
        this.select.ID = 0;
      } else {
        this.select.ID = this.select.ID;
      }
      let type,
        id,
        selectId = this.select.ID;
      if (this.value1 != true || this.value2 != true) {
        type = null;
      }
      if (this.value1 == true) {
        type = "1";
        selectId = this.select.ID;
      }
      if (this.value2 == true) {
        type = "2";
        selectId = this.select.ID;
      }
      if (type == null) {
        id = selectId;
        selectId = this.parentid;
      } else {
        id = "";
        selectId = this.select.ID;
      }
      let arr = [],
        reg = [];
      for (let i = 0, len = this.presonData.length; i < len; i++) {
        arr.push(this.presonData[i].id);
      }
      let userid = arr.join(",");
      reg.push(this.formInline.region);
      for (let i = 0, len = reg.length; i < len; i++) {
        reg = reg[i].join(",");
      }
      if (this.value1 == false || this.value2 == false) {
        if (this.formInline.user == "" || this.formInline.region == "") {
          this.$message({
            message: "请输入部门名称或选择部门负责人!",
            type: "warning"
          });
          return;
        }
      } else {
        if (type == null || selectId == "") {
          this.$message({
            message: "请点击部门,选择你要添加的部门！",
            type: "warning"
          });
          return;
        }
      }

      let json = {
        name: this.formInline.user,
        type: type,
        parentid: selectId,
        manager: reg,
        alias: this.formInline.desc,
        userid: userid,
        id: id
      };
      http("/dept/addKwdept", "post", json).then(res => {
        if (res == "操作成功！") {
          this.$message({ message: res, type: "success" });
          this.empty();
          this.tree();
        }
      });
      if (this.formInline.user == "" || this.formInline.region == "") {
        this.$message({
          message: "请输入部门名称或选择部门负责人!",
          type: "error"
        });
        return;
        if (!(this.value1 || this.value2)) {
          this.$message({ message: "请选择部门!", type: "error" });
          return false;
        }
      }
    },
    onDelete() {
      let json = {
        id: this.id
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
          http("/dept/delKwdept", "post", json).then(res => {
            this.tree();
            this.empty();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    hanldChangeo() {
      this.value1 ? (this.value2 = false) : (this.value1 = true);
      this.empty();
    },
    hanldChanget() {
      this.value2 ? (this.value1 = false) : (this.value2 = true);
      this.empty();
    },
    handleDelete(index, row) {
      this.presonData.splice(index, 1);
    },
    personnelSelection() {
      this.dialogVisible = true;
      http("/user/deptfindAllList", "post").then(res => {
        this.tableData = res;
        this.reshow();
      });
    },
    reshow() {
      let newArr = [];
      for (let index in this.tableData) {
        for (let val of this.presonData) {
          if (val.id === this.tableData[index].id) {
            newArr.push(this.tableData[index]);
          }
        }
      }
      this.$nextTick(() => {
        newArr.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      });
    },
    Psuccess() {
      this.dialogVisible = false;
      this.presonData = this.multipleSelection;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    empty() {
      this.presonData = [];
      this.formInline = {
        user: "",
        region: [],
        desc: ""
      };
    }
  }
};
</script>

<style>
.el-tree-demo {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.el-tree-h {
  display: flex;
  flex-direction: column;
  width: 15%;
}

.el-tree-h h3 {
  margin: 0;
  padding-left: 8px;
  margin-top: 4px;
  margin-bottom: 10px;
}

.el-dialog__body {
  padding-top: 0 !important;
}

.addMenu h4 {
  padding-left: 10px;
  background-color: #eeeeee;
  height: 30px;
  line-height: 30px;
}

.personnel h4 {
  margin-bottom: 10px;
  height: 40px;
  line-height: 40px;
}

.el-button-val div {
  display: inline-block;
}

.addMenu .el-button-val {
  height: 40px;
  line-height: 40px;
}

.department {
  margin-top: 15px;
  padding-left: 10px;
}

.el-formItem {
  width: 600px;
}

.el-formItem .el-form-item {
  width: 100%;
}

.el-formItem .el-form-item__content {
  width: 88%;
}

.el-formItem textarea {
  letter-spacing: 0.5px;
  height: 150px;
}

.el-select-dropdown__list {
  overflow-y: scroll;
  height: 200px;
}

.multipleTable {
  height: 400px;
}

.multipleTable .el-table__body-wrapper {
  overflow-y: scroll;
  height: 400px;
}
</style>
