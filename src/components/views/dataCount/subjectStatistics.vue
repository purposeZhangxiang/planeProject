<!--科目统计-->
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
            <el-form-item label="飞行时间">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"
                                    style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2" style="text-align: center">-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date2"
                                    style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <aircraft :theadText="theadText" :jsonData="jsonData"></aircraft>
    </div>
</template>

<script>
  export default {
    name: "subjectStatistics",
    data() {
      return {
        theadText: [
          {name: "飞机(出厂编号)"},
          {name: "试飞80度角"},
          {name: "科目类别"},
          {name: "起飞性科目"},
          {name: "科目3"}
        ],
        jsonData:
          [
            {
              number: '10AT0508',
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            },
            {
              number: '10AT0508',
              date: '2016-05-04',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1517 弄'
            },
            {
              number: '10AT0508',
              date: '2016-05-01',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1519 弄'
            },
            {
              number: '10AT0508',
              date: '2016-05-03',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1516 弄'
            }
          ],
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
        },
        nowLocation: ['数据查询统计', '科目统计'],
      }
    },
    components: {
      commomBread: () => import('../../common/bread.vue'),
      aircraft: () => import('../../common/aircraft.vue'),
    },
    methods: {
      search() {
        console.log('search!');
      },
    }
  }
</script>
<style>
    .el-table thead.is-group th {
        text-align: center;
    }
</style>

