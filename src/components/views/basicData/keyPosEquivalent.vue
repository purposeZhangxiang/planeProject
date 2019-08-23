// 关键部位基准损伤
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
        label-width="150px"
        :model="formLabelAlign"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="结构状态编号">
              <el-select style="width: 100%" v-model="formLabelAlign.jgztbh" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关键部位编号">
              <el-select
                style="width: 100%"
                v-model="formLabelAlign.keypositionid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实验谱寿命">
              <el-input v-model="formLabelAlign.sypsm"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="12">
          <el-form-item label="实验应力谱">
            <el-input v-model="formLabelAlign.syylp"></el-input>
          </el-form-item>
          <el-form-item label="安全系数">
            <el-input v-model="formLabelAlign.aqxs"></el-input>
          </el-form-item>
          <el-form-item label="基准总寿命">
            <el-input v-model="formLabelAlign.zjzsm"></el-input>
          </el-form-item>
          <el-form-item label="疲劳寿命消耗速率">
            <el-input v-model="formLabelAlign.jzplsmxhsl"></el-input>
          </el-form-item>
          <el-form-item label="块谱应力损伤">
            <el-input v-model="formLabelAlign.kpylss"></el-input>
          </el-form-item>
          <el-form-item label="寿命消耗检查点">
            <el-input v-model="formLabelAlign.plsmjcd"></el-input>
          </el-form-item>
          <el-form-item label="初始裂纹类型">
            <el-input v-model="formLabelAlign.cslwlx"></el-input>
          </el-form-item>
          <el-form-item label="基准裂纹扩展曲线">
            <el-input v-model="formLabelAlign.jzlwkzqx"></el-input>
          </el-form-item>
          <el-form-item label="基准裂纹扩展寿命">
            <el-input v-model="formLabelAlign.jzlwkzsm"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="实验块谱数">
            <el-input v-model="formLabelAlign.sypks"></el-input>
          </el-form-item>
          <el-form-item label="基准谱块数">
            <el-input v-model="formLabelAlign.jzpks"></el-input>
          </el-form-item>
          <el-form-item label="寿命消耗极限">
            <el-input v-model="formLabelAlign.plsmxhjx"></el-input>
          </el-form-item>
          <el-form-item label="块谱当量损伤">
            <el-input v-model="formLabelAlign.kpdlss"></el-input>
          </el-form-item>
          <el-form-item label="块谱应变损伤">
            <el-input v-model="formLabelAlign.kpysss"></el-input>
          </el-form-item>
          <el-form-item label="疲劳寿命检查点">
            <el-input v-model="formLabelAlign.plsmjcd"></el-input>
          </el-form-item>
          <el-form-item label="初始裂纹尺寸">
            <el-input v-model="formLabelAlign.cslwcc"></el-input>
          </el-form-item>
          <el-form-item label="临界裂纹尺寸">
            <el-input v-model="formLabelAlign.ljlwcc"></el-input>
          </el-form-item>
          <el-form-item label="裂纹扩展寿命检查点">
            <el-input v-model="formLabelAlign.lwkzsmjcd"></el-input>
          </el-form-item>
        </el-col>
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

import { resolve } from "q";

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
      nowLocation: ["基础静态数据", "关键部位基准损伤"],
      tableData: [],
      theadText: [
        { name: "关键部位编号", value: "jgztbh" },
        // { name: "飞机型号", value: "name" },
        { name: "试验谱寿命", value: "sypsm" },
        { name: "试验应力谱", value: "syylp" },
        { name: "试验谱块数", value: "sypks" },
        { name: "安全系数", value: "aqxs" },
        { name: "基准谱块数", value: "jzpks" },
        { name: "基准总寿命", value: "zjzsm" },
        { name: "消耗极限", value: "plsmxhjx" },
        { name: "消耗速率", value: "jzplsmxhsl" }
      ],
      options: [],
      options2: [],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      formLabelAlign: {
        jgztbh: "",
        keypositionid: "",
        sypsm: "",
        syylp: "",
        sypks: "",
        aqxs: "",
        jzpks: "",
        zjzsm: "",
        plsmxhjx: "",
        jzplsmxhsl: "",
        kpdlss: "",
        kpylss: "",
        kpysss: "", //块谱应变损伤
        plsmxhjcd: "",
        plsmjcd: "",
        cslwlx: "",
        cslwcc: "",
        jzlwkzqx: "",
        ljlwcc: "",
        jzlwkzsm: "",
        lwkzsmjcd: ""
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
      http("/keyjzss/findAllPageByConditions", "post", json).then(res => {
        for (let val of res.records) {
          console.log(val.id);
        }
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    Add(data) {
      http("/keyjzss/addKeyjzss", "post", data).then(res => {
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
      http("/keyjzss/findAllPageByConditions", "post", json).then(res => {
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
      http("/keyjzss/getKeyjzssById", "post", {
        id: id
      }).then(res => {
        Object.assign(this.formLabelAlign, res);
      });
    },
    Edit(data) {
      http("/keyjzss/editKeyjzss", "post", data).then(res => {
        this.getTableData();
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    DeleteSingel(id) {
      http("/keyjzss/delKeyjzss", "post", {
        id: id
      }).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    DeleteSome(param) {
      http("/keyjzss/delKeyjzssList", "post", param).then(res => {
        this.getTableData();
        this.$message({
          message: "删除成功",
          type: "success"
        });
      });
    },
    getOptions() {
      http("/keyposition/findAllList", "post", {}).then(res => {
        for (let val of res) {
          let json = {};
          json.label = val.num;
          json.value = val.id;
          this.options.push(json);
        }
      });
      http("/keyposition/findAllList", "post", {}).then(res => {
        for (let val of res) {
          let json = {};
          json.label = val.num;
          json.value = val.id;
          this.options2.push(json);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>



