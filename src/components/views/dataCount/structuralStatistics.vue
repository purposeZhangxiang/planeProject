<!--结构超载情况统计-->
<template>
    <div>
        <commomBread :nowLocation="nowLocation"></commomBread>
        <el-form :inline="true" :model="formInline" class="demo-form-inline standMessage">
            <el-form-item>
                <el-select clearable v-model="formInline.user" placeholder="飞机编号">
                    <el-option v-for="items in cities" :key="items.value" :label="items.label" :value="items.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select clearable v-model="formInline.region" placeholder="包含">
                    <el-option label="包含" value="like"></el-option>
                    <el-option label="等于" value="eq"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="formInline.searchs"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="jsonData" style="width: 100%;">
            <el-table-column v-for="(item,index) in theadText" :key="index" :prop="item.prop"
                             :label="item.name"></el-table-column>
        </el-table>
        <div class="page" v-if="tableData.length>0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="deaufltPage"
                    :page-sizes="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalData"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
  import {http} from '../../../api/http'

  export default {
    name: "structuralStatistics",
    data() {
      return {
        cities: [{
          value: 'Beijing',
          label: '北京'
        },
          {
            value: 'Shanghai',
            label: '上海'
          }],
        // * @param {totalData} 分页器总数
        totalData: 10,
        tableData: [{name: 1}],
        formInline: {
          user: '',
          region: '',
          searchs: ''
        },
        deaufltPage: 1, //默认展示页码
        currentPage: 1, //当前页
        currentSize: 10, //当前展示条数
        pageSize: [10, 15, 20], //每页展示
        nowLocation: ["数据查询统计", "结构超载情况统计"],
        theadText: [
          {name: "飞机编号", prop: 'number'},
          {name: "飞机型号", prop: 'classes'},
          {name: "超载发生时间", prop: 'time'},
          {name: "检查日期", prop: 'date'},
          {name: "机动类别", prop: 'class'},
          {name: "载荷类别", prop: 'address'}
        ],
        jsonData: [
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            number: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },


        ],
      }
    },
    components: {
      commomBread: () => import('../../common/bread.vue')
    },
    created() {
      this.getTableData();
    },
    methods: {
      //* @method handleSizeChange 分页器回调(展示条数)
      // * @method handleCurrentChange 分页器回调(当前页)
      search() {

      },
      handleSizeChange(val) {
        this.currentSize = val;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      getTableData() {
        let json = {
          currentPage: this.currentPage || 1,
          pageSize: this.currentSize || 10
        };
        http("/planeType/findAllPageByConditions", "post", json).then(res => {
          console.log(res);
          this.totalData = res.total;
        });
      },
    }
  }
</script>

<style>
    .page {
        width: 100%;
        height: 40px;
        background: #f2f2f2;
        display: flex;
        margin-top: 10px;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
    }

    .el-table .cell, .el-table th div {
        text-align: center;
    }
</style>
