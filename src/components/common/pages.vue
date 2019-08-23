<!--新的分页-->
<template>
    <div class="block" v-if="tableData.length > 0">
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="defaultPage"
                :page-sizes="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalData"
        ></el-pagination>
    </div>
</template>

<script>
  export default {
    props: {
      tableData: Array,
      totalData: Number
    },
    name: "pages",
    data() {
      /**
       * @param {deaufltPage} 默认展示页
       * @param {currentPage} 当前展示条数
       * @param {currentSize} 每页展示多少条(用作传参)
       * @param {pageSize} 分页器配置展示条数
       */
      return {
        defaultPage: 1,
        currentPage: 1, //当前页
        currentSize: 10, //当前展示条数
        pageSize: [10, 15, 20], //每页展示
      }
    },
    methods: {
      handleSizeChange(val) {
        this.currentSize = val;
        this.$emit("getTableData", 1, val)
      },
      //当前页: ${val}
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$emit("getTableData", val, this.currentSize)
      },
    }
  }
</script>
