<template>
  <div class="app-container">
    <el-table :data="dataList.filter(e => e.type != 'admin')" style="width: 100%">
      <el-table-column align="center" label="序号" width="65" type="index"></el-table-column>

      <el-table-column width="150px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="用户类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 'contend' ? '竞标方' : '招标方' }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="技能特长">
        <template slot-scope="scope">
          <span>{{ scope.row.skill }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="150px" label="作品介绍">
        <template slot-scope="scope">
          <a :href="scope.row.projectAddress" target="blank">{{scope.row.projectAddress}}</a>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="center" label="认证状态">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status == 1">待验证</el-tag>
          <el-tag type="success" v-if="scope.row.status == 2">已通过</el-tag>
          <el-tag type="danger" v-if="scope.row.status == 3">验证未通过</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.mail }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="电话">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>

      <el-table-column width="330px" align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="dialogEditFormVisible = true,editForm = JSON.parse(JSON.stringify(scope.row))"
          >修改用户信息</el-button>
          <el-button size="mini" type="success" @click="approve(scope.row.id,2)" v-if="scope.row.status == 1">认证通过</el-button>
          <el-button size="mini" type="danger" @click="approve(scope.row.id,3)" v-if="scope.row.status == 1">认证拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogEditFormVisible">
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
        ref="editForm"
        :rules="editRules"
        :model="editForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"/>
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
          <el-select v-model="editForm.type" placeholder="请选择用户类型">
            <el-option label="竞标方" value="contend"></el-option>
            <el-option label="招标方" value="recruit"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能特长" prop="skill">
          <el-input v-model="editForm.skill"/>
        </el-form-item>
        <el-form-item label="作品介绍" prop="projectAddress">
          <el-input v-model="editForm.projectAddress"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="editForm.mail"/>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="editForm.tel"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button @click="updateUser" type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var checkType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户类型不能为空"));
      } else {
        callback();
      }
    };
    return {
      dataList: [],
      dialogEditFormVisible: false,
      editForm: "",
      editRules: {
        username: [
          {
            validator: checkAge,
            trigger: "blur"
          }
        ],
        type: [
          {
            validator: checkType,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    })
  },
  methods: {
    getProjectList() {
      this.$http.post("/getUserList").then(res => {
        this.dataList = res.data.pageData;
      });
    },
    openWindow(url) {
      window.open(url);
    },
    updateUser() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$http.post("/updateUser", this.editForm).then(res => {
            if (res.data.msg == "success") {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.dialogEditFormVisible = false;
              this.$refs.editForm.resetFields();
              this.getProjectList();
            }
          });
        }
      });
    },
    approve(id,status) {
      this.$http.post("/updateUserStatus", {id,status}).then(res => {
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
