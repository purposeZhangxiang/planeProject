<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <!-- 流程图 -->
    <div class="progress">
      <div class="step">
        <img src="../../../assets/img/step1.png" alt />
        <div class="text">数据导入</div>
      </div>
      <div class="step" style="width:120px">
        <img src="../../../assets/img/arrow.png" alt />
      </div>
      <div class="step">
        <img src="../../../assets/img/step2.png" alt />
        <div class="text">数据计算</div>
      </div>
      <div class="step" style="width:120px">
        <img src="../../../assets/img/arrow.png" alt />
      </div>
      <div class="step">
        <img src="../../../assets/img/step3.png" alt />
        <div class="text">数据查看</div>
      </div>
    </div>
    <!-- 文件上传组件 -->
    <div class="upload">
      <div class="item dataImg">
        <img
          src="../../../assets/img/data.png"
          alt="data"
          :id="dialogFormVisible==true?'rotate':''"
        />
      </div>
      <div class="item">
        <div class="select">
          <el-form>
            <el-form-item label="部队编号">
              <el-select v-model="unitnumber" @change="selectChange">
                <el-option v-for="item in unitArr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <el-upload
          :action="action"
          :before-upload="handleBeforeUpload"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-progress="handleProgress"
          :data="uploadData"
          multiple
          :on-exceed="handleExceed"
          ref="upload"
        >
          <el-button size="small" type="primary">飞参数据导入</el-button>
          <div slot="tip" class="el-upload__tip">只能上传txt/zip文件</div>
        </el-upload>
      </div>
    </div>
    <!-- 模态框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="70%"
      :before-close="handleModalClose"
    >
      <el-steps :active="active" :process-status="activeStatus">
        <el-step title="数据导入计算" :description="description[0]"></el-step>
        <el-step title="数据查看" :description="description[1]"></el-step>
      </el-steps>

      <p style="text-align:center;color:red;">计算时间可能比较长,请耐心等待..</p>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, wsUrl } from "../../../api/env";
import treeVue from "../../common/tree.vue";
import { http } from "../../../api/http";
export default {
  components: {
    breadNav: () => import("../../common/bread.vue")
  },
  data() {
    /**
     * @param {nowLocation} 面包屑导航文字
     * @param {action} 文件上传地址
     * @param {dialogTitle}
     * @param {dialogFormVisible}
     * @param {active}
     * @param {activeStatus}
     * @param {description}
     * @param {}
     * @param {}
     */
    return {
      nowLocation: ["数据导入计算"],
      unitnumber: "",
      unitArr: [],
      action: `${baseUrl}/data/inputdata`,
      uploadData: {},
      dialogTitle: "数据导入计算",
      dialogFormVisible: false,
      active: 1,
      activeStatus: "",
      description: ["导入成功", "计算中.."]
    };
  },
  created() {
    this.getUnitNumber();
  },
  methods: {
    /**
     * @method handleBeforeUpload 上传前的回调
     * @method handleRemove 移除回调
     * @method handleExceed 超过限制文件回调
     * @method handleSuccess 上传成功的回调
     * @method handleError 上传失败的回调
     * @method handleModalClose 模态框关闭的回调
     * @method
     *
     */
    getUnitNumber() {
      http("/data/getunitnumber", "get").then(res => {
        this.unitArr = res;
        this.unitnumber = res[0]; //设置默认值
        this.uploadData.unitnumber = res[0];
      });
    },
    selectChange(val) {
      this.uploadData.unitnumber = val;
    },
    handleBeforeUpload(file) {
      let isTxt =
        file.type == "text/plain" || file.type == "application/zip"
          ? true
          : false;
      if (!isTxt) {
        this.$message.error("上传文件只能是 TXT/ZIP 格式!");
      }
      return isTxt;
    },
    handleProgress() {
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },

    handleSuccess(res, file, fileList) {
      if (res.code == "90000003") {
        this.$message.warning(res.msg); //error
      } else if (res.result == "0000") {
        this.$router.push({
          path: "/home/computedResult",
          query: { param: this.dealData(res.data) }
        });
      } else {
        this.$refs.upload.clearFiles();
        this.$message.error(res.msg);
      }
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    handleError(err, file, fileList) {
      this.dialogFormVisible = !this.dialogFormVisible;
      //清空原来的上传文件列表
      this.$refs.upload.clearFiles();
      this.$message.error("上传失败,请重试");
    },
    handleModalClose(done) {
      this.$confirm("正在解析计算数据,确认关闭？").then(res => {
        done();
      });
    },
    dealData(data) {
      let arr = [];
      for (let index in data) {
        let json = {
          bdbh: data[index].bdbh,
          ccbh: data[index].ccbh,
          title:
            "出厂编号 " + data[index].ccbh + " 部队编号 " + data[index].bdbh
        };
        arr.push(json);
      }
      return arr;
    },
   
  }
};
</script>

<style lang="less" scoped>
.progress {
  background: #f0f0f0;
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .step {
    width: 200px;
    padding: 10px 0;
    text-align: center;
    img {
      max-width: 100%;
    }
    .text {
      height: 20px;
      line-height: 20px;
      text-align: center;
    }
  }
}

.upload {
  width: 100%;
  margin-top: 20px;
  justify-content: center;
  align-items: center;
  display: flex;
  .item {
    width: 40%;
    height: 100%;
    display: inline-block;
    margin: 0 30px;
    .select {
      margin: 10px 0;
    }
  }
  .dataImg {
    text-align: center;
    display: inline-block;
    img {
      max-width: 100%;
      vertical-align: middle;
    }
  }
}
#rotate {
  animation: rotate 3s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>



