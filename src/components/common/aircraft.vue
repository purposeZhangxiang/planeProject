<!--[机动动作,科目]统计-->
<template>
    <div>
        <el-table :data="jsonData" style="width: 100%">
            <el-table-column prop="number" class="aircraft" :label="aircraft"></el-table-column>
            <el-table-column :label="subjectClasses">
                <el-table-column prop="date" :label="trialFlight"></el-table-column>
                <el-table-column prop="name" :label="takeOff"></el-table-column>
                <el-table-column prop="address" :label="subjects"></el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
  export default {
    props: {
      theadText: Array,
      jsonData: Array,
    },
    name: "aircraft",
    data() {
      return {
        aircraft: '',
        trialFlight: '',
        subjectClasses: '',
        takeOff: '',
        subjects: ''
      }
    },
    mounted() {
      this.aircraft = this.theadText[0].name;
      this.trialFlight = this.theadText[1].name;
      this.subjectClasses = this.theadText[2].name;
      this.takeOff = this.theadText[3].name;
      this.subjects = this.theadText[4].name;
    }
  }
</script>
