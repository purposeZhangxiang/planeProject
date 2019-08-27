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
              <el-select v-model="unitnumber">
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
          :on-progress="handProgress"
          :data="uploadData"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
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
        <el-step title="数据导入" :description="description[0]"></el-step>
        <el-step title="数据计算" :description="description[1]"></el-step>
        <el-step title="数据查看" :description="description[2]"></el-step>
      </el-steps>
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
      // testServer: "https://jsonplaceholder.typicode.com/posts/",
      unitnumber: "",
      unitArr: [],
      action: `${baseUrl}/data/inputdata`,
      uploadData: {},
      dialogTitle: "数据导入计算",
      dialogFormVisible: false,
      active: 1,
      activeStatus: "",
      description: ["导入成功", "计算中..", ""]
    };
  },
  created() {
    this.getUnitNumber();
  },
  methods: {
    /**
     * @method initWebsocket 初始化websocket
     * @method closeWebsocket 断开websoket
     * @method handleBeforeUpload 上传前的回调
     * @method handleRemove 移除回调
     * @method handleExceed 超过限制文件回调
     * @method handleSuccess 上传成功的回调
     * @method handleError 上传失败的回调
     * @method handleModalClose 模态框关闭的回调
     * @method
     *
     */
    // initWebsocket() {
    //   this.websocket = new WebSocket(wsUrl);
    //   this.websocket.onopen = this.websocketonopen;
    //   this.websocket.onerror = this.websocketonerror;
    //   this.websocket.onmessage = this.websocketonmessage;
    // },
    // closeWebsocket() {},
    // websocketonopen() {
    //   console.log("websocket连接成功");
    // },
    // websocketonerror(e) {
    //   console.log("websocket报错");
    // },
    // websocketonmessage(e) {
    //   console.log(e.data);
    // },
    getUnitNumber() {
      http("/data/getunitnumber", "get").then(res => {
        this.unitArr = res;
        this.unitnumber = res[0]; //设置默认值
      });
    },
    handleBeforeUpload(file) {
      let isTxt =
        file.type == "text/plain" || file.type == "application/zip"
          ? true
          : false;
      // let size = file.size / 1024 / 1024 < 1;
      if (!isTxt) {
        this.$message.error("上传文件只能是 TXT/ZIP 格式!");
      }
      // if (!size) {
      //   this.$message.error("上传文件大小不能超过 1MB!");
      // }
      // return isXlsx && size;
      this.uploadData = { unitnumber: this.unitnumber };
      return isTxt;
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    handProgress(event, file, fileList) {
      // this.$router.push("/home/computedResult")
      // this.dialogFormVisible = true;
      // setTimeout(() => {
      //   this.active = 2;
      // }, 2000);
    },
    handleSuccess(res, file, fileList) {
      debugger;
      this.$router.push("/home/computedResult");
    },
    handleError(err, file, fileList) {
      this.$message.error("上传失败,请重试");
    },
    handleModalClose(done) {
      this.$confirm("正在解析计算数据,确认关闭？").then(res => {
        done();
      });
    }
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

