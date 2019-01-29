<template >
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="incomeNo"
        label="单号"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户名称"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="金额"
      >
      </el-table-column>
      <el-table-column label="时间">
        <template slot-scope="scope">
          {{new Date(scope.row.update_time).toLocaleString().replace(/:\d{1,2}$/,' ')}}
        </template>
      </el-table-column>
      <el-table-column label="收款状态">
        <template slot-scope="scope">
          {{scope.row.status == 1 ? '已付款' : '未付款'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleEdit(scope.row)"
            v-if="scope.row.status == 0"
          >收款确认</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dataList: []
    };
  },
  methods: {
    getDataList() {
      this.$http.post("/income").then(res => {
        if (res.data.msg == "success") {
          this.dataList = res.data.data;
        }
      });
    },
    handleEdit(item) {
      this.$http.post("/editIncome", { id: item.id, status: 1 }).then(res => {
        if (res.data.msg == "success") {
          this.getDataList();
        }
      });
    }
  },
  created() {
    this.getDataList();
  }
};
</script>
<style scoped>
.el-table {
  border: 1px solid #ebeef5;
  margin-top: 20px;
}
</style>

