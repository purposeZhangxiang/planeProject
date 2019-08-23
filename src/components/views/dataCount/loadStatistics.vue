<!--载荷超越数统计-->
<template>
    <div>
        <commomBread :nowLocation="nowLocation"></commomBread>
        <el-form :inline="true" :model="form" class="demo-form-inline standMessage">
            <el-form-item label="部队选择">
                <el-input clearable v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="飞机选择">
                <el-input clearable v-model="form.region"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="jsonData" style="width: 100%;">
            <el-table-column prop="aircraft" label="飞机"></el-table-column>
            <el-table-column v-for="(item,index) in theadText" :key="index" :prop="item.prop"
                             :label="item.name"></el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    name: "loadStatistics",
    data() {
      return {
        form: {
          name: '',
          region: ''
        },
        theadText: [
          {name: "Nz峰值",prop:'number'},
          {name: "超越数",prop:'date'},
          {name: "Nz谷值",prop:'name'},
          {name: "超越数",prop:'address'}
        ],
        jsonData: [
          {
            number: '10AT0508',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }
        ],
        nowLocation: ['数据查询统计', '载荷超越数统计'],
      }
    },
    components: {
      commomBread: () => import('../../common/bread.vue'),
    },
    methods: {
      search() {

      }
    }
  }
</script>

<style>
    .el-table .cell, .el-table th div {
        text-align: center;
    }
</style>
