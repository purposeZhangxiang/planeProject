<template>
  <div>
    <commomBread :nowLocation="nowLocation"></commomBread>
    <div class="fdrBight">
      <div class="fdrList standMessage">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeTable"
          node-key="label"
          default-expand-all
        ></el-tree>
      </div>
      <div class="fdrTable">
        <el-form :inline="true" :model="searchInput" class="demo-form-inline standMessage">
          <el-form-item>
            <el-select clearable v-model="searchInput.condition" placeholder="请选择">
              <el-option label="起落编号" value="QLBH"></el-option>
              <el-option label="飞行日期" value="QFSJ"></el-option>
              <el-option label="文件名" value="WJM"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchInput.include" placeholder="包含">
              <el-option label="包含" value="like"></el-option>
              <el-option label="等于" value="eq"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input clearable v-model="searchInput.keyword" placeholder="请输入搜索内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- table -->
        <el-table :data="tableData" ref="dataId" class="dataTd" style="width: 100%;">
          <el-table-column
            v-for="(item,index) in theadText"
            :key="index"
            :prop="item.prop"
            :label="item.name"
          ></el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleLook(scope.$index, scope.row)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
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
    </div>
  </div>
</template>

<script>
import { http } from "../../../api/http";
export default {
  name: "fdrBight",
  data() {
    return {
      nowLocation: ["数据查询统计", "飞参数据"],
      searchInput: {
        condition: "",
        include: "like",
        keyword: ""
      },
      tableData: [],
      theadText: [
        { name: "出厂编号", prop: "CCBH" },
        { name: "起落编号", prop: "QLBH" },
        { name: "飞行日期", prop: "QFSJ" },
        { name: "文件名称", prop: "WJM" }
      ],
      //tree
      treeData: [],
      defaultProps: {
        children: "child",
        label: "label"
      },
      //requestData
      requestData: {
        CCBH: "",
        BDBH: ""
      },
      //page
      deaufltPage: 1,
      deaufltPageSize: 10,
      pageSize: [10, 15, 20],
      totalData: 0
    };
  },
  components: {
    commomBread: () => import("../../common/bread.vue")
  },
  created() {
    this.getTree();
  },
  methods: {
    getTree() {
      http("/data/dataTree", "get").then(res => {
        this.treeData = res;
      });
    },
    search() {
      //构建json
      let json = {};
      json[this.searchInput.condition] = this.searchInput.keyword;
      json["selectType"] = this.searchInput.include;
      this.getTable(json);
    },
    //节点被点击时的回调
    nodeTable(data, node, label) {
      // 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
      if (node.level == "3") {
        this.requestData.CCBH = data.label;
        this.requestData.BDBH = node.parent.parent.label;
        this.getTable();
      }
    },
    getTable(serachData) {
      this.requestData.currentPage = this.deaufltPage;
      this.requestData.pageSize = this.deaufltPageSize;
      let options = {};
      if (serachData) {
        Object.assign(options, serachData, this.requestData);
      } else {
        Object.assign(options, this.requestData);
      }
      // console.log(options);
      http("/data/dataTable", "post", options).then(res => {
        console.log(res.records);
        this.totalData = res.total;
        this.tableData = res.records;
      });
    },
    // 切换page
    handleSizeChange(size) {
      this.deaufltPage = 1;
      this.deaufltPageSize = size;
      this.getTable();
    },
    // 切换size
    handleCurrentChange(val) {
      this.deaufltPage = val;
      this.getTable();
    }
  }
};
</script>

<style>
.fdrBight {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.fdrBight .fdrList {
  /* width: 12%; */
  padding-right: 30px;
}

.fdrBight .fdrTable {
  width: 87%;
}

.el-table .cell {
  white-space: nowrap !important;
}
</style>
