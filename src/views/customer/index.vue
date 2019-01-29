<template>
  <div class="app-container">
    <el-row>
      <el-input
        v-model="search"
        size="mini"
        placeholder="输入关键字搜索"
        style="width:200px"
      />
      <el-button
        type="success"
        size="small"
        style="float:right"
        @click="dialogAddFormVisible = true"
      >添加客户</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="dataList.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          {{scope.row.sex == 1 ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="mail"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        prop="tel"
        label="电话"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip
      >
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
            @click="handleEdit(scope)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteCustomer(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogEditFormVisible">
      <el-form
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="客户姓名">
          <el-input v-model="editcustomerName" />
        </el-form-item>
        <el-form-item label="客户性别">
          <el-select
            v-model="editcustomerSex"
            placeholder="请选择性别"
          >
            <el-option
              label="男"
              value="1"
            ></el-option>
            <el-option
              label="女"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户邮箱">
          <el-input v-model="editcustomerMail" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="editcustomerTel" />
        </el-form-item>
        <el-form-item label="客户地址">
          <el-input v-model="editcustomerAddress" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button
          @click="editCustomer(scope)"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogAddFormVisible">
      <el-form
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="客户姓名">
          <el-input v-model="addcustomerName" />
        </el-form-item>
        <el-form-item label="客户性别">
          <el-select
            v-model="addcustomerSex"
            placeholder="请选择性别"
          >
            <el-option
              label="男"
              value="1"
            ></el-option>
            <el-option
              label="女"
              value="2"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户邮箱">
          <el-input v-model="addcustomerMail" />
        </el-form-item>
        <el-form-item label="客户电话">
          <el-input v-model="addcustomerTel" />
        </el-form-item>
        <el-form-item label="客户地址">
          <el-input v-model="addcustomerAddress" />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogAddFormVisible = false">取消</el-button>
        <el-button
          @click="addCustomer"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataList: [],
      multipleSelection: [],
      dialogEditFormVisible: false,
      dialogAddFormVisible: false,
      editcustomerName: "",
      editcustomerMail: "",
      editcustomerTel: "",
      editcustomerAddress: "",
      editcustomerId: "",
      editcustomerSex: "",
      addcustomerName: "",
      addcustomerMail: "",
      addcustomerTel: "",
      addcustomerAddress: "",
      addcustomerSex: "",
      deleteConfirm: false,
      search: ""
    };
  },

  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getDataList() {
      this.$http.post("/client").then(res => {
        if (res.data.status === 0) {
          this.dataList = res.data.data;
        }
      });
    },
    handleEdit(scope) {
      this.title = "编辑";
      this.dialogEditFormVisible = true;
      this.editcustomerId = scope.row.id;
      this.editcustomerName = scope.row.name;
      this.editcustomerMail = scope.row.mail;
      this.editcustomerTel = scope.row.tel;
      this.editcustomerAddress = scope.row.address;
      this.editcustomerSex = scope.row.sex == "1" ? "男" : "女";
    },
    editCustomer() {
      const condition = {};
      condition.id = this.editcustomerId;
      condition.name = this.editcustomerName;
      condition.mail = this.editcustomerMail;
      condition.tel = this.editcustomerTel;
      condition.address = this.editcustomerAddress;
      condition.sex = this.editcustomerSex == "男" ? 1 : 2;
      this.$http.post("/editClient", condition).then(res => {
        if (res.data.status === 0) {
          this.dialogEditFormVisible = false;
          this.getDataList();
        }
      });
    },
    addCustomer() {
      const condition = {};
      condition.name = this.addcustomerName;
      condition.mail = this.addcustomerMail;
      condition.tel = this.addcustomerTel;
      condition.address = this.addcustomerAddress;
      condition.sex = this.addcustomerSex;
      this.$http.post("/addClient", condition).then(res => {
        if (res.data.status === 0) {
          this.dialogAddFormVisible = false;
          this.getDataList();
        }
      });
    },
    deleteCustomer(scope) {
      const id = scope.row.id;
      this.$http.post("/deleteClient", { id }).then(res => {
        if (res.data.status === 0) {
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
