<template>
  <div class="tab-container">
    <el-table
      :data="issueList"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >

      <el-table-column
        v-loading="loading2"
        type="index"
        align="center"
        label="序号"
        width="65"
        element-loading-text="请给我点时间！"
      >
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="用户名"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="用户类型"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300px"
        label="最新消息"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input
              v-model="scope.row.title"
              class="edit-input"
              size="small"
            />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(scope.row)"
              style="margin-left:10px"
            >取消</el-button>
          </template>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="180px"
        align="center"
        label="通知时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.timestamp">{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="操作"
        width="110"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="small"
            @click="confirmEdit(scope.row)"
          >确认发送</el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            @click="scope.row.edit=!scope.row.edit"
          >发送通知</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Tab",
  data() {
    return {
      loading2: false,
      issueList: []
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    })
  },
  methods: {
    cancelEdit(row) {
      row.title = row.originalTitle;
      row.edit = false;
      this.$message({
        message: "已恢复修改前数据",
        type: "warning"
      });
    },
    confirmEdit(row) {
      const condition = {
        notifierName: this.userInfo.username,
        notifierType: this.userInfo.type,
        recipientName: row.username,
        recipientType: row.type,
        messageDetail: row.title
      };
      this.$http.post("/addMessage", condition).then(res => {
        if (res.data.msg == "success") {
          row.edit = false;
          row.originalTitle = row.title;
          row.timestamp = new Date();
          this.$message({
            message: "消息发送成功",
            type: "success"
          });
        }
      });
    },
    delMessage(id) {
      this.$http
        .post("/deleteMessage", {
          id
        })
        .then(res => {
          if (res.data.msg == "success") {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserList();
          }
        });
    },
    getUserList() {
      this.loading2 = true;
      this.$http
        .post("/getUserList")
        .then(res => {
          if (res.data.msg == "success") {
            this.loading2 = false;
            this.issueList = res.data.pageData.filter(e => e.type !== "admin");
            if (this.issueList.length) {
              this.issueList.forEach(issue => {
                this.$set(issue, "edit", false);
                this.$http
                  .post("/getMessageList", {
                    username: issue.username
                  })
                  .then(res => {
                    if (res.data.msg == "success" && res.data.pageData.length) {
                      res.data.pageData.forEach(message => {
                        if (this.userInfo.username == message.notifierName) {
                          this.$set(issue, "title", message.messageDetail);
                          this.$set(
                            issue,
                            "originalTitle",
                            message.messageDetail
                          );
                          this.$set(issue, "timestamp", message.create_time);
                        }
                      });
                    }
                  });
              });
            }
          }
        })
        .catch(() => {
          this.loading2 = false;
        });
    }
  },
  created() {
    this.getUserList();
  }
};
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
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 80%;
  color: #212121;
}
</style>
