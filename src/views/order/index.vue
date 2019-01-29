<template >
  <div class="app-container">
    <el-row>
      <el-button
        type="success"
        size="small"
        style="float:right"
        @click="dialogAddFormVisible = true"
      >添加订单</el-button>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="dataList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="订单名称"
      >
      </el-table-column>
      <el-table-column
        prop="price"
        label="金额"
      >
      </el-table-column>
      <el-table-column label="付款状态">
        <template slot-scope="scope">
          {{scope.row.typeStatus == 1 ? '已付款' : '未付款'}}
        </template>
      </el-table-column>
      <el-table-column label="订单状态">
        <template slot-scope="scope">
          {{scope.row.status == 1 ? '已发货' : '已完成'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="联系地址"
      >
      </el-table-column>
      <el-table-column
        prop="tel"
        label="联系电话"
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
        <el-form-item label="订单名称">
          <el-input v-model="editcustomerName" />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="editcustomerMail" />
        </el-form-item>
        <el-form-item label="付款状态">
          <el-select
            v-model="editcustomertypeStatus"
            placeholder="请选择状态"
          >
            <el-option
              label="未付款"
              value="0"
            ></el-option>
            <el-option
              label="已付款"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="editcustomerStatus"
            placeholder="请选择状态"
          >
            <el-option
              label="已完成"
              value="0"
            ></el-option>
            <el-option
              label="已发货"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="editcustomerAddress" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="editcustomerTel" />
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
        <el-form-item label="订单名称">
          <el-input v-model="addcustomerName" />
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="addcustomerMail" />
        </el-form-item>
        <el-form-item label="付款状态">
          <el-select
            v-model="addcustomertypeStatus"
            placeholder="请选择状态"
          >
            <el-option
              label="未付款"
              value="0"
            ></el-option>
            <el-option
              label="已付款"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="addcustomerStatus"
            placeholder="请选择状态"
          >
            <el-option
              label="已完成"
              value="0"
            ></el-option>
            <el-option
              label="已发货"
              value="1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="addcustomerAddress" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="addcustomerTel" />
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
      editoderNo: "",
      editcustomerStatus: "",
      editcustomertypeStatus: "",
      addcustomerName: "",
      addcustomerMail: "",
      addcustomerTel: "",
      addcustomerAddress: "",
      addcustomerId: "",
      addoderNo: "",
      addcustomerStatus: "",
      addcustomertypeStatus: ""
    };
  },
  methods: {
    getOrderList() {
      this.$http.post("/order").then(res => {
        if (res.data.msg == "success") {
          this.dataList = res.data.data;
          console.log(this.dataList);
        }
      });
    },
    handleEdit(scope) {
      this.title = "编辑";
      this.dialogEditFormVisible = true;
      this.editcustomerId = scope.row.id;
      this.editcustomerName = scope.row.name;
      this.editcustomerMail = scope.row.price;
      this.editcustomerTel = scope.row.tel;
      this.editcustomerAddress = scope.row.address;
      this.editoderNo = scope.row.orderNo;
      this.editcustomerStatus = scope.row.status == "1" ? "已出货" : "已完成";
      this.editcustomertypeStatus =
        scope.row.typeStatus == "1" ? "已付款" : "未付款";
    },
    editCustomer() {
      const condition = {};
      condition.id = this.editcustomerId;
      condition.name = this.editcustomerName;
      condition.price = this.editcustomerMail;
      condition.tel = this.editcustomerTel;
      condition.address = this.editcustomerAddress;
      condition.payType = this.editcustomertypeStatus == "已付款" ? 1 : 0;
      condition.status = this.editcustomerStatus == "已出货" ? 1 : 0;
      this.$http.post("/editOrder", condition).then(res => {
        console.log(res);
        if (res.data.status === 0) {
          this.dialogEditFormVisible = false;
          this.getOrderList();
        }
      });
    },
    addCustomer() {
      const condition = {};
      condition.name = this.addcustomerName;
      condition.price = this.addcustomerMail;
      condition.tel = this.addcustomerTel;
      condition.address = this.addcustomerAddress;
      condition.payType = this.addcustomertypeStatus == "已付款" ? 1 : 0;
      condition.status = this.addcustomerStatus == "已出货" ? 1 : 0;
      console.log(condition);
      this.$http.post("/addOrder", condition).then(res => {
        if (res.data.status === 0) {
          this.dialogAddFormVisible = false;
          this.getOrderList();
        }
      });
    },
    deleteCustomer(scope) {
      const id = scope.row.id;
      this.$http.post("/deleteOrder", { id }).then(res => {
        if (res.data.status === 0) {
          this.getOrderList();
        }
      });
    }
  },
  created() {
    this.getOrderList();
  }
};
</script>
<style scoped>
.el-table {
  border: 1px solid #ebeef5;
  margin-top: 20px;
}
</style>

