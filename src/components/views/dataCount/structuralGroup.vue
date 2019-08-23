<!--单机结构损伤情况-->
<template>
    <div>
        <commomBread :nowLocation="nowLocation"></commomBread>
        <el-form :inline="true" :model="formInline" class="demo-form-inline standMessage">
            <el-form-item>
                <el-select clearable v-model="formInline.user" placeholder="出厂编号">
                    <el-option v-for="items in cities" :key="items.value" :label="items.label"
                               :value="items.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select clearable v-model="formInline.region" placeholder="包含">
                    <el-option label="包含" value="like"></el-option>
                    <el-option label="等于" value="eq"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input clearable v-model="formInline.context" placeholder="请输入搜索内容"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="jsonData" ref="dataId" @row-click="tableCell" class="dataTd single" style="width: 100%;"
                  center>
            <el-table-column v-for="(item,index) in theadText" :key="index" :prop="item.prop"
                             :label="item.name"></el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="deaufltPage"
                    :page-sizes="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalData"
            ></el-pagination>
        </div>
        <div></div>
        <el-dialog title="关键部位数据信息" @opened="chartLines(idData)" :visible.sync="centerDialogVisible" width="80%" center>
            <img style="width: 100%" v-for="(items,index) in idData" :key="index" :src="items.images" alt="">
            <section class="chart-container">
                <el-col :span="24">
                    <div id="chartLine" style="width:100%; height:600px;"></div>
                </el-col>
            </section>
            <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
                <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
  </span>
        </el-dialog>
    </div>
</template>

<script>
  import {http} from '../../../api/http';
  import img from '../../../assets/img/timg.jpg';

  export default {
    name: "SingleDamage",
    data() {
      return {
        idData: [],
        cities: [{
          value: 'Beijing',
          label: '北京'
        },
          {
            value: 'Shanghai',
            label: '上海'
          }],
        // chartLine: null,
        centerDialogVisible: false,
        // * @param {totalData} 分页器总数
        totalData: 10,
        tableData: [{name: 1}],
        deaufltPage: 1, //默认展示页码
        currentPage: 1, //当前页
        currentSize: 5, //当前展示条数
        pageSize: [10, 15, 20], //每页展示
        formInline: {
          user: '',
          context: '',
          region: ''
        },
        nowLocation: ["数据查询统计", "机群结构损伤情况"],
        theadText: [
          {name: "出厂编号", prop: 'id'},
          {name: "飞机型号", prop: 'classes'},
          {name: "出厂年月", prop: 'time'},
          {name: "服役日期", prop: 'date'},
          {name: "部队编号", prop: 'class'},
          {name: "关键部位编号", prop: 'crux'},
          {name: "AFH", prop: 'AFH'},
          {name: "EFH", prop: 'EFH'},
          {name: "预计剩余EFH", prop: 'yujEFH'},
          {name: "预计剩余AFH", prop: 'yujAFH'},
          {name: "预计检查剩余AFH", prop: 'examineAFH'},
          {name: "预计检查日期", prop: 'examineDate'},
        ],
        jsonData: [
          {
            id: '10AT0508',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            crux: 'G102',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: '10AT0507',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            crux: 'G102',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: '10AT0506',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            crux: 'G102',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: '10AT0505',
            classes: '10AT0508',
            time: '10AT0508',
            date: '2016-05-02',
            class: '王小虎',
            crux: 'G102',
            address: '上海市普陀区金沙江路 1518 弄'
          }
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
      //echars图标函数chartLines
      chartLines(idData) {
        console.log(idData);
        let chartLine = this.$echarts.init(document.getElementById("chartLine"));
        chartLine.setOption({
          title: {
            text: "Line Chart"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["邮件营销", "联盟广告", "搜索引擎"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "邮件营销",
              type: "line",
              stack: "总量",
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: "联盟广告",
              type: "line",
              stack: "总量",
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: "搜索引擎",
              type: "line",
              stack: "总量",
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        });
      },
      search() {

      },
      //分页函数
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
          console.log(res.total);
          this.totalData = res.total;
        });
      },
      tableCell(row, column, cell, event) {
        let tColumn = column.target.innerText, reg = "^[a-z,A-Z]|\d$";
        if (tColumn.match(reg) === null) {
          return false;
        } else {
          if (tColumn.match(reg).input) {
            this.idData = [{
              id: row.id,
              images: img,
            }];
            // console.log(row.id);
            this.centerDialogVisible = true;
          }
        }
      },
    },
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

    .single .el-table__body-wrapper table tbody tr td:nth-child(6) .cell {
        cursor: pointer;
        color: rgba(103, 168, 248, 1.000);
    }

    .el-dialog__body {
        overflow-y: scroll;
        height: 61vh;
    }

    .chart-container {
        width: 100%;
        /* float: left; */
    }

    #chartLine {
        padding: 30px 20px;
        box-sizing: border-box;
    }

    .el-dialog--center {
        height: 74vh;
    }
</style>
