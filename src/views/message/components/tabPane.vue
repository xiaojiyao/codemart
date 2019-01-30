<template>
  <el-table :data="list" border fit highlight-current-row style="width: 100%">

    <el-table-column v-loading="loading" align="center" label="序号" width="65" element-loading-text="请给我点时间！">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="用户名">
      <template slot-scope="scope">
        <span>{{ scope.row.username }}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="用户类型">
      <template slot-scope="scope">
        <span>{{ scope.row.type }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="300px" label="通知详情">
      <template slot-scope="scope">
        <span>{{ scope.row.title }}</span>
      </template>
    </el-table-column>

    <el-table-column width="180px" align="center" label="通知时间">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column class-name="status-col" label="操作" width="110">
      <template slot-scope="scope">
        <el-button type="danger" size="small" @click="scope.row.edit=!scope.row.edit">不再提醒</el-button>
      </template>
    </el-table-column>

  </el-table>
</template>

<script>
  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    props: {
      type: {
        type: String,
        default: 'CN'
      }
    },
    data() {
      return {
        list: [{
          id:1,
          username:'admin',
          type:'管理员',
          title:'账户身份验证已通过',
          timestamp:'Wed Jan 30 2019 16:28:31 GMT+0800 (中国标准时间)',

        }],
        loading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.loading = true
        this.$emit('create') // for test
      }
    }
  }

</script>
