<template>
  <div class="app-container">
    <el-row>
      <el-select v-model="searchType" placeholder="请选择搜索类型">
        <el-option label="名称" value="name"></el-option>
        <el-option label="专业区域" value="major"></el-option>
      </el-select>
      <el-input v-model="searchValue" size="mini" placeholder="输入关键字搜索" style="width:200px" />
      <el-date-picker v-model="searchTime" type="datetimerange" :picker-options="pickerOptions2" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" align="right">
      </el-date-picker>
      <el-button type="primary" style="margin-left:10px;" @click="search">搜索</el-button>
    </el-row>
    <el-table :data="searchData" style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="150px" align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="专业区域">
        <template slot-scope="scope">
          <span>{{ scope.row.major }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="需求方">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="项目详情">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="费用">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="发布状态">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.release_status == 1">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.release_status == 2">已发布</el-tag>
          <el-tag type="danger" v-if="scope.row.release_status == 3">审核未通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="起讫时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }} ~ {{ scope.row.update_time |
            parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="approve(scope.row.id,2)" v-if="scope.row.release_status == 1">审核通过</el-button>
          <el-button size="mini" type="danger" @click="approve(scope.row.id,3)" v-if="scope.row.release_status == 1">审核拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    mapState
  } from "vuex";
  export default {
    data() {
      return {
        dataList: [],
        searchData: [],
        searchType: "",
        searchValue: "",
        searchTime: "",
        pickerOptions2: {
          shortcuts: [{
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              }
            }
          ]
        },
      };
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.user
      })
    },
    methods: {
      getProjectList() {
        this.$http.post("/getProjectList").then(res => {
          this.dataList = res.data.pageData;
          this.searchData = res.data.pageData;
        });
      },
      search() {
        this.searchData = this.dataList.filter(data =>
          data[this.searchType] ?
          data[this.searchType].indexOf(this.searchValue) !== -1 :
          true
        );
        if (this.searchTime.length) {
          this.searchData = this.dataList.filter(
            data =>
            new Date(data.create_time).getTime() >
            new Date(this.searchTime[0]).getTime() &&
            new Date(data.update_time).getTime() <
            new Date(this.searchTime[1]).getTime()
          );
        }
      },
      openWindow(url) {
        window.open(`../../../../service/upload/${url}`);
      },
      approve(id, status) {
        this.$http.post("/updateProjectStatus", {
          id,
          status
        }).then(res => {
          if (res.data.msg == "success") {
            this.$message({
              showClose: true,
              message: "修改成功",
              type: "success"
            });
            this.getProjectList();
          }
        });
      }
    },
    created() {
      this.getProjectList();
    }
  };

</script>
<style scoped>
  .el-table {
    border: 1px solid #ebeef5;
    margin-top: 20px;
  }

  .el-input {
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 5px;
    -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    color: #212121;
    margin-right: 10px;
  }

  .el-select {
    width: 200px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 10px;
  }

</style>
