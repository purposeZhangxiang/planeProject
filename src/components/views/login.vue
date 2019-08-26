<template>
  <div class="container">
    <div class="form1">
      <div class="title">
        <h2>{{name}}</h2>
      </div>
      <el-form :model="formObj" :rules="rules" ref="formObj" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="formObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formObj')">登录</el-button>
          <el-button @click="resetForm('formObj')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "../../api/http";
export default {
  data() {
    /**
     *@method checkAccount 账号验证规则
     *@method validatePass 密码验证规则
     *@param {formObj} 双向绑定表单值
     *@param {rules} 用什么事件去触发验证函数
     *@param {name} 后台管理系统名称
     */
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      formObj: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: checkAccount, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      },
      name: "单机寿命监控系统"
    };
  },
  created() {},
  methods: {
    /**
     * @method submitForm 登录方法
     * @method resetForm 重置input框
     */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formObj.scope = "pc";
          this.formObj.client_id = "pc_client";
          this.formObj.client_secret = 123456;
          this.formObj.grant_type = "password";
          login("/oauth/token", "post", this.formObj).then(res => {
            sessionStorage.setItem("token", res.access_token);
            this.$message.success("登陆成功");
            this.$router.push("/home");
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='less' scoped>
.container {
  width: 100%;
  height: 100vh;
  background: url("../../assets/img/timg.jpg") no-repeat;
  background-size: cover;
  overflow: hidden;
  .form1 {
    margin: 300px auto;
    width: 400px;
    height: 400px;
  }
  .title {
    height: 60px;
    text-align: center;
    color: white
  }
}

.el-form-item__label {
  color: white;
}
</style>

<style>
/* label字体颜色 */
</style>

