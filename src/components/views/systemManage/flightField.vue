<template>
  <div>
    <bread :nowLocation="nowLocation"></bread>
    <!-- oprerate bar -->
    <div class="operated">
      <el-form :inline="true">
        <el-form-item label="批量设置采样率">
          <el-input v-model="global" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setting">设置</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p>
      此页面的任何操作需要点击
      <span style="color:red;font-size:20px;">保存按钮</span>才会保存至数据库
    </p>
    <!-- table -->
    <el-table :data="tableData">
      <el-table-column prop="mingchen" label="名称"></el-table-column>
      <el-table-column prop="xianshiming" label="显示名"></el-table-column>
      <el-table-column prop="mbdw" label="目标单位"></el-table-column>
      <el-table-column prop="duiyinglie" label="对应列数"></el-table-column>
      <el-table-column prop="caiyanglv" label="采样率"></el-table-column>
      <el-table-column prop="cxshizhensx" label="超限失真上限"></el-table-column>
      <el-table-column prop="cxshizhenxx" label="超限失真下限"></el-table-column>
      <el-table-column prop="bhlshizhensx" label="变化率失真"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog title="修改" :visible.sync="showDialog">
      <el-form :model="dialogForm" :rules="rules" ref="ruleForm">
        <el-form-item label="名称" label-width="120px" prop="mingchen">
          <el-input v-model="dialogForm.mingchen"></el-input>
        </el-form-item>

        <el-form-item label="显示名" label-width="120px" prop="xianshiming">
          <el-input v-model="dialogForm.xianshiming"></el-input>
        </el-form-item>
        <el-form-item label="对应列数" label-width="120px" prop="duiyinglie">
          <el-input type="number" v-model="dialogForm.duiyinglie"></el-input>
        </el-form-item>
        <el-form-item label="采样率" label-width="120px" prop="caiyanglv">
          <el-input type="number" v-model="dialogForm.caiyanglv"></el-input>
        </el-form-item>
        <el-form-item label="超限失真上限" label-width="120px" prop="cxshizhensx">
          <el-input type="number" v-model="dialogForm.cxshizhensx"></el-input>
        </el-form-item>
        <el-form-item label="超限失真下限" label-width="120px" prop="cxshizhenxx">
          <el-input type="number" v-model="dialogForm.cxshizhenxx"></el-input>
        </el-form-item>
        <el-form-item label="变化率失真" label-width="120px">
          <el-input type="number" v-model="dialogForm.bhlshizhensx"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { http } from "../../../api/http";

export default {
  data() {
    return {
      nowLocation: ["系统管理", "飞参字段设置"],
      global: "",
      tableData: [],

      showDialog: false,
      index: "",
      dialogForm: {
        mingchen: "",
        xianshiming: "",
        duiyinglie: "",
        caiyanglv: "",
        cxshizhensx: "",
        cxshizhenxx: "",
        bhlshizhensx: ""
      },
      rules: {
        mingchen: [
          { required: true, message: "此项不能为空", trigger: "blur" }
        ],
        xianshiming: [
          { required: true, message: "此项不能为空", trigger: "blur" }
        ],
        duiyinglie: [
          { required: true, message: "此项不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        caiyanglv: [
          { required: true, message: "此项不能为空", trigger: "blur" },
          {
            pattern: /^[1-9]\d*$/,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        cxshizhensx: [
          { required: true, message: "此项不能为空", trigger: "blur" }
        ],
        cxshizhenxx: [
          { required: true, message: "此项不能为空", trigger: "blur" }
        ],
        bhlshizhensx: [
          { required: true, message: "此项不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    bread: () => import("../../common/bread")
  },
  created() {
    this.getPrams();
  },

  methods: {
    getPrams() {
      let mbdw = ["m", "km/h", "g", "h", "逻辑值", "kg","kg"];
      http("/fcsjcspz/getFcsjcspzlist", "post").then(res => {
        this.tableData = res;
        //静态列
        for (let index in this.tableData) {
          this.tableData[index].mbdw = mbdw[index];
        }
      });
    },
    setting() {
      for (let val of this.tableData) {
        val.caiyanglv = this.global;
      }
    },
    save() {
      http("/fcsjcspz/saveFcsjcspz", "post", this.tableData).then(res => {
        this.$message.success("修改成功");
        this.getPrams();
      });
    },
    handleUpdate(index, row) {
      this.showDialog = !this.showDialog;
      Object.assign(this.dialogForm, row);
      this.index = index;
    },
    ok() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let settingData = this.dialogForm;
          Object.assign(this.tableData[this.index], settingData);
          this.showDialog = !this.showDialog;
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.operated {
  margin-top: 10px;
}
</style>


