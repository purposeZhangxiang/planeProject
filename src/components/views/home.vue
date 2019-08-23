<template>
  <div>
    <heads @open="open"></heads>
    <div class="container">
      <bar :isCollapse="isCollapse"></bar>
      <div class="route">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    /**
     * @param {isCollapse} 收缩/展开导航菜单
     */
    return {
      isCollapse: false
    };
  },
  components: {
    bar: () => import("./../common/nav.vue"),
    heads: () => import("./../common/heads.vue")
  },
  methods: {
    /**
     * @method open 控制导航菜单伸缩
     */
    open() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang='less' scoped>
@heightM: calc(100vh - 70px);

.container {
  display: flex;
  height: @heightM;
}
.route {
  overflow: auto;
  flex: 1;
  padding: 20px;
  box-sizing: border-box;
}
</style>










