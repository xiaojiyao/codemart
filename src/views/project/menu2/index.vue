<template>
  <div class="app-container">
    <el-table
      :data="dataList"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="序号"
        width="65"
        type="index"
      >
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="项目名称"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="竞标方"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.contend }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="专业区域"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.major }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="200px"
        label="项目详情"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="费用"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="发布状态"
      >
        <template slot-scope="scope">
          <el-tag
            type="info"
            v-if="scope.row.release_status == 1"
          >待审核</el-tag>
          <el-tag
            type="success"
            v-if="scope.row.release_status == 2"
          >已发布</el-tag>
          <el-tag
            type="danger"
            v-if="scope.row.release_status == 3"
          >审核未通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        width="300px"
        align="center"
        label="起讫时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }} ~ {{ scope.row.update_time |
            parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="250px"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="getContendList(scope.row)"
          >查看竞标列表</el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="竞标列表"
    >
      <el-table
        :data="contendListMessage"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="序号"
          width="65"
          type="index"
        >
        </el-table-column>

        <el-table-column
          width="150px"
          align="center"
          label="竞标方名称"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="150px"
          align="center"
          label="专业技能"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.skill }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="110px"
          align="center"
          label="项目地址"
        >
          <template slot-scope="scope">
            <span
              style="cursor: pointer;"
              @click="openWindow(scope.row.projectAddress)"
            >{{ scope.row.projectAddress }}</span>
          </template>
        </el-table-column>

        <el-table-column
          min-width="110px"
          label="邮箱"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.mail }}</span>
          </template>
        </el-table-column>

        <el-table-column
          width="110px"
          align="center"
          label="联系电话"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100px"
          align="center"
          label="竞标状态"
        >
          <template slot-scope="scope">
            <el-tag
              type="info"
              v-if="scope.row.bidStatus == 1"
            >待审核</el-tag>
            <el-tag v-if="scope.row.bidStatus == 2">开发中</el-tag>
            <el-tag
              type="danger"
              v-if="scope.row.bidStatus == 3"
            >已拒绝</el-tag>
            <el-tag
              type="danger"
              v-if="scope.row.bidStatus == 4"
            >已取消</el-tag>
            <el-tag
              type="success"
              v-if="scope.row.bidStatus == 5"
            >已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="150px"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="updateBid(scope.row)"
              v-if="scope.row.status == 1"
            >设为竞标方</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="dialogEvaluateVisible = true ;projectId = scope.row.projectId;evaluate = scope.row.evaluate"
              v-if="scope.row.status == 5"
            >填写评价</el-button>
            <el-button
              size="mini"
              @click="complete(scope.row.bidId)"
              type="success"
              v-if="scope.row.bidStatus == 2"
            >完成</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogEvaluateVisible"
      title="填写评价"
      width="30%"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item
          label="评价"
          prop="evaluate"
        >
          <el-input v-model="evaluate"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEvaluateVisible = false">取消</el-button>
        <el-button
          @click="updateProject"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      dialogFormVisible: false,
      contendListMessage: [],
      evaluate: "",
      projectId: "",
      dialogEvaluateVisible: false
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    })
  },
  methods: {
    getProjectList() {
      const condition = {
        starUser: this.userInfo.username
      };
      this.$http.post("/getProjectList").then(res => {
        this.dataList = res.data.pageData;
        res.data.pageData.forEach(element => {
          this.$http
            .post("/getBidList", { projectId: element.id })
            .then(res => {
              if (res.data.msg == "success") {
                res.data.pageData.forEach(e => {
                  if (e.status == 2 || e.status == 5) {
                    this.$set(element, "contend", e.bid_user);
                  }
                });
                this.$set(element, "contendList", res.data.pageData);
              }
            });
        });
      });
    },
    getContendList(item) {
      this.contendListMessage = [];
      item.contendList.forEach(e => {
        this.$http
          .post("/getUserListById", { userName: e.bid_user })
          .then(res => {
            if (res.data.msg == "success" && res.data.pageData.length) {
              res.data.pageData[0].status = e.status;
              res.data.pageData[0].bidId = e.id;
              res.data.pageData[0].bidStatus = e.status;
              res.data.pageData[0].projectId = e.project_id;
              res.data.pageData[0].evaluate = item.evaluate;
              this.contendListMessage.push(res.data.pageData[0]);
            }
          });
      });
      this.dialogFormVisible = true;
    },
    updateBid(item) {
      this.$http.post("/updateBid", { id: item.bidId, status: 2 }).then(res => {
        if ((res.data.msg = "success")) {
          this.$message({
            showClose: true,
            message: "操作成功",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.contendListMessage = [];
          this.getProjectList();
        }
      });
    },
    updateProject() {
      this.$http
        .post("/updateProjectEvaluate", {
          id: this.projectId,
          evaluate: this.evaluate
        })
        .then(res => {
          if (res.data.msg == "success") {
            this.$message({
              showClose: true,
              message: "添加评价成功",
              type: "success"
            });
            this.dialogEvaluateVisible = false;
          }
        });
    },
    complete(id) {
      const condition = {
        id,
        status: 5
      };
      this.$http.post("/updateBid", condition).then(res => {
        if (res.data.msg == "success") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
        }
        this.getProjectList();
      });
    },
    openWindow(url) {
      window.open(url);
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
