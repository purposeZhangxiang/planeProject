<template>
  <div class="box">
    <!-- 面包屑 -->
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- 搜索框 -->
    <el-form :inline="true" :model="formInline" class="searchInput">
      <el-form-item>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteSome">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="请输入关键字搜索"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
      <el-table-column prop="address" label="地址" width="220"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="page" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 30, 50]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData"
      ></el-pagination>
    </div>
    <!-- 模态框/弹层 -->
    <el-dialog :title="modalTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="yes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "../../util/mixin.js";
import {http} from "../../api/http";
export default {
  mixins: [mixin],
  data() {
    return {
      nowLocation: ["分组一","列表"], //面包屑导航当前位置
      multipleSelection: [], //已被勾选项
      currentPage: 1, //分页器当前页
      totalData: 50, //分页器总数据条数
      dialogFormVisible: false, //模态框打开/关闭状态
      modalTitle: "", //模态框标题文字
      addOrEdit: "", //模态框状态(新增/编辑)
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "120px",
    };
  },
  components: {
    breadNav: () => import("../common/bread.vue"),
    commTable: () => import("../common/table.vue")
  },
  created() {
    // http("/test/en");
  },
  methods: {
    /**
     * @method toggleSelection 全选/反选回调
     * @method handleSelectionChange 单个select框回调
     * @method handleEdit 表格组件编辑回调
     * @method handleDelete 表格组件删除回调
     * @method add 新增
     * @method search 搜索
     * @method deleteSome 批量删除
     * @method handleSizeChange 分页器定义展示条数回调
     * @method handleCurrentChange 当前页码回调
     * @method yes 模态框/弹层中的确定按钮回调
     */
    //全选/反选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //单个勾选/反选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //表格-编辑
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      this.modalTitle = "编辑";
      this.addOrEdit = true;
    },
    //表格-删除
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
    },
    //新增
    add() {
      this.dialogFormVisible = true;
      this.modalTitle = "新增";
      this.addOrEdit = true;
    },
    //搜索
    search() {
      this.$message.success("搜索中");
    },
    //批量删除
    deleteSome() {
      if (this.multipleSelection.length == 0) {
        this.$message.error("未勾选任何选项");
      } else {
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            if (this.multipleSelection.length == this.tableData.length) {
              this.tableData = [];
            } else {
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    //分页器
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //模态框确定按钮
    yes() {
      this.dialogFormVisible = false;
      if (this.addOrEdit) {
        //新增逻辑
        debugger;
      } else {
        //编辑逻辑
        debugger;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.nowLocation {
  width: 100%;
  height: 60px;
  background: #f2f2f2;
}
.searchInput {
  margin-top: 10px;
}
.page {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  background: #f2f2f2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
