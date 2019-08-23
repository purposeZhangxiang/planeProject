<template>
  <div>
    <el-form :inline="true" :model="searchInput" class="searchInput">
      <el-form-item>
        <el-button type="primary" @click="add">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteSome">批量删除</el-button>
      </el-form-item>
      <el-form-item label="筛选条件">
        <el-select v-model="searchInput.condition">
          <el-option
            v-for="(item,index) in theadText"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchInput.include">
          <el-option label="包含" value="包含"></el-option>
          <el-option label="等于" value="等于"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchInput.keyword" placeholder="字段"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {http} from "../../api/http";
export default {
  props: {
    theadText: Array,
    multipleSelection: Array
  },
  data() {
    return {
      searchInput: {
        keyword: "",
        condition: "",
        include: "包含"
      }
    };
  },
  created() {
    this.searchInput.condition = this.theadText[0].name; //默认展示第一项
  },
  methods: {
    search() {
      alert(this.searchInput.condition + this.searchInput.include);
      http("", "post", {}).then(res=>{
        
      })
    },
    add() {},
    deleteSome() {}
  }
};
</script>

 <style lang="less">
.searchInput {
  margin-top: 10px;
}
</style>

