
<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
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
      <el-form label-position="right" label-width="110px" :model="formLabelAlign">
        <el-form-item label="飞机型号">
          <el-select v-model="formLabelAlign.planetypeid" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键件编号">
          <el-input v-model="formLabelAlign.num"></el-input>
        </el-form-item>
        <el-form-item label="关键件名称">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formLabelAlign.describe"></el-input>
        </el-form-item>
        <el-form-item label="关键件示意图">
          <el-upload
            ref="upload"
            :action="action"
            :headers="headers"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucc"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="imgDialog" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
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
import { http } from "../../../api/http";
import { imgUrl } from "../../../api/env";
import tableMinxin from "../../../util//tableMixin";
export default {
  mixins: [tableMinxin],
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
      nowLocation: ["基础静态数据", "关键件信息"],
      tableData: [],
      theadText: [
        { name: "关键件编号", value: "num" },
        { name: "关键件名称", value: "name" },
        // { name: "结构状态编号", value: "" },
        { name: "关键件描述", value: "describe" }
      ],
      totalData: 10,
      reshowImgUrls: [],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      options: [],
      formLabelAlign: {
        planetypeid: "",
        num: "",
        name: "",
        describe: "",
        img: []
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle: "",
      deaufltPage: 1, //默认展示页码
      currentPage: 1, //当前页
      currentSize: 10, //当前展示条数
      pageSize: [10, 15, 20], //每页展示
      action: `${imgUrl}/upload`,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token")
      },
      fileList: [],
      uploadImgIds: [],
      imgDialog:false,
      dialogImageUrl:"",

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
    //form中的options
    this.getOptions();
    //添加上传请求头token
    // this.headers={
    //   Authorization:"Bearer "+sessionStorage.getItem("token")
    // }
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
      http("/criticalinformation/findAllPageByConditions", "post", json).then(
        res => {
          this.tableData = res.records;
          this.totalData = res.total;
        }
      );
    },
    Add(data) {
      data["img"] = this.uploadImgIds.join(",");
      debugger;
      http("/criticalinformation/addCriticalinformation", "post", data).then(
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
      http("/criticalinformation/findAllPageByConditions", "post", json).then(
        res => {
          if (res.records.length == 0) {
            this.$message({
              message: "当前条件无结果",
              type: "warning"
            });
          }
          this.tableData = res.records;
          this.totalData = res.records.length;
        }
      );
    },
    Look(id) {
      http("/criticalinformation/getCriticalinformationById", "post", {
        id: id
      }).then(res => {
        //需要处理掉多余的字段 -->否则会报错
        delete res.planeType;
        delete res.strplaneType;

        //处理用于回显示的图片
        if (res.img != null && res.img != "") {
          let reshowImgIds = res.img.split(",");
          for (let val of reshowImgIds) {
            let json = {};
            json.url = `${imgUrl}/download/${val}`;
            this.fileList.push(json);
          }
        }
        Object.assign(this.formLabelAlign, res);
      });
    },
    Edit(data) {
      data["img"] = this.uploadImgIds.join(",");
      http("/criticalinformation/editCriticalinformation", "post", data).then(
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
      http("/criticalinformation/delCriticalinformation", "post", {
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
      http(
        "/criticalinformation/delCriticalinformationList",
        "post",
        param
      ).then(res => {
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

