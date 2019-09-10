<template>
  <div class="nav">
    <el-menu
      :router="true"
      :unique-opened="true"
      default-active="1-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <!-- <el-submenu v-for="(item,index) in navgroup" :index="index+''" :key="index">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item
          v-for="(sonItem,sonIndex) in item.sonmenu"
          :index="sonItem.router+''"
          :key="sonIndex"
        >{{sonItem.name}}</el-menu-item>
      </el-submenu>
      <el-menu-item index="1-2">
        <i class="el-icon-menu"></i>
        <span slot="title">静态</span>
      </el-menu-item>-->

      <div v-for="(item,index) in navgroup" :index="index+''" :key="index">
        <!-- include submenu -->
        <el-submenu v-if="item.sonmenu" :index="index+''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item
            v-for="(sonItem,sonIndex) in item.sonmenu"
            :index="sonItem.router+''"
            :key="sonIndex"
          >{{sonItem.name}}</el-menu-item>
        </el-submenu>
        <!-- singel menu -->
        <el-menu-item :index="item.router" v-else>
          <i :class="item.icon"></i>
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </div>
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
  methods: {}
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