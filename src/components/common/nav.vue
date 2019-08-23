<template>
  <div class="nav">
    <el-menu
      :router="true"
      :unique-opened="true"
      default-active="1-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu v-for="(item,index) in navgroup" :index="index+''" :key="index">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item
          v-for="(sonItem,sonIndex) in item.sonMenu"
          :index="sonItem.router.path+''"
          :key="sonIndex"
        >{{sonItem.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import mixin from "../../util/mixin.js";
export default {
  mixins: [mixin],
  props: {
    isCollapse: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {};
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    }
  }
};
</script>

<style lang='less' scoped>
@bgc: #545c64;
@bgc1: #ebf1f6;
.nav {
  height: calc(100vh - 70px);
  background: @bgc;
  float: left;
  overflow: auto;
}

.el-menu {
  border-right: none;
}
</style>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

</style>