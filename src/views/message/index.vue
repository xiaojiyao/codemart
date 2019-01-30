<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="接收消息" key="accept" name="accept">
        <el-table :data="acceptList" border fit highlight-current-row style="width: 100%">

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
      </el-tab-pane>
      <el-tab-pane label="发布消息" key="issue" name="issue">
        <el-table :data="issueList" border fit highlight-current-row style="width: 100%">

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

          <el-table-column min-width="300px" label="最新消息">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input v-model="scope.row.title" class="edit-input" size="small" />
                <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)" style="margin-left:10px">取消</el-button>
              </template>
              <span v-else>{{ scope.row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column width="180px" align="center" label="通知时间">
            <template slot-scope="scope">
              <span v-if="scope.row.timestamp">{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>

          <el-table-column class-name="status-col" label="操作" width="110">
            <template slot-scope="scope">
              <el-button v-if="scope.row.edit" type="success" size="small" @click="confirmEdit(scope.row)">确认发送</el-button>
              <el-button v-else type="primary" size="small" @click="scope.row.edit=!scope.row.edit">发送通知</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'Tab',
    data() {
      return {
        acceptList: [{
          id: 1,
          username: 'admin',
          type: '管理员',
          title: '账户身份验证已通过',
          timestamp: 'Wed Jan 30 2019 16:28:31 GMT+0800 (中国标准时间)',
          originalTitle:'账户身份验证已通过'
        }],
        issueList: [{
          id: 1,
          username: 'admin',
          type: '招标方',
          title: '账户身份验证已通过',
          timestamp: 'Wed Jan 30 2019 16:28:31 GMT+0800 (中国标准时间)',
          edit:false,
          originalTitle:'账户身份验证已通过'
        }],
        loading: false,
        activeName: 'accept',
      }
    },
    methods: {
      cancelEdit(row) {
        row.title = row.originalTitle
        row.edit = false
        this.$message({
          message: '已恢复修改前数据',
          type: 'warning'
        })
      },
      confirmEdit(row) {
        row.edit = false
        row.originalTitle = row.title
        this.$message({
          message: '消息发送成功',
          type: 'success'
        })
      }
    }
  }

</script>

<style scoped>
  .tab-container {
    margin: 30px;
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
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 80%;
    color: #212121;
  }

</style>
