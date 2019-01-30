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
      <el-button type="primary" style="margin-left:10px;">搜索</el-button>
    </el-row>
    <el-table :data="dataList" style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="需求方">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="项目名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="项目介绍">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="费用">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>


      <el-table-column width="110px" align="center" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="起讫时间">
        <template slot-scope="scope">
          <span>{{ scope.row.startTime | parseTime('{y}-{m}-{d} {h}:{i}') }} ~ {{ scope.row.endTime |
            parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="评价">
        <template slot-scope="scope">
          <span>{{ scope.row.evaluate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="250px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">收藏</el-button>
          <el-button size="mini" type="primary">竞标</el-button>
          <el-button size="mini" type="success">完成</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataList: [{
          id: '1',
          username: '招标方',
          title: '集五福系统',
          message: '一键收集五福的系统',
          price: '888',
          status: '待审核',
          startTime: 'Fri Feb 01 2019 00:00:00 GMT+0800 (中国标准时间)',
          endTime: 'Wed Jan 30 2019 17:58:05 GMT+0800 (中国标准时间)',
          evaluate: '优秀',
        }],
        searchType: '',
        searchValue: '',
        searchTime: '',
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      };
    },

    methods: {},
    created() {

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
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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
