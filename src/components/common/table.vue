<template>
  <div>
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
      :close-on-click-modal=false
      width="70%"
      @close="handleClose"
    >
      <fm-generate-form :data="jsonData" :remote="remoteFuncs" :value="editData" ref="generateForm">
        <template slot="img">
          <el-upload
            ref="upload"
            :action="action"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-success="uploadSucc"
            :file-list="reshowImgUrls"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="imgDialog" >
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </template>
      </fm-generate-form>
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
import {http} from "../../api/http";
import {imgUrl} from "../../api/env"
export default {
  data() {
    /**
     * @param {searchInput} 搜索框的双向绑定
     * @param {multipleSelection}  已勾选行
     * @param {dialogFormVisible}  显示/隐藏模态框
     * @param {dialogTitle} 模态框标题
     * @param {deaufltPage} 默认展示页
     * @param {currentPage} 当前页
     * @param {currentSize} 每页展示多少条(用作传参)
     * @param {pageSize} 分页器配置展示条数
     * @param {imgDialog} 控制图片放大弹出层的开关
     * @param {dialogImageUrl} 放大弹出层图片地址
     */
    return {
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      multipleSelection: [],
      dialogFormVisible: false,
      dialogTitle: "",
      deaufltPage: 1, //默认展示页码
      currentPage: 1, //当前页
      currentSize: 10, //当前展示条数
      pageSize: [10, 15, 20], //每页展示
      action: `${imgUrl}/upload`,
      imgDialog: false,
      dialogImageUrl: "",
      uploadImgIds: [],
      fileList: [] //回显的图片
    };
  },
  components: {
    commonSearch: () => import("../common/search.vue")
  },
  props: {
    /**
     * @param {theadText} 动态表格头部文字和绑定表格值的字段
     * @param {tableData} 表格内容值(由父组件传递)
     * @param {totalData} 分页器总数(由父组件传递)
     * @param {jsonData} 表单元素(由父组件传递)
     * @param {editData} 表单动态绑定(由父组件传递)
     */
    tableData: Array,
    theadText: Array,
    totalData: Number,
    jsonData: Object,
    remoteFuncs: Object,
    editData: Object,
    reshowImgUrls: Array
  },
  created() {
    this.searchInput.condition = this.theadText[0].value; //默认选中第一项
  },
  methods: {
    /**
     * @method toggleSelection 表格组件全选/反选回调
     * @method handleSelectionChange 表格组件tr单行 选中/取消回调
     * @method handleLook 表格组件操作列 查看按钮
     * @method handleEdit 表格组件操作列 编辑按钮
     * @method handleDelete 表格组件操作列 删除按钮
     * @method getTableData 初始化请求表格数据
     * @method add 新增功能
     * @method deleteSome  批量删除
     * @method search 搜索功能
     * @method dialogFormCancel 模态框取消按钮
     * @method handleClose 模态框关闭回掉(清空表单数据和缓存的图片展示)
     * @method dialogOk 模态框确定按钮
     * @method handleSizeChange 分页器回调(展示条数)
     * @method handleCurrentChange 分页器回调(当前页)
     * @method beforeAvatarUpload 图片上传前的回调
     * @method handleRemove 图片删除回调
     * @method handlePictureCardPreview 点击已上传图片回调
     * @method uploadSucc 图片上传成功会回调
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleLook(index, row) {
      this.$emit("Look", row.id);
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "查看";
    },
    handleEdit(index, row) {
      this.$emit("Look", row.id);
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "编辑";
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("DeleteSingel", row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    add() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialogTitle = "新增";
      this.$emit("claerlove")
    },
    deleteSome() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选中任何项",
          type: "warning"
        });
      } else {
        //批量删除
        let str = "";
        for (let val of this.multipleSelection) {
          str += val.id + ",";
        }
        this.$confirm("此操作将永久删除数据, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$emit("DeleteSome", { ids: str });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      }
    },
    search() {
      let json = {};
      json[this.searchInput.condition] = this.searchInput.keyword;
      json.selectType = this.searchInput.include;
      this.$emit("Search", this.currentPage, this.currentSize, json);
    },
    dialogFormCancel() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleClose() {
      this.clearFormStatus();
      // this.$emit("clearFormStatus")
    },
    dialogOk() {
      if (this.dialogTitle === "新增") {
        this.$refs.generateForm
          .getData()
          .then(data => {
            // 数据校验成功 data为获取的表单数据
            /* 判断是否有img字段,如果有->讲上传的id添加至data里 */
            if (data.hasOwnProperty("img")) {
              data.img = this.uploadImgIds.join(",");
            }
            this.$emit("Add", data);
            this.dialogFormVisible = !this.dialogFormVisible;
          })
          .catch(e => {
            // 数据校验失败e
            this.$message({
              message: "请按照提示填写表单",
              type: "error"
            });
          });
      } else if (this.dialogTitle === "编辑") {
        this.$refs.generateForm
          .getData()
          .then(data => {
            if (data.hasOwnProperty("img")) {
              data.img = this.uploadImgIds.join(",");
            }
            // 数据校验成功 data为获取的表单数据
            this.$emit("Edit", data);
            this.dialogFormVisible = !this.dialogFormVisible;
          })
          .catch(e => {
            // 数据校验失败e
            this.$message({
              message: "请按照提示填写表单",
              type: "error"
            });
          });
      } else {
        this.dialogFormVisible = !this.dialogFormVisible;
      }
    },
    handleSizeChange(val) {
      this.currentSize = val;
      //一旦切换当前页展示数目,那么当页currentPage默认跳转回地1页
      this.$emit("getTableData", 1, val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit("getTableData", val, this.currentSize);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove(file, fileList) {
      //!必要的判断!主要解决上传未保存就删除的操作
      let delId; //被删除的图片id
      if (file.hasOwnProperty("response")) {
        delId = file.response.data;
      } else {
        delId = file.url.split("/")[5];
      }
      for (let index in this.uploadImgIds) {
        if (this.uploadImgIds[index] == delId) {
          this.uploadImgIds.splice(index, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialog = true;
    },
    uploadSucc(res, file, fileList) {
      this.uploadImgIds = []; //!必须置空,否则会叠加
      fileList.forEach(element => {
        if (element.hasOwnProperty("response")) {
          this.uploadImgIds.push(element.response.data);
        } else {
          this.uploadImgIds.push(element.url.split("/")[5]);
        }
      });
    },
    clearFormStatus() {

      debugger;
      for (let key in this.editData) {
        this.editData[key] = "";
      }
      //置空表单
      // if (!this.$refs.hasOwnProperty("generateForm")) {
      //   return;
      // } else {
      //   this.$refs.generateForm.getData().then(data => {
      //     for (let key in data) {
      //       data[key] = "";
      //     }
      //   });
      // }
      // //置空图片
      // this.$emit("clearImgs");
    }
  }
};
</script>

<style lang="less" scoped>
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

<style lang='less'>
</style>

