<template>
  <div class="breadNav">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/echars' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in nowLocation" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    nowLocation: {
      type: Array
    }
  }
};
</script>

<style lang="less" scoped>
.breadNav {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
</style>
