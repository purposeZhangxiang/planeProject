<template>
  <div class="header">
    <div id="logo" :class="iconClick? 'leftLocation':'centerLocation'">
      <img src="../../assets/logo.png" alt="logo">
    </div>
    <div class="setting">
      <div class="controlIcon">
        <i :class="iconLR" @click="open"></i>
      </div>
      <el-dropdown trigger="hover">
        <span class="el-dropdown-link userinfo-inner">
          <img src="../../assets/avator.png">
          <span style="color:#fff;display:inline-block;padding:0 10px;">你好,{{username}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="setting">设置</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import mixin from '../../util/mixin';
export default {
  mixins:[mixin],
  data() {
    return {
      iconLR: "iconfont icon-caidan iconSize",
      iconClick: false
    };
  },
  methods: {
    /**
     * @method open 导航栏收缩展开回调
     * @method logout 注销登录
     * @method setting 用户设置
     */
    open() {
      if (this.iconLR == "iconfont icon-caidan iconSize") {
        this.iconClick = true;
        this.iconLR = "iconfont icon-zhankai iconSize";
      } else {
        this.iconClick = false;
        this.iconLR = "iconfont icon-caidan iconSize";
      }
      this.$emit("open");
    },
    logout() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          sessionStorage.removeItem("token");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    setting() {
      this.$router.push("/home/setting");
    }
  }
};
</script>

<style lang='less' scoped>
@bgc: #363d47;
@bgc1: #545c64;
.header {
  height: 70px;
  line-height: 70px;
  width: 100%;
  background: @bgc1;
  display: flex;
  .leftLocation {
    width: 64px;
    height: 100%;
    text-align: left;
    img {
      width: 64px;
      height: 64px;
      vertical-align: middle;
      transform: scale(0.6);
      transition: all 0.3s linear;
    }
  }
  .centerLocation {
    width: 200px;
    height: 100%;
    text-align: center;
    img {
      width: 64;
      height: 64px;
      vertical-align: middle;
      transform: scale(1);
      transition: all 0.3s linear;
    }
  }
  .iconSize {
    font-size: 26px;
    color: #fff;
  }
  .setting {
    flex: 1;
    display: flex;
    // width: calc(100% - 200px);
    justify-content: space-between;
  }
  .userinfo-inner {
    display: inline-block;
    width: 160px;
    height: 70px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      vertical-align: middle;
    }
  }
}
</style>
