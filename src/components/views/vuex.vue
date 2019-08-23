<template>
  <div>
    <breadNav :nowLocation="nowLocation"/>
    <div>{{count}}</div>
    <el-row>
      <el-button type="primary" @click="gloabalMethod(true)">count++</el-button>
      <el-button type="success" @click="gloabalMethod()">count--</el-button>
      <el-button type="info" @click="act">触发action</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nowLocation: ["vuex测试","vuex"]
    };
  },
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  components: {
    breadNav: () => import("../common/bread.vue")
  },
  methods: {
    gloabalMethod(param) {
      if (param) {
        this.$store.commit("add");
      } else {
        this.$store.commit("substrct");
      }
    },
    act() {
      this.$store.dispatch("alert");
    }
  }
};
</script>

<style lang="less" scoped>
</style>

