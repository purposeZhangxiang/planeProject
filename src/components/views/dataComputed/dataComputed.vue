<template>
  <div>
    <breadNav :nowLocation="nowLocation"></breadNav>
    <div style="z-index:-1;display:none">
      <el-upload :action="action" :before-upload="handleBeforeUpload" :on-remove="handleRemove" :headers='headers'
        :on-success="handleSuccess" :on-error="handleError" :on-progress="handleProgress" :data="uploadData" multiple
        ref="upload">
        <el-button id="submit"></el-button>
      </el-upload>
    </div>
    <!-- 流程图 -->
    <!-- 文件上传组件 -->
    <div class="upload">
      <div class="item">
        <div class="uploadImgBtn">
          <img src="../../../assets/img/dataInput.png" alt="选择需要导入的飞参文件" @click="handleCheck" />
        </div>
      </div>
    </div>
    <el-dialog title="数据导入详情" :visible.sync="dialogFormVisible" width="600px" :model="false" :close="handleClose">
      <div style='postion:relative;width:100%;height:100%'>
        <div id='loading_container' style='width:100%;height:400px;'>
        </div>
        <div id="infomation_container" type="textarea" :rows="20" v-html="infomation"
          style="position:absolute;top:50px;height:450px;overflow:auto;width:95%">
          {{infomation}}</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfoCancel">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 模态框选择部队 -->
    <el-dialog title="选择部队" :visible.sync="selectUnit" width="350px">
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
    <div id="progress" class="show_progress">
      <!--el-progress type="circle" :percentage="percent"></el-progress>-->
      <div class='step'>
        <el-progress type="line" :percentage="itemPercen" :stroke-width="15" :show-text='false'></el-progress>
      </div>
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
  import {
    Loading
  } from 'element-ui';
  let loadingServer = null;
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
       * @param {}
       * @param {}
       */
      return {
        nowLocation: ["数据导入计算"],
        unitnumber: "",
        unitArr: [],
        action: `${baseUrl}/data/inputdata`,
        uploadData: {},
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem('token')
        },
        dialogTitle: "数据导入计算",
        dialogFormVisible: false,
        active: 1,
        activeStatus: "",
        selectUnit: false,
        infomation: "",
        percent: 0,
        itemPercen: 0,
        websocket: null,
      };
    },
    created() {
      this.getUnitNumber();
    },
    methods: {
      /**
       * @method handleBeforeUpload 上传前的回调
       * @method handleRemove 移除回调
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
          this.uploadData.token = sessionStorage.getItem("token");
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
        // const element = document.getElementById("progress");
        // element.style.display = "block";
        this.initWebsocket();
        var element = document.getElementById("infomation_container");
        setTimeout(function () {
          var element = document.getElementById("loading_container");
          loadingServer = Loading.service({
            target: document.body,
            fullscreen: true,
            text: "飞参数据解析中",
            background: "rgba(0,0,0,0)"
          })
        }, 0.1)
        return isTxt;
      },
      handleProgress(evt) {
        this.itemPercen = parseInt(evt.percent);
      },
      handleRemove(file, fileList) {},
      handleSuccess(res, file, fileList) {
        if (res.code == "90000003") {
          this.setInfomation("error", res.msg);
        } else if (res.result == "0000") {
          var dataStr = JSON.stringify(res.data);
          window.alinkClick = obj => {
            let data = JSON.parse(obj.getAttribute("data"));
            this.$router.push({
              path: "/home/computedResult",
              query: {
                param: this.dealData(data)
              }
            });
          };
          this.setInfomation(
            "success",
            `<span style='cursor:pointer' data='${dataStr}' onclick='alinkClick(this)' >导入飞参数据成功  <a href='#'  > 查看详情</a><span>`
          );
        } else {
          this.$refs.upload.clearFiles();
          this.setInfomation("error", res.msg);
        }
        this.handleClose();
        const element = document.getElementById("progress");
        element.style.display = "none"
      },
      handleError(err, file, fileList) {
        //清空原来的上传文件列表
        this.$refs.upload.clearFiles();
        this.setInfomation("error", "上传失败,请重试");
        this.handleClose();
      },
      handleClose() {
        // document.getElementById("progress").style.display = "none";
        this.percent = 0;
        this.itemPercen = 0;
        clearInterval(this.inter);
        loadingServer.close();
      },
      handleCheck(event) {
        if (this.unitArr.length > 1) {
          this.selectUnit = true;
        } else {
          document.getElementById("submit").click();
        }
      },
      dialogFormCancel() {
        this.selectUnit = false;
      },
      dialogOk() {
        this.selectUnit = false;
        document.getElementById("submit").click();
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
          if (month < 10) clock += "0";
          clock += month + "-";
          if (day < 10) clock += "0";
          clock += day + " ";
          if (hh < 10) clock += "0";
          clock += hh + ":";
          if (mm < 10) clock += "0";
          clock += mm + ":";
          if (ss < 10) clock += "0";
          clock += ss;
          return clock;
        }
        const string = `${curentTime()} ${text}`;
        let color = "black";
        switch (type) {
          case "success":
            color = "green";
            break;
          case "error":
            color = "red";
            break;
        }
        this.infomation = this.infomation ?
          this.infomation +
          `</br><span style='display:inline-block;padding:2px 0px;color:${color}'>${string}` :
          `<span style='color:${color}'>${string}`;
        setTimeout(function () {
          var ele = document.getElementById("infomation_container");
          ele.scrollTop = ele.scrollHeight;
        }, 0.1);
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
      },
      initWebsocket() {
        if ("WebSocket" in window) {
          this.websocket = new WebSocket(wsUrl + "/" + sessionStorage.getItem("token"));
        } else if ("MozWebSocket" in window) {
          this.websocket = new MozWebSocket(wsUrl);
        } else {
          this.websocket = new SockJS(wsUrl);
        }
        const websocket = this.websocket;
        websocket.onopen = function (evnt) {
          console.log("ok");
        };
        websocket.onmessage = (evnt) => {
          const data = JSON.parse(event.data);
          data && this.setInfomation("info", `${data[0]},处理进度${data[1]}`);
          this.percent = data[1];
          clearInterval(this.inter);
          this.inter = setInterval(() => {
            this.itemPercen += 15;
            if (this.itemPercen >= 100) {
              this.itemPercen = 15;
            }
          }, 300)
        };
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