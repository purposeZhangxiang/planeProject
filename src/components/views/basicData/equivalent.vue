//当前基量
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <div class="serachInput">
      <el-form :inline="true" :model="searchInput" class="searchInput">
        <el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteSome">批量删除</el-button>
        </el-form-item>
        <el-form-item label="筛选条件">
          <el-select v-model="searchInput.condition">
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
          <el-input v-model="searchInput.keyword" placeholder="字段"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
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
      width="70%"
      @close="handleClose"
    >
      <el-form
        label-position="right"
        class="stand-alone"
        label-width="135px"
        :model="formLabelAlign"
      >
        <el-form-item label="飞机型号">
          <el-select v-model="formLabelAlign.planetypeid" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="试验谱">
              <el-input v-model="formLabelAlign.syp"></el-input>
            </el-form-item>
            <el-form-item label="试验谱块谱数">
              <el-input v-model="formLabelAlign.sypnum"></el-input>
            </el-form-item>
            <el-form-item label="基准谱块数">
              <el-input v-model="formLabelAlign.zjpks"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="试验谱寿命">
              <el-input v-model="formLabelAlign.aypage"></el-input>
            </el-form-item>
            <el-form-item label="滤波澜值">
              <el-input v-model="formLabelAlign.lbkz"></el-input>
            </el-form-item>
            <el-form-item label="基准总寿命">
              <el-input v-model="formLabelAlign.zjage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="疲劳寿命消耗速率">
          <el-input v-model="formLabelAlign.jzsl"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Goodman损伤">
              <el-input v-model="formLabelAlign.goodmandlss"></el-input>
            </el-form-item>
            <el-form-item label="Oding损伤">
              <el-input v-model="formLabelAlign.odingdlss"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Sorderberg损伤">
              <el-input v-model="formLabelAlign.sorderbergdlss"></el-input>
            </el-form-item>
            <el-form-item label="Gerber损伤">
              <el-input v-model="formLabelAlign.gerberdlss"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { http } from "../../../api/http";
import tabMixin from "../../../util/tableMixin";

export default {
  mixins: [tabMixin],
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
      nowLocation: ["基础静态数据", "当前基准损伤"],
      tableData: [],
      theadText: [
        { name: "飞机型号", value: "planeType" },
        { name: "试验谱", value: "syp" },
        { name: "试验谱寿命", value: "aypage" },
        { name: "试验谱块数", value: "sypnum" },
        { name: "基准铺块数", value: "zjpks" },
        { name: "基准总寿命", value: "zjage" },
        { name: "疲劳寿命消耗速率", value: "jzsl" },
        { name: "Goodman损伤", value: "goodmandlss" },
        { name: "Oding损伤", value: "odingdlss" },
        { name: "Sorderberg损伤", value: "sorderbergdlss" },
        { name: "Gerber损伤", value: "gerberdlss" }
      ],
      options: [],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      formLabelAlign: {
        planetypeid: "",
        syp: "",
        aypage: "",
        sypnum: "",
        lbkz:"",
        zjpks: "",
        zjage: "",
        jzsl: "",
        goodmandlss: "",
        odingdlss: "",
        sorderbergdlss: "",
        gerberdlss: ""
      },
      totalData: 10,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle: "",
      deaufltPage: 1, //默认展示页码
      currentPage: 1, //当前页
      currentSize: 10, //当前展示条数
      pageSize: [10, 15, 20] //每页展示
    };
  },
  components: {
    commomBread: () => import("../../common/bread.vue"),
    commonTable: () => import("../../common/table.vue")
  },
  created() {
    this.toAddProp();
    this.getTableData();
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    /**
     * @method getTableData 获取表格数据和分页器总页码
     * @method Add 子组件触发 添加执行的事件
     * @method Search 子组件触发 搜索事件
     * @method Look 子组件触发 查看事件
     * @method Edit 子组件触发 编辑事件
     */
    toAddProp() {
      for (let val of this.theadText) {
        val.prop = val.value;
      }
    },
    getTableData(currentPage, pageSize) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/equivalent/findAllPageByConditions", "post", json).then(res => {
        for (let val of res.records) {
          val.planeType = val.planeType.planeType;
        }
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    Add(data) {
      delete data.planeType; //删除planeType字段 否则后台报错
      http("/equivalent/addEquivalent", "post", data).then(res => {
        this.getTableData();
        this.$message({
          message: "添加成功",
          type: "success"
        });
      });
    },
    Search(currentPage, pageSize, data) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      Object.assign(json, data);
      http("/equivalent/findAllPageByConditions", "post", json).then(res => {
        //对planeType字段处理
        for (let val of res.records) {
          val.planeType = val.planeType.planeType;
        }
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
      http("/equivalent/getEquivalentById", "post", {
        id: id
      }).then(res => {
        Object.assign(this.formLabelAlign, res);
      });
    },
    Edit(data) {
      http("/equivalent/editEquivalent", "post", data).then(res => {
        this.getTableData();
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    DeleteSingel(id) {
      http("/equivalent/delEquivalent", "post", { id: id }).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    DeleteSome(param) {
      http("/equivalent/delEquivalentList", "post", param).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    getOptions() {
      http("/planeType/findAllByConditions", "post", {}).then(res => {
        for (let val of res) {
          let json = {};
          json.label = val.planeType;
          json.value = val.id;
          this.options.push(json);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>


