<template>
  <div class="app-container">
    <el-table :data="dataList.filter(data => data.isBid)" style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index">
      </el-table-column>

      <el-table-column width="110px" align="center" label="需求方">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
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
          <el-tag type="info" v-if="scope.row.bidStatus == 1">待审核</el-tag>
          <el-tag v-if="scope.row.bidStatus == 2">开发中</el-tag>
          <el-tag type="danger" v-if="scope.row.bidStatus == 3">已拒绝</el-tag>
          <el-tag type="danger" v-if="scope.row.bidStatus == 4">已取消</el-tag>
          <el-tag type="success" v-if="scope.row.bidStatus == 5">已完成</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="300px" align="center" label="起讫时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }} ~ {{ scope.row.update_time |
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
          <el-button size="mini" type="danger" @click="updateBid(scope.row.bidId)">取消竞标</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    data() {
      return {
        dataList: [],
      };
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.user
      }),
    },
    methods: {
      getProjectList() {
        const condition = {
          starUser: this.userInfo.username,
        }
        this.$http.post('/getProjectList').then(res => {
          if (res.data.msg == 'success') {
            this.dataList = res.data.pageData
            this.dataList.forEach(element => {
              const condition = {
                starUser: this.userInfo.username,
                projectId: element.id
              }
              const condition1 = {
                bidUser: this.userInfo.username,
                projectId: element.id
              }
              this.$http.post('/getStarList', condition).then(res => {
                if (res.data.msg == 'success') {
                  this.$set(element,'isStar',!!res.data.pageData.length)
                  this.$set(element,'starId',res.data.pageData[0].id)
                }
              })
              this.$http.post('/getBidList', condition1).then(res => {
                if (res.data.msg == 'success') {
                  this.$set(element,'isBid',!!res.data.pageData.length && (res.data.pageData[0].status == 1 || res.data
                    .pageData[0].status == 2))
                  this.$set(element,'bidId',res.data.pageData[0].id)
                  this.$set(element,'bidStatus',res.data.pageData[0].status)
                }
              })
            });
          }
        })
      },
      updateBid(id) {
        this.$http.post('/updateBid', {
          id,
          status:4
        }).then(res => {
          if (res.data.msg == 'success') {
            this.getProjectList()
            this.$message({
              message: '已取消竞标',
              type: 'success'
            })
          }
        })
      }
    },
    created() {
      this.getProjectList()
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
