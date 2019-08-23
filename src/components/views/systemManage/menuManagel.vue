<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <el-form :inline="true" :model="addInput" class="demo-form-inline standMessage">
      <el-form-item>
        <el-button type="danger" @click="deleteSome">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="addInput.name" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="addInput.perurl" placeholder="菜单地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input clearable v-model="addInput.orders" placeholder="菜单排序"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="standMessage"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column
        v-for="item in theadText"
        :key="item.value"
        :prop="item.prop"
        :label="item.name"
      ></el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" @click="handleSubmenu(scope.$index, scope.row)">子菜单</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="tiTitle" :visible.sync="dialogVisible" width="30%" center>
      <el-form ref="form" label-width="80px" :model="form">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址">
          <el-input v-model="form.perurl"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序">
          <el-input v-model="form.orders"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateSuccess">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="tiTitle" :visible.sync="submenu" width="70%" center>
      <el-form :inline="true" :model="submenuInput" class="demo-form-inline standMessage">
        <el-form-item>
          <el-button type="danger" @click="deleteSome">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="submenuInput.name" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="submenuInput.perurl" placeholder="菜单地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="submenuInput.orders" placeholder="菜单排序"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="menuAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="submenuDatas"
        style="width: 100%"
        class="standMessage"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          v-for="item in theadText"
          :key="item.value"
          :prop="item.prop"
          :label="item.name"
        ></el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pages @getTableData="submenuData" :tableData="submenuDatas" :totalData="totalMenu"></pages>
    </el-dialog>
    <pages @getTableData="getTableData" :tableData="tableData" :totalData="totalData"></pages>
  </div>
</template>


<script>
import bread from "../../../components/common/bread";
import pages from "../../../components/common/pages";
import { http } from "../../../api/http";

export default {
  data() {
    return {
      updateId: "",
      submenuId: "",
      multipleSelection: [],
      totalData: 10,
      totalMenu: 10,
      tiTitle: "",
      addInput: {
        name: "",
        perurl: "",
        orders: ""
      },
      form: {
        name: "",
        perurl: "",
        orders: ""
      },
      submenuInput: {
        name: "",
        perurl: "",
        orders: ""
      },
      nowLocation: ["系统管理", "菜单管理"],
      tableData: [],
      submenuDatas: [],
      submenu: false,
      dialogVisible: false,
      theadText: [
        { name: "菜单名称", prop: "name", value: "name" },
        { name: "菜单地址", prop: "perurl", value: "perurl" },
        { name: "菜单排序", prop: "orders", value: "orders" }
      ]
    };
  },
  components: { bread, pages },
  created() {
    this.getTableData();
  },
  methods: {
    //父菜单
    getTableData(currentPage, pageSize) {
      let json = {
        parentid: "0",
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/Kwmenu/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    add() {
      if (
        this.addInput.name == "" ||
        this.addInput.perurl == "" ||
        this.addInput.orders == ""
      ) {
        this.$message({ message: "菜单输入框不能为空！", type: "warning" });
        return;
      }
      let json = {
        parentid: "0",
        name: this.addInput.name,
        perurl: this.addInput.perurl,
        orders: this.addInput.orders
      };
      http("/Kwmenu/addKwmenu", "post", json).then(res => {
        if (res == "添加成功！") {
          this.$message({ message: res, type: "success" });
          this.addInput.name = "";
          this.addInput.perurl = "";
          this.addInput.orders = "";
          this.getTableData();
          this.dialogVisible = false;
        }
        console.log(res);
      });
    },
    updateSuccess() {
      let json = {
        id: this.updateId,
        name: this.form.name,
        perurl: this.form.perurl,
        orders: this.form.orders
      };
      http("/Kwmenu/editKwmenu", "post", json).then(res => {
        if (res == "修改成功！") {
          this.$message({ message: res, type: "success" });
          this.getTableData();
          this.submenuData();
          this.dialogVisible = false;
        }
      });
    },
    handleUpdate(index, row) {
      this.updateId = row.id;
      this.tiTitle = "修改";
      this.dialogVisible = true;
      this.form.name = row.name;
      this.form.perurl = row.perurl;
      this.form.orders = row.orders;
    },
    //父菜单 复选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSome() {
      if (this.multipleSelection.length == 0) {
        this.$message({ message: "请选择你要删除到菜单！", type: "warning" });
        return;
      }
      let arr = [];
      for (let i = 0, len = this.multipleSelection.length; i < len; i++) {
        arr.push(this.multipleSelection[i].id);
      }
      let id = arr.join(",");
      console.log(id);
      let json = {
        ids: id
      };
      http("/Kwmenu/delKwmenuList", "post", json).then(res => {
        if (res == "删除成功！") {
          this.$message({ message: res, type: "success" });
          this.getTableData();
          this.submenuData();
        }
        console.log(res);
      });
    },
    handleDelete(index, row) {
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
          http("/Kwmenu/delKwmenu", "post", json).then(res => {
            this.getTableData();
            this.submenuData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //子菜单
    menuAdd() {
      let json = {
        parentid: this.submenuId,
        name: this.submenuInput.name,
        perurl: this.submenuInput.perurl,
        orders: this.submenuInput.orders
      };
      console.log(json);
      http("/Kwmenu/addKwmenu", "post", json).then(res => {
        if (res == "添加成功！") {
          this.$message({ message: res, type: "success" });
          this.submenuInput.name = "";
          this.submenuInput.perurl = "";
          this.submenuInput.orders = "";
          this.submenuData();
          this.dialogVisible = false;
        }
        console.log(res);
      });
    },
    handleSubmenu(index, row) {
      this.tiTitle = "子菜单";
      this.submenu = true;
      this.submenuId = row.id;
      this.submenuData();
    },
    submenuData(currentPage, pageSize) {
      let json = {
        parentid: this.submenuId,
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/Kwmenu/findAllPageByConditions", "post", json).then(res => {
        this.submenuDatas = res.records;
        this.totalMenu = res.total;
      });
    }
  }
};
</script>


<style lang="less" scoped>
.block {
  text-align: right;
}
</style>



