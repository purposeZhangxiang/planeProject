// 单机信息页面
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- 搜索框 -->
    <div class="serachInput">
      <el-form :inline="true" :model="searchInput" class="searchInput" clearable>
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
        label-width="130px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-col :span="12">
          <el-form-item label="出厂编号" prop="factorynumber">
            <el-input v-model="formLabelAlign.factorynumber"></el-input>
          </el-form-item>
          <el-form-item label="出厂日期" prop="deliverytime">
            <el-date-picker
              v-model="formLabelAlign.deliverytime"
              type="date"
              placeholder="选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="所属部队名称" prop>
            <el-select v-model="value" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属中队" prop="unitmiddle">
            <el-input v-model="formLabelAlign.unitmiddle"></el-input>
          </el-form-item>
          <el-form-item label="标准作战重量(kg)" prop="fightweight">
            <el-input v-model="formLabelAlign.fightweight"></el-input>
          </el-form-item>
          <el-form-item label="空机重量(kg)" prop="emptyweight">
            <el-input v-model="formLabelAlign.emptyweight"></el-input>
          </el-form-item>
          <el-form-item label="S-N指数" prop="sn">
            <el-input v-model="formLabelAlign.sn"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="飞机型号">
            <el-select style="width: 100%" v-model="formLabelAlign.plantypeid" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服役日期">
            <el-date-picker
              v-model="formLabelAlign.servicedate"
              type="date"
              placeholder="选择日期"
              style="width:100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="所属部队编号">
            <el-input v-model="formLabelAlign.unitnumber"></el-input>
          </el-form-item>
          <el-form-item label="使用机号">
            <el-input v-model="formLabelAlign.usernumber"></el-input>
          </el-form-item>
          <el-form-item label="最大限制过载">
            <el-input v-model="formLabelAlign.maxoverdrive"></el-input>
          </el-form-item>
          <el-form-item label="强度设计重量(kg)">
            <el-input v-model="formLabelAlign.strengthweight"></el-input>
          </el-form-item>
          <el-form-item label="最大设计过载">
            <el-input v-model="formLabelAlign.maxdesignoverdrive"></el-input>
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
      value: "",
      nowLocation: ["基础静态数据", "单机信息"],
      tableData: [],
      theadText: [
        { name: "出厂编号", value: "factorynumber" },
        { name: "飞机型号", value: "planeType" },
        { name: "出厂年月", value: "deliverytime" },
        { name: "服役日期", value: "servicedate" },
        { name: "部队编号", value: "unitnumber" },
        { name: "使用机号", value: "usernumber" },
        { name: "所属中队", value: "unitmiddle" },
        { name: "标准作战重量(kg)", value: "fightweight" },
        { name: "空机重量(kg)", value: "emptyweight" },
        { name: "最大限制过载", value: "maxoverdrive" },
        { name: "最大设计过载", value: "maxdesignoverdrive" },
        { name: "S-N指数", value: "sn" }
      ],
      options: [],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      formLabelAlign: {
        factorynumber: "",
        plantypeid: "",
        deliverytime: "",
        servicedate: "",
        unitnumber: "",
        usernumber: "",
        unitmiddle: "",
        fightweight: "",
        emptyweight: "",
        strengthweight: "",
        maxoverdrive: "",
        maxdesignoverdrive: "",
        sn: ""
      },
      //表单验证规则
      rules: {
        factorynumber: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        plantypeid: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        deliverytime: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        servicedate: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        unitnumber: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        usernumber: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        unitmiddle: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        fightweight: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        emptyweight: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        strengthweight: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        maxoverdrive: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        maxdesignoverdrive: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ],
        sn: [
          {
            required: true,
            message: "请输入飞机型号",
            trigger: "blur"
          }
        ]
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
    this.toUpperCase();
    this.getTableData();
  },
  mounted() {
    //form中的options
    this.getOptions();
  },
  methods: {
    /**
     * @method getTableData 获取表格数据和分页器总页码
     * @method Add 子组件触发 添加执行的事件
     * @method Search 子组件触发 搜索事件
     * @method Look 子组件触发 查看事件
     * @method Edit 子组件触发 编辑事件
     * @method DeleteSingel 子组件触发 删除单条数据
     * @method DeleteSome 子组件触发 批量删除
     */
    toUpperCase() {
      for (let val of this.theadText) {
        val.prop = val.value;
      }
    },
    getTableData(currentPage, pageSize) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      http("/singleInformation/findAllPageByConditions", "post", json).then(
        res => {
          // 对请求回的数据planeType,时间字段进行处理
          for (let val of res.records) {
            val.planeType = val.planeType.planeType;
            val.deliverytime = val.deliverytime.slice(0, 10);
            val.servicedate = val.servicedate.slice(0, 10);
          }
          this.tableData = res.records;
          this.totalData = res.total;
        }
      );
    },
    Add(data) {
      http("/singleInformation/addSingleinformation", "post", data).then(
        res => {
          this.getTableData();
          this.$message({
            message: "添加成功",
            type: "success"
          });
        }
      );
    },
    Search(currentPage, pageSize, data) {
      let json = {
        currentPage: currentPage || 1,
        pageSize: pageSize || 10
      };
      Object.assign(json, data);
      http("/singleInformation/findAllPageByConditions", "post", json).then(
        res => {
          if (res.records.length == 0) {
            this.$message({
              message: "当前条件无结果",
              type: "warning"
            });
          }
          // 对请求回的数据planeType,时间字段进行处理
          for (let val of res.records) {
            val.planeType = val.planeType.planeType;
            val.deliverytime = val.deliverytime.slice(0, 10);
            val.servicedate = val.servicedate.slice(0, 10);
          }
          this.tableData = res.records;
          this.totalData = res.records.length;
        }
      );
    },
    Look(id) {
      http("/singleInformation/getSingleinformationById", "post", {
        id: id
      }).then(res => {
        debugger;
        Object.assign(this.formLabelAlign, res);
        // if (typeof res === "object") {
        //   this.editData = res;
        // } else {
        //   this.editData = JSON.parse(res);
        // }
      });
    },
    Edit(data) {
      http("/singleInformation/editSingleinformation", "post", data).then(
        res => {
          this.getTableData();
          this.$message({
            message: "修改成功",
            type: "success"
          });
        }
      );
    },
    DeleteSingel(id) {
      http("/singleInformation/delSingleinformation", "post", { id: id }).then(
        res => {
          this.getTableData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      );
    },
    DeleteSome(param) {
      http("/singleInformation/delSingleinformationList", "post", param).then(
        res => {
          this.getTableData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        }
      );
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

<style lang="less">
</style>

