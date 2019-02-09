<template>
  <div class="app-container">
    <el-row>
      <el-select
        v-model="searchType"
        placeholder="请选择搜索类型"
      >
        <el-option
          label="名称"
          value="name"
        ></el-option>
        <el-option
          label="专业区域"
          value="major"
        ></el-option>
      </el-select>
      <el-input
        v-model="searchValue"
        size="mini"
        placeholder="输入关键字搜索"
        style="width:200px"
      />
      <el-date-picker
        v-model="searchTime"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-button
        type="primary"
        style="margin-left:10px;"
        @click="search"
      >搜索</el-button>
      <el-button
        type="primary"
        style="float:right"
        @click="dialogAddFormVisible = true;addForm = {development_name:[]}"
      >发布项目</el-button>
    </el-row>
    <el-table
      :data="searchData"
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
            @click="dialogFormVisible = true;currentForm = scope.row"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="editDialog(scope.row)"
          >修改信息
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="dialogAddFormVisible">
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
        ref="addForm"
        :rules="addRules"
        :model="addForm"
      >
        <el-form-item
          label="项目名"
          prop="name"
        >
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item
          label="专业区域"
          prop="major"
        >
          <el-input v-model="addForm.major" />
        </el-form-item>
        <el-form-item
          label="项目详情"
          prop="message"
        >
          <el-input v-model="addForm.message" />
        </el-form-item>
        <el-form-item
          label="费用"
          prop="price"
        >
          <el-input v-model="addForm.price" />
        </el-form-item>
        <el-form-item
          label="开发类型"
          prop="development_type"
        >
          <el-select
            v-model="addForm.development_type"
            placeholder="请选择类型"
          >
            <el-option
              label="Web网站"
              value="1"
            ></el-option>
            <el-option
              label="App开发"
              value="2"
            ></el-option>
            <el-option
              label="微信公众号"
              value="3"
            ></el-option>
            <el-option
              label="小程序"
              value="4"
            ></el-option>
            <el-option
              label="HTML5应用"
              value="5"
            ></el-option>
            <el-option
              label="其他"
              value="6"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="招募类型"
          prop="recruitment_type"
        >
          <el-select
            v-model="addForm.recruitment_type"
            placeholder="请选择类型"
          >
            <el-option
              label="团队开发者"
              value="1"
            ></el-option>
            <el-option
              label="个人开发者"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开发者类型"
          prop="development_name"
        >
          <el-select
            v-model="addForm.development_name"
            multiple
            placeholder="请选择类型"
            style="width:400px"
          >
            <el-option
              label="项目经理"
              value="项目经理"
            ></el-option>
            <el-option
              label="产品经理"
              value="产品经理"
            ></el-option>
            <el-option
              label="前端开发"
              value="前端开发"
            ></el-option>
            <el-option
              label="后端开发"
              value="后端开发"
            ></el-option>
            <el-option
              label="测试工程师"
              value="测试工程师"
            ></el-option>
            <el-option
              label="其他"
              value="其他"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="起讫时间"
          prop="time"
        >
          <el-date-picker
            v-model="addForm.time"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目附件">
          <span
            style="cursor: pointer;margin-right:15px;"
            @click="openWindow(addForm.enclosure)"
            v-if="addForm.enclosure"
          >{{addForm.enclosure}}</span>
          <el-button
            type="primary"
            size="small"
            @click="uploadAddFile('addFile')"
          >上传附件</el-button>
          <input
            type="file"
            v-show="false"
            ref="addFile"
            @change="uploadAddFileChange('addFile',addForm)"
          >
        </el-form-item>
        <el-form-item label="联系QQ">
          <el-input v-model="addForm.qq" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="addForm.tel" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddFormVisible = false">取消</el-button>
        <el-button
          @click="addProject"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogEditFormVisible">
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
        ref="editForm"
        :rules="editRules"
        :model="editForm"
      >
        <el-form-item
          label="项目名"
          prop="name"
        >
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item
          label="专业区域"
          prop="major"
        >
          <el-input v-model="editForm.major" />
        </el-form-item>
        <el-form-item
          label="项目详情"
          prop="message"
        >
          <el-input v-model="editForm.message" />
        </el-form-item>
        <el-form-item
          label="费用"
          prop="price"
        >
          <el-input v-model="editForm.price" />
        </el-form-item>
        <el-form-item
          label="开发类型"
          prop="development_type"
        >
          <el-select
            v-model="editForm.development_type"
            placeholder="请选择类型"
          >
            <el-option
              label="Web网站"
              value="1"
            ></el-option>
            <el-option
              label="App开发"
              value="2"
            ></el-option>
            <el-option
              label="微信公众号"
              value="3"
            ></el-option>
            <el-option
              label="小程序"
              value="4"
            ></el-option>
            <el-option
              label="HTML5应用"
              value="5"
            ></el-option>
            <el-option
              label="其他"
              value="6"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="招募类型"
          prop="recruitment_type"
        >
          <el-select
            v-model="editForm.recruitment_type"
            placeholder="请选择类型"
          >
            <el-option
              label="团队开发者"
              value="1"
            ></el-option>
            <el-option
              label="个人开发者"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开发者类型"
          prop="development_name"
        >
          <el-select
            v-model="editForm.development_name"
            multiple
            placeholder="请选择类型"
            style="width:400px"
          >
            <el-option
              label="项目经理"
              value="项目经理"
            ></el-option>
            <el-option
              label="产品经理"
              value="产品经理"
            ></el-option>
            <el-option
              label="前端开发"
              value="前端开发"
            ></el-option>
            <el-option
              label="后端开发"
              value="后端开发"
            ></el-option>
            <el-option
              label="测试工程师"
              value="测试工程师"
            ></el-option>
            <el-option
              label="其他"
              value="其他"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="起讫时间"
          prop="time"
        >
          <el-date-picker
            v-model="editForm.time"
            type="datetimerange"
            :picker-options="pickerOptions2"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目附件">
          <span
            style="cursor: pointer;margin-right:15px;"
            @click="openWindow(editForm.enclosure)"
            v-if="editForm.enclosure"
          >{{editForm.enclosure}}</span>
          <el-button
            type="primary"
            size="small"
            @click="uploadAddFile('editFile')"
          >上传附件</el-button>
          <input
            type="file"
            v-show="false"
            ref="editFile"
            @change="uploadAddFileChange('editFile',editForm)"
          >
        </el-form-item>
        <el-form-item label="联系QQ">
          <el-input v-model="editForm.qq" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editForm.tel" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button
          @click="updateProject"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item
          label="项目名"
          prop="name"
        >
          <span>{{currentForm.name}}</span>
        </el-form-item>
        <el-form-item
          label="专业区域"
          prop="major"
        >
          <span>{{currentForm.major}}</span>
        </el-form-item>
        <el-form-item
          label="项目详情"
          prop="message"
        >
          <span>{{currentForm.message}}</span>
        </el-form-item>
        <el-form-item
          label="费用"
          prop="price"
        >
          <span>{{currentForm.price}}</span>
        </el-form-item>
        <el-form-item
          label="开发类型"
          prop="development_type"
        >
          <span>{{currentForm.development_type}}</span>
        </el-form-item>
        <el-form-item
          label="招募类型"
          prop="recruitment_type"
        >
          <span>{{currentForm.recruitment_type}}</span>
        </el-form-item>
        <el-form-item
          label="开发者类型"
          prop="development_name"
        >
          <span>{{currentForm.development_name}}</span>
        </el-form-item>
        <el-form-item
          label="起讫时间"
          prop="time"
        >
          <span>{{new Date(currentForm.create_time).toLocaleString() + ' - ' + new Date(currentForm.update_time).toLocaleString()}}</span>
        </el-form-item>
        <el-form-item label="上传附件">
          <span
            style="cursor: pointer;margin-right:15px;"
            @click="openWindow(currentForm.enclosure)"
            v-if="currentForm.enclosure"
          >{{currentForm.enclosure}}</span>
        </el-form-item>
        <el-form-item label="联系QQ">
          <span>{{currentForm.qq}}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <span>{{currentForm.tel}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("项目名不能为空"));
      } else {
        callback();
      }
    };
    var checkMajor = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("专业区域不能为空"));
      } else {
        callback();
      }
    };
    var checkMessage = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("项目详情不能为空"));
      } else {
        callback();
      }
    };
    var checkDevelopmenType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("开发类型不能为空"));
      } else {
        callback();
      }
    };
    var checkRecruitmentType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("招募类型不能为空"));
      } else {
        callback();
      }
    };
    var checkDevelopmentName = (rule, value, callback) => {
      if (!value.length) {
        return callback(new Error("开发者类型不能为空"));
      } else {
        callback();
      }
    };
    var checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("价格不能为空"));
      } else {
        callback();
      }
    };
    var checkTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("起讫时间不能为空"));
      } else {
        callback();
      }
    };
    return {
      dataList: [],
      searchData: [],
      searchType: "",
      searchValue: "",
      searchTime: "",
      pickerOptions2: {
        shortcuts: [
          {
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
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      dialogFormVisible: false,
      addForm: {},
      addRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: checkName
          }
        ],
        major: [
          {
            required: true,
            trigger: "blur",
            validator: checkMajor
          }
        ],
        message: [
          {
            required: true,
            trigger: "blur",
            validator: checkMessage
          }
        ],
        price: [
          {
            required: true,
            trigger: "blur",
            validator: checkPrice
          }
        ],
        development_type: [
          {
            required: true,
            trigger: "blur",
            validator: checkDevelopmenType
          }
        ],
        recruitment_type: [
          {
            required: true,
            trigger: "blur",
            validator: checkRecruitmentType
          }
        ],
        development_name: [
          {
            required: true,
            trigger: "blur",
            validator: checkDevelopmentName
          }
        ],
        time: [
          {
            required: true,
            trigger: "blur",
            validator: checkTime
          }
        ]
      },
      editRules: {
        name: [
          {
            required: true,
            trigger: "blur",
            validator: checkName
          }
        ],
        major: [
          {
            required: true,
            trigger: "blur",
            validator: checkMajor
          }
        ],
        message: [
          {
            required: true,
            trigger: "blur",
            validator: checkMessage
          }
        ],
        price: [
          {
            required: true,
            trigger: "blur",
            validator: checkPrice
          }
        ],
        development_type: [
          {
            required: true,
            trigger: "blur",
            validator: checkDevelopmenType
          }
        ],
        recruitment_type: [
          {
            required: true,
            trigger: "blur",
            validator: checkRecruitmentType
          }
        ],
        development_name: [
          {
            required: true,
            trigger: "blur",
            validator: checkDevelopmentName
          }
        ],
        time: [
          {
            required: true,
            trigger: "blur",
            validator: checkTime
          }
        ]
      },
      currentForm: {},
      editForm: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    }),
    "addForm.username"() {
      return this.userInfo.username;
    }
  },
  methods: {
    getProjectList() {
      const condition = {
        starUser: this.userInfo.username
      };
      this.$http.post("/getProjectList").then(res => {
        this.dataList = res.data.pageData;
        this.searchData = res.data.pageData;
      });
    },
    search() {
      this.searchData = this.dataList.filter(data =>
        data[this.searchType]
          ? data[this.searchType].indexOf(this.searchValue) !== -1
          : true
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
    addProject() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          const condition = JSON.parse(JSON.stringify(this.addForm));
          condition.development_name = condition.development_name.join(",");
          condition.username = this.userInfo.username;
          condition.create_time = condition.time[0];
          condition.update_time = condition.time[1];
          condition.qq = condition.qq ? condition.qq : " ";
          condition.tel = condition.tel ? condition.tel : " ";
          condition.enclosure = condition.enclosure ? condition.enclosure : " ";
          this.$http.post("/addProject", condition).then(res => {
            if (res.data.msg == "success") {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success"
              });
              this.dialogAddFormVisible = false;
              this.$refs.addForm.resetFields();
              this.getProjectList();
            }
          });
        }
      });
    },
    editDialog(item) {
      this.dialogEditFormVisible = true;
      const condition = JSON.parse(JSON.stringify(item));
      condition.time = [condition.create_time, condition.update_time];
      condition.recruitment_type = condition.recruitment_type
        ? String(condition.recruitment_type)
        : "";
      condition.development_type = condition.development_type
        ? String(condition.development_type)
        : "";
      condition.development_name = condition.development_name
        ? condition.development_name.split(",")
        : [];
      condition.qq = condition.qq ? condition.qq : "";
      condition.tel = condition.tel ? condition.tel : "";
      condition.enclosure = condition.enclosure ? condition.enclosure : " ";
      this.editForm = condition;
    },
    updateProject() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$http.post("/updateProject", this.editForm).then(res => {
            if (res.data.msg == "success") {
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
            }
          });
        }
      });
    },
    uploadAddFile(ref) {
      this.$refs[ref].click();
    },
    uploadAddFileChange(ref, form) {
      let fd = new FormData();
      fd.append("fileToUpload", this.$refs[ref].files[0]);
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$http
        .post("/upload", fd, config)
        .then(response => {
          if (response.data.status == 0) {
            this.$set(form, "enclosure", response.data.data);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    openWindow(url) {
      window.open(`../../../../service/upload/${url}`);
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
