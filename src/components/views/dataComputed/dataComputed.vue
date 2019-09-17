<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <div style='z-index:-1;display:none'>
      <el-upload :action="action" :before-upload="handleBeforeUpload" :on-remove="handleRemove"
        :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProgress" :data="uploadData" multiple
        :on-exceed="handleExceed" ref="upload">
        <el-button id='submit'></el-button>
      </el-upload>
    </div>
    <!-- 流程图 -->
    <!-- 文件上传组件 -->
    <div class="upload">
      <div class="item">
        <div class='uploadImgBtn'>
          <img src="../../../assets/img/dataInput.png" alt="选择需要导入的飞参文件" @click='handleCheck' />
        </div>
      </div>
    </div>
    <el-dialog title="数据导入详情" :visible.sync="dialogFormVisible" :direction="right" width='600px' :model="false">
      <div id='infomation_container' type="textarea" :rows='20' v-html='infomation' style='height:400px;overflow:auto'>
        {{infomation}}
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoCancel">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 模态框选择部队 -->
    <el-dialog title='选择部队' :visible.sync="selectUnit" width="350px">
      <el-form>
        <el-form-item label="部队编号">
          <el-select v-model="unitnumber" @change="selectChange">
            <el-option v-for="item in unitArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
    <div id='progress' class='show_progress'>
      <el-progress type="circle" :percentage="percent" label='文件上传中'></el-progress>
    </div>
  </div>
</template>

<script>
  import {
    baseUrl,
    wsUrl
  } from "../../../api/env";
  import treeVue from "../../common/tree.vue";
  import {
    http
  } from "../../../api/http";
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
        selectUnit: false,
        infomation: "",
        percent: 0,
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
          file.type == "text/plain" || file.type == "application/zip" ?
          true :
          false;
        if (!isTxt) {
          this.$message.error("上传文件只能是 TXT/ZIP 格式!");
        }
        this.dialogFormVisible = true;
        this.setInfomation("info", "开始上传文件:" + file.name);
        const element = document.getElementById("progress");
        element.style.display = "block";
        return isTxt;
      },
      handleProgress(evt) {
        this.percent = parseInt(evt.percent);
        if (evt.percent - 100 >= 0) {
          this.setInfomation("success", `文件上传成功,开始解析飞参数据`);
          document.getElementById("progress").style.display = "none";
          setTimeout(() => {
            this.percent = 0.0
          }, 0.05);
        }
        // this.dialogFormVisible = !this.dialogFormVisible;
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
          this.setInfomation("error", res.msg)
        } else if (res.result == "0000") {
          var dataStr = JSON.stringify(res.data);
          window.alinkClick = (obj) => {
            let data = JSON.parse(obj.getAttribute("data"));
            this.$router.push({
              path: "/home/computedResult",
              query: {
                param: this.dealData(data)
              }
            });
          }
          this.setInfomation("success",
            `<span style='cursor:pointer' data='${dataStr}' onclick='alinkClick(this)' >导入飞参数据成功  <a href='#'  > 查看详情</a><span>`
          )
        } else {
          this.$refs.upload.clearFiles();
          this.setInfomation("error", res.msg)
        }
        // this.dialogFormVisible = !this.dialogFormVisible;
      },
      handleError(err, file, fileList) {
        //清空原来的上传文件列表
        this.$refs.upload.clearFiles();
        this.setInfomation("error", "上传失败,请重试")
      },
      handleModalClose(done) {
        this.$confirm("正在解析计算数据,确认关闭？").then(res => {
          // done();
        });
      },
      handleCheck(event) {
        if (this.unitArr.length > 1) {
          this.selectUnit = true;
        } else {
          document.getElementById('submit').click();
        }
      },
      dialogFormCancel() {
        this.selectUnit = false;
      },
      dialogOk() {
        this.selectUnit = false;
        document.getElementById('submit').click();

      },
      dialogInfoCancel() {
        this.dialogFormVisible = false;
      },
      setInfomation(type, text) {
        function curentTime() {
          var now = new Date();

          var year = now.getFullYear(); //年
          var month = now.getMonth() + 1; //月
          var day = now.getDate(); //日

          var hh = now.getHours(); //时
          var mm = now.getMinutes(); //分
          var ss = now.getSeconds(); //分

          var clock = year + "-";

          if (month < 10)
            clock += "0";

          clock += month + "-";

          if (day < 10)
            clock += "0";

          clock += day + " ";

          if (hh < 10)
            clock += "0";

          clock += hh + ":";
          if (mm < 10)
            clock += '0';
          clock += mm + ":";

          if (ss < 10)
            clock += '0';
          clock += ss;
          return clock;
        }
        const string = `${curentTime()} ${text}`;
        let color = "black";
        switch (type) {
          case "success":
            color = 'green';
            break
          case "error":
            color = 'red';
            break
        }
        this.infomation = this.infomation ? this.infomation +
          `</br><span style='display:inline-block;padding:2px 0px;color:${color}'>${string}` :
          `<span style='color:${color}'>${string}`;
        setTimeout(function () {
          var ele = document.getElementById('infomation_container');
          ele.scrollTop = ele.scrollHeight;
        }, 0.1)
      },
      dealData(data) {
        let arr = [];
        for (let index in data) {
          let json = {
            bdbh: data[index].bdbh,
            ccbh: data[index].ccbh,
            title: "出厂编号 " + data[index].ccbh + " 部队编号 " + data[index].bdbh
          };
          arr.push(json);
        }
        return arr;
      }
    }
  };
</script>

<style lang="less" scoped>
  .show_progress {
    display: none;
    position: absolute;
    width: 130px;
    height: 130px;
    top: 50%;
    left: 50%;
    margin-left: -75px;
    margin-top: -75px;
    z-index: 10000;
  }

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


  .infomation {
    position: absolute;
    right: 20px;
    top: 150px;
    width: 300px;

    .textArea {
      min-height: 400px;
      max-height: 600px;
    }

  }

  .upload {
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;

    .uploadImgBtn {
      img {
        width: 70%;
        margin-left: 15%;
        margin-top: 30px;
        height: auto;
      }
    }
  }
</style>