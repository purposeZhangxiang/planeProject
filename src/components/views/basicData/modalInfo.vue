<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- 搜索框 -->
    <div class="serachInput">
      <el-form :inline="true" :model="searchInput" class="searchInput">
        <el-form-item label="筛选条件">
          <el-select v-model="searchInput.condition" clearable>
            <el-option
              v-for="(item,index) in theadText"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchInput.include">
            <el-option label="包含" value="like"></el-option>
            <el-option label="等于" value="eq"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchInput.keyword" placeholder="字段" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteSome">批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="table"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="loadding"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          align="center"
          v-for="(item,index) in theadText"
          :key="index"
          :label="item.name"
          :prop="item.prop"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleLook(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出层 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="40%"
      @close="handleClose"
    >
      <el-form
        label-position="right"
        label-width="120px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
        :disabled="dialogTitle=='查看' "
      >
        <el-form-item label="飞机型号" prop="planeType">
          <el-input v-model="formLabelAlign.planeType"></el-input>
        </el-form-item>
        <el-form-item label="中文名称" prop="chinaName">
          <el-input v-model="formLabelAlign.chinaName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="结构状态编号" prop="num">
          <el-input v-model="formLabelAlign.num"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="结构状态描述" prop="stateDescribe">
          <el-input v-model="formLabelAlign.stateDescribe"></el-input>
        </el-form-item>-->
        <el-form-item label="空机重量" prop="emptyWeight">
          <el-input v-model="formLabelAlign.emptyWeight" type="number"></el-input>
        </el-form-item>
        <!-- <el-form-item label="型号描述" prop="typeDescribe">
          <el-input v-model="formLabelAlign.typeDescribe"></el-input>
        </el-form-item>-->
        <el-form-item label="标准当量损伤" prop="bzdlssl">
          <el-input v-model="formLabelAlign.bzdlssl" type="number"></el-input>
        </el-form-item>

        <el-form-item label="标准作战重量" prop="fightWeight">
          <el-input v-model="formLabelAlign.fightWeight" type="number"></el-input>
        </el-form-item>

        <el-form-item label="设计使用寿命" prop="sjsysm">
          <el-input v-model="formLabelAlign.sjsysm" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页器 -->
    <div class="page" v-if="tableData.length>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="deaufltPage"
        :page-sizes="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalData"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { http,httpHasLoad } from "../../../api/http";
import table from "../../../util/tableMixin";
export default {
  mixins: [table],
  data() {
    return {
      /**
       * @param {nowLocation} 面包屑导航当前位置
       * @param {tableData} 表格数据
       * @param {theadText} 表头配置
       * @param {totalData} 分页器总数
       * @param {jsonData} 表单生成插件配置
       * @param {editData} 表单双向绑定
       * @param {remoteFuncs}
       *
       */
      nowLocation: ["基础静态数据", "型号信息"],
      tableData: [],
      theadText: [
        { name: "飞机型号", value: "planeType", prop: "planeType" },
        { name: "中文名称", value: "chinaName", prop: "chinaName" },
        // { name: "结构状态编号", value: "num", prop: "num" },
        // { name: "结构状态描述", value: "stateDescribe", prop: "stateDescribe" },
        { name: "空机重量", value: "emptyWeight", prop: "emptyWeight" },
        // { name: "型号描述", value: "typeDescribe", prop: "typeDescribe" }

        //add
        { name: "标准当量损伤", value: "bzdlssl", prop: "bzdlssl" },
        { name: "标准作战重量", value: "fightWeight", prop: "fightWeight" },
        { name: "设计使用寿命", value: "sjsysm", prop: "sjsysm" }
      ],
      totalData: 10,
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      formLabelAlign: {
        planeType: "",
        chinaName: "",
        num: "",
        stateDescribe: "",
        emptyWeight: "",
        typeDescribe: "",
        bzdlssl: "",
        fightWeight: "",
        sjsysm: ""
      },
      //表单验证规则
      rules: {
        planeType: [
          { required: true, message: "请输入飞机型号", trigger: "blur" }
        ],
        chinaName: [
          { required: true, message: "请输入中文名称", trigger: "blur" }
        ],
        num: [
          { required: true, message: "请输入结构状态编号", trigger: "blur" }
        ],
        stateDescribe: [
          { required: true, message: "请输入结构状态描述", trigger: "blur" }
        ],
        emptyWeight: [
          { required: true, message: "请输入空机重量", trigger: "blur" },
          {
            pattern: /^\d+(\.{0,1}\d+){0,1}$/,
            message: "请输入数字",
            trigger: "blur"
          }
        ],
        typeDescribe: [
          { required: true, message: "请输入型号描述", trigger: "blur" }
        ],
        bzdlssl: [
          { required: true, message: "请输入标准当量损伤", trigger: "blur" }
        ],
        fightWeight: [
          { required: true, message: "请输入标准作战重量", trigger: "blur" }
        ],
        sjsysm: [
          { required: true, message: "请输入设计使用寿命", trigger: "blur" }
        ]
      },

      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle: "",
      deaufltPage: 1, //默认展示页码
      currentPage: 1, //当前页
      currentSize: 10, //当前展示条数
      pageSize: [10, 15, 20], //每页展示
      loadding: null
    };
  },
  components: {
    commomBread: () => import("../../common/bread.vue"),
    commonTable: () => import("../../common/table.vue")
  },
  created() {
    this.getTableData();
  },
  methods: {
    /**
     * @method getTableData 获取表格数据和分页器总页码
     * @method Add 子组件触发 添加执行的事件
     * @method Search 子组件触发 搜索事件
     * @method Look 子组件触发 查看事件
     * @method Edit 子组件触发 编辑事件
     * @method DeleteSingel 子组件触发 单个删除
     * @method DeleteSome 子组件触发 批量删除
     */
    getTableData(currentPage, pageSize) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      httpHasLoad("/planeType/findAllPageByConditions", "post", json).then(
        res => {
          this.tableData = res.records;
          this.totalData = res.total;
        },
      );
    },
    Add(data) {
      http("/planeType/addPlaneType", "post", data).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.getTableData();
        this.dialogFormVisible = !this.dialogFormVisible;
      });
    },
    Search(currentPage, pageSize, data) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      Object.assign(json, data);
      http("/planeType/findAllPageByConditions", "post", json).then(res => {
        if (res.records.length == 0) {
          this.$message({
            message: "当前条件无结果",
            type: "warning"
          });
        }
        this.tableData = res.records;
        this.totalData = res.records.length;
      });
    },
    Look(id) {
      http("/planeType/getPlaneTypeById", "post", { id: id }).then(res => {
        Object.assign(this.formLabelAlign, res);
      });
    },
    Edit(data) {
      http("/planeType/editPlaneType", "post", data).then(res => {
        this.$message({
          message: "修改成功",
          type: "success"
        });
        this.getTableData();
        this.dialogFormVisible = !this.dialogFormVisible;
      });
    },
    DeleteSingel(id) {
      http("/planeType/delPlaneType", "post", { id: id }).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    DeleteSome(param) {
      http("/planeType/delPlaneTypeList", "post", param).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    }
  }
};
</script>

<style lang="less">
</style>


