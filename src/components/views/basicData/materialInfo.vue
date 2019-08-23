//材料信息
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <!-- <commonTable
      :tableData="tableData"
      :theadText="theadText"
      :totalData="totalData"
      :jsonData="jsonData"
      :editData="editData"
      :remoteFuncs="remoteFuncs"
      @getTableData="getTableData"
      @Add="Add"
      @Search="Search"
      @Look="Look"
      @Edit="Edit"
      @DeleteSingel="DeleteSingel"
      @DeleteSome="DeleteSome"
    ></commonTable> -->
    <!-- 搜索框 -->
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
import tableMinxin from "../../../util/tableMixin";
import {http} from "../../../api/http";
export default {
  mixins:[tableMinxin],
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
      nowLocation: ["基础静态数据", "材料信息"],
      tableData: [],
      theadText: [
        { name: "材料名", value: "name" },
        { name: "密度", value: "md" },
        { name: "弹性模量", value: "txml" },
        { name: "泊松比", value: "bsb" },
        { name: "屈服应力", value: "qfyl" },
        { name: "极限应力", value: "jxyl" },
        { name: "S-N指数", value: "snzs" },
        { name: "S-N截距", value: "snjj" },
        { name: "疲劳强度系数", value: "plqdxs" },
        { name: "疲劳强度指数", value: "plqdzs" }
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
        stateDescribe:"",
        emptyWeight:"",
        typeDescribe:"",
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle: "",
      deaufltPage: 1, //默认展示页码
      currentPage: 1, //当前页
      currentSize: 10, //当前展示条数
      pageSize: [10, 15, 20], //每页展示
      // jsonData: {
      //   list: [
      //     {
      //       type: "input",
      //       name: "材料名",
      //       icon: "icon-input",
      //       options: {
      //         width: "100%",
      //         defaultValue: "",
      //         required: false,
      //         dataType: "string",
      //         pattern: "",
      //         placeholder: "",
      //         remoteFunc: "func_1552982837000_84841"
      //       },
      //       key: "1552982837000_84841",
      //       model: "name",
      //       rules: [
      //         {
      //           type: "string",
      //           message: "材料名格式不正确"
      //         }
      //       ]
      //     },
      //     {
      //       type: "grid",
      //       name: "栅格布局",
      //       icon: "icon-grid-",
      //       columns: [
      //         {
      //           span: 12,
      //           list: [
      //             {
      //               type: "input",
      //               name: "密度",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "ρ（kg/m3）",
      //                 remoteFunc: "func_1552982380000_20815"
      //               },
      //               key: "1552982380000_20815",
      //               model: "md",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "密度格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "弹性模量",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552982930000_8175",
      //               model: "txml",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "弹性模量格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "泊松比",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552982931000_12445",
      //               model: "bsb",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "泊松比格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "屈服应力",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983033000_14197",
      //               model: "qfyl",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "屈服应力格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "极限应力",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983042000_20807",
      //               model: "jxyl",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "极限应力格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "S-N指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983045000_73880",
      //               model: "snzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "S-N指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "S-N截距",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983053000_63786",
      //               model: "snjj",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "S-N截距格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "疲劳强度系数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983059000_61437",
      //               model: "plqdxs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "疲劳强度系数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "疲劳强度指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983075000_70170",
      //               model: "plqdzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "疲劳强度指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "疲劳延性系数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983080000_16683",
      //               model: "plyxxs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "疲劳延性系数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "疲劳延性指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983088000_94117",
      //               model: "plyxzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "疲劳延性指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "循环应变硬化指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552983094000_90612",
      //               model: "xhybyhzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "循环应变硬化指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "循环强化指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982385000_34935"
      //               },
      //               key: "1552982385000_34935",
      //               model: "xhqhzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "循环强化指数格式不正确"
      //                 }
      //               ]
      //             }
      //           ]
      //         },
      //         {
      //           span: 12,
      //           list: [
      //             {
      //               type: "input",
      //               name: "Paris公式系数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "C",
      //                 remoteFunc: "func_1552982381000_15529"
      //               },
      //               key: "1552982381000_15529",
      //               model: "parisgsxs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "Paris公式系数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "Paris公式指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552982933000_21326",
      //               model: "parisgszs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "Paris公式指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "平面应变断裂韧度",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552982933000_34135",
      //               model: "pmybdlrd",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "平面应变断裂韧度格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "Walker公式R>0指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983110000_1591",
      //               model: "walkerdyzero",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "Walker公式R>0指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "Walker公式R≤0指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983121000_22929",
      //               model: "walkerxyzero",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "Walker公式R≤0指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "Wheeler模型的迟滞指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983136000_10841",
      //               model: "willenborgczzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "Wheeler模型的迟滞指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "改进Willenborg模型的超载截止比",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983224000_81988",
      //               model: "willenborgjzb",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "改进Willenborg模型的超载截止比格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "应力比截止值",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983248000_93772",
      //               model: "ylbjzz",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "应力比截止值格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "应力比R=0时闭合应力与最大应力之比",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983279000_40532",
      //               model: "ylbzero",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "应力比R=0时闭合应力与最大应力之比格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "应力比R=-1时闭合应力与最大应力之比",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983289000_54149",
      //               model: "ylbone",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "应力比R=-1时闭合应力与最大应力之比格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "应力比影响指数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983295000_5574",
      //               model: "ylbyxzs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "应力比影响指数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "闭合模型材料相关参数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552983302000_12955",
      //               model: "bhmxclxgcs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "闭合模型材料相关参数格式不正确"
      //                 }
      //               ]
      //             },
      //             {
      //               type: "input",
      //               name: "闭合模型材料相关参数",
      //               icon: "icon-input",
      //               options: {
      //                 width: "100%",
      //                 defaultValue: "",
      //                 required: false,
      //                 dataType: "number",
      //                 pattern: "",
      //                 placeholder: "",
      //                 remoteFunc: "func_1552982390000_81969"
      //               },
      //               key: "1552982390000_81969",
      //               model: "ybhmxclxgcs",
      //               rules: [
      //                 {
      //                   type: "number",
      //                   message: "闭合模型材料相关参数格式不正确"
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ],
      //       options: {
      //         gutter: 0,
      //         justify: "center",
      //         align: "top",
      //         remoteFunc: "func_1552982375000_3326"
      //       },
      //       key: "1552982375000_3326",
      //       model: "grid_1552982375000_3326",
      //       rules: []
      //     }
      //   ],
      //   config: {
      //     labelWidth: 255,
      //     labelPosition: "right",
      //     size: "small"
      //   }
      // },
      // editData: {},
      remoteFuncs: {}
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
      http("/material/findAllPageByConditions", "post", json).then(res => {
        this.tableData = res.records;
        this.totalData = res.total;
      });
    },
    Add(data) {
      for (let key in data) {
        if (key === "img") {
          data[key] = data[key].join();
        }
      }

      http("/material/addMaterial", "post", data).then(res => {
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
      http("/material/findAllPageByConditions", "post", json).then(res => {
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
      http("/material/getMaterialById", "post", {
        id: id
      }).then(res => {
        if (typeof res === "object") {
          this.editData = res;
        } else {
          this.editData = JSON.parse(res);
        }
      });
    },
    Edit(data) {
      http("/material/editMaterial", "post", data).then(res => {
        this.getTableData();
        this.$message({
          message: "修改成功",
          type: "success"
        });
      });
    },
    DeleteSingel(id) {
      http("/material/delMaterial", "post", {
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
      http("/material/delMaterialList", "post", param).then(res => {
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

<style lang="less" scoped>
</style>






