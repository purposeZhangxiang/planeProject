<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <div class="standMessage">
      <el-form :inline="true" :model="form" class="demo-form-inline"  ref="form">
        <el-form-item label="角色名称" >
          <el-input clearable size="middle" v-model="form.username" placeholder="请输入角色名称"  ></el-input>
        </el-form-item>
        <el-form-item label="角色备注" >
          <el-input clearable size="middle" v-model="form.remarks" placeholder="可选输入角色备注" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch()">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="standMessage">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column
          v-for="(item,index) in theadText"
          :prop="item.prop"
          :label="item.name"
          :key="index"
        ></el-table-column>
        <el-table-column label="所属人员" prop="user" :formatter="getfor"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain @click="edit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" plain @click=" jobPlacent(scope.$index, scope.row)">设置人员</el-button>
            <el-button
              size="mini"
              type="warning"
              plain
              @click="setPermission(scope.$index, scope.row)"
            >设置权限</el-button>
            <el-button size="mini" type="danger" @click="deletes(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="tiTitle" :visible.sync="dialogVisible" width="30%" >
      <div class="standMessage">
        <div v-if="title == 'table'" class="standMessage">
          <el-table
            ref="table"
            highlight-current-row
            :data="personData"
            class="multipleTable"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column
              v-for="(item,index) in personText"
              :key="index"
              :label="item.name"
              :prop="item.prop"
            ></el-table-column>
          </el-table>
        </div>
        <div v-else class="standMessage">
          <el-form ref="form" label-width="80px" :model="formLabelAlign"   :rules="rules">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="formLabelAlign.name"></el-input>
            </el-form-item>
            <el-form-item label="角色备注" prop="remarks">
              <el-input v-model="formLabelAlign.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Psuccess">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="tiTitle" :visible.sync="treeVisible" width="30%">
      <el-tree
        :data="dataTree"
        ref="treeForm"
        :check-strictly="true"
        :highlight-current="true"
        @check-change="handleClick"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treeVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSuccess">确 定</el-button>
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
import Pages from "../../common/pages";
import { http } from "../../../api/http";

export default {
  data() {
    return {
      username: "",
      dialogVisible: false,
      treeVisible: false,
      totalData: 10,
      id: "",
      editId: "",
      setPermissionId: "",
      checkedId: "",
      title: "",
      tiTitle: "",
      tableData: [],
      personData: [],
      rowData: [],
      theadText: [
        { name: "角色名称", prop: "name" },
        { name: "角色备注", prop: "remarks" }
      ],
      personText: [],
      nowLocation: ["系统管理", "角色管理"],
      multipleSelection: [],
      dataTree: [],
      defaultProps: {
        children: "children",
        label: "NAME"
      },
      form: {
        username: "",
        remarks: ""
      },
      formLabelAlign: {
        name: "",
        remarks: ""
      },
      rules:{
        name:[{required:true,message:"角色名必填"},{
          max:32,message:"最多输入32字符",trigger: "blur"
        }],
        remarks:[{max:256,message:"最多输入256个字符",trigger:"blur"}]
      }
    };
  },
  components: {
    Pages,
    bread
  },
  created() {
    this.getTableData();
  },
  methods: {
    //初始化分页
    getTableData(currentPage, pageSize) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/kwrole/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    //搜索
    handleSearch(currentPage=1,pageSize=10){
      let json = {
        currentPage,
        pageSize,
        name:this.form.username,
        remarks:this.form.remarks,
      };
      http("/kwrole/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    //新增
    submitForm() {
      this.edit(-1,{});
      this.tiTitle = "新增";
    },
    //设置人员
    jobPlacent(index, row) {
      this.tiTitle = "设置人员";
      this.title = "table";
      this.id = row.id;
      this.rowData = row;
      this.dialogVisible = true;
      let json = { currentPage: 1, pageSize: 100000 };
      this.personText = [
        { name: "人员姓名", prop: "username" },
        { name: "登陆账号", prop: "account" }
      ];
      http("/user/findAllPageByConditions", "post", json).then(res => {
        this.personData = res.records;
        this.reshow();
      });
    },
    /**
     * title 判断属性
     * @constructor
     */
    //新增 taleJson
    //修改 editJson
    Psuccess() {
      let arr = [];
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        arr.push(this.multipleSelection[i].id);
      }
      let selectionId = arr.join(",");
      let tableJson = {
          roleid: this.id,
          userid: selectionId
        },
        editJson = {
          id: this.editId,
          name: this.formLabelAlign.name,
          remarks: this.formLabelAlign.remarks
        };
      if (this.title == "table") {
        http("/kwrole/updateKwroleuser", "post", tableJson).then(res => {
          if (res == "修改人员成功！") {
            this.dialogVisible = false;
            this.getTableData();
            this.$message({ message: res, type: "success"});
          }
        });
      } else {
        this.$refs.form.validate(validate=>{
            if(!validate){
                return this.$message("请确认输入的数据正确后,再点击确定按钮","error");
            }
            var call = ()=>{
                  this.dialogVisible = false;
                  this.getTableData();
                  this.$message({ message: res, type: "success" });
            }
            if(this.rowData.name){
              http("/kwrole/editKwrole", "post", editJson).then(res => {
                 res == "修改成功！" && call(res);
              });
            }else{
              http("/kwrole/addKwrole", "post", editJson).then(res => {
                res == "添加成功！" && call(res);
              });
            }
        })
      }
    },
    //复选框回显
    reshow() {
      let newArr = [];
      for (let index in this.personData) {
        for (let val of this.rowData.user) {
          if (val.id === this.personData[index].id) {
            newArr.push(this.personData[index]);
          }
        }
      }
      this.$nextTick(() => {
        newArr.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      });
    },
    //设置权限
    setPermission(index, row) {
      this.setPermissionId = row.id;
      this.tiTitle = "设置权限";
      this.treeVisible = true;
      http("/kwpermission/findpertree", "post").then(res => {
        this.dataTree = res;
      });
    },
    editSuccess() {
      let json = {
        roleid: this.setPermissionId,
        perid: this.checkedId
      };
      http("/kwrole/updateKwroleper", "post", json).then(res => {
        if (res == "修改角色权限成功！") {
          this.$message({ message: res, type: "success" });
        }
      });
    },
    handleClick(data, checked) {
      let tree = this.$refs.treeForm.getCheckedNodes(false, true),
        arr = [];
      for (let i = 0, len = tree.length; i < len; i++) {
        arr.push(tree[i].ID);
      }
      let newArr = arr.join(",");
      this.checkedId = newArr;
    },
    //删除
    deletes(index, row) {
      let json = {
        id: row.id
      };
      this.$confirm("确定要删除吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          http("/kwrole/delKwrole", "post", json).then(res => {
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
    edit(index, row) {
      this.tiTitle = "编辑";
      this.editId = row.id;
      this.title = "edit";
      this.dialogVisible = true;
      this.formLabelAlign.name = row.name;
      this.formLabelAlign.remarks = row.remarks;
      this.personText = [
        { name: "角色名称", prop: "name" },
        { name: "角色备注", prop: "remarks" }
      ];
    },
    getfor(row, column) {
      let role = [];
      for (let i = 0, len = row.user.length; i < len; i++) {
        role.push(row.user[i].username);
      }
      return role.join(",");
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
