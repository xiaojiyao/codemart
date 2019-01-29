<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input
        placeholder="请输入搜索内容"
        v-model="searchValue"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >新增</el-button>
    </div> -->
    <!-- 列表 -->
    <el-row>
      <el-upload
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :on-change="uploadExcel"
        style="float:right;margin-bottom:10px;margin-left:10px;"
      >
        <el-button
          type="primary"
          size="small"
        >上传Excel</el-button>
      </el-upload>
      <el-button
        type="success"
        size="small"
        style="float:right;margin-bottom:10px;"
        @click="parseExcel"
      >导入商品</el-button>
      <el-button
        type="primary"
        size="small"
        style="float:right;margin-bottom:10px;margin-right:10px;"
        @click="handleCreate"
      >新增</el-button>
    </el-row>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        prop="name"
        align="center"
        label="产品名称"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="product_id"
        label="产品编号"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="price"
        label="产品价格"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="stocks"
        label="库存"
        width="110"
        align="center"
      ></el-table-column>
      <!-- <el-table-column
        prop="status"
        label="产品状态"
        width="110"
        align="center"
      ></el-table-column> -->
      <el-table-column
        prop="describes"
        label="产品描述"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
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
            @click="handleDelete(scope)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新增 -->
    <el-dialog
      :title="title"
      :visible.sync="dialogEditFormVisible"
    >
      <el-form
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="产品图片">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-change="handleChange"
            name="imageFile"
          >
            <img
              v-if="imageUrl"
              :src="'/service/upload/' + imageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            ></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="产品名称">
          <el-input v-model="editProductName" />
        </el-form-item>
        <el-form-item label="产品编号">
          <el-input v-model="editProductId" />
        </el-form-item>
        <el-form-item label="产品描述">
          <el-input
            type="textarea"
            v-model="editDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品价格">
          <el-input v-model="editProductPrice" />
        </el-form-item>
        <el-form-item label="产品库存">
          <el-input-number
            v-model="editProductStocks"
            :step="10"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //   filters: {
  //     statusFilter(status) {
  //       const statusMap = {
  //         published: "success",
  //         draft: "gray",
  //         deleted: "danger"
  //       };
  //       return statusMap[status];
  //     }
  //   },
  data() {
    return {
      list: null,
      listLoading: true,
      dialogEditFormVisible: false,
      editProductName: "",
      editProductId: "",
      editProductPrice: "",
      editProductStocks: "",
      imageUrl: "",
      searchValue: "",
      visable: "",
      title: "",
      currentItem: "",
      editDesc: ""
    };
  },
  created() {
    this.getProduct();
  },
  methods: {
    getProduct() {
      this.listLoading = true;
      this.$http.post("/productList").then(res => {
        this.listLoading = false;
        this.list = res.data.pageData;
      });
    },
    handleEdit(scope) {
      this.title = "编辑";
      this.visable = true;
      this.dialogEditFormVisible = true;
      this.editProductName = scope.row.name;
      this.editProductId = scope.row.product_id;
      this.editProductPrice = scope.row.price;
      this.editProductStocks = scope.row.stocks;
      this.editDesc = scope.row.describes;
      this.imageUrl = scope.row.img;
      this.currentItem = scope.row;
    },
    handleAvatarSuccess(res, file) {
      console.log(file);
    },
    handleChange: function(res, file) {
      let fd = new FormData();
      fd.append(
        "fileToUpload",
        document.getElementsByClassName("el-upload__input")[1].files[0]
      );
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$http
        .post("/upload", fd, config)
        .then(response => {
          console.log(response);
          if (response.data.status == 0) {
            this.imageUrl = response.data.data;
          }
        })
        .catch(error => {
          console.log(error);
        });
      this.imageUrl = document.getElementsByClassName(
        "el-upload__input"
      )[1].files[0].name;
    },
    handleDelete(scope) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http.post("/deleteProduct", { id: scope.row.id }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getProduct();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleFilter() {
      this.$http.post("/productFilter", { search: searchValue }).then(res => {
        let pageData = res.data.pageData;
        this.list = pageData;
      });
    },
    handleCreate() {
      this.dialogEditFormVisible = true;
      this.title = "新增";
      this.visable = false;
      this.editProductName = "";
      this.editProductId = "";
      this.editProductPrice = "";
      this.editProductStocks = "";
      this.editDesc = "";
      this.imageUrl = "";
    },
    parseExcel() {
      this.$http
        .get("/parseExcel")
        .then(res => {
          if (res.data == "success") {
            this.getProduct();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    uploadExcel(res, file) {
      let fd = new FormData();
      fd.append(
        "fileToUpload",
        document.getElementsByClassName("el-upload__input")[0].files[0]
      );
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      this.$http.post("/uploadExcel", fd, config).then(response => {
        console.log(response);
        if (response.data.status == 0) {
          // this.imageUrl = `localhost:4208/upload/${response.data.image}`;
        }
      });
    },
    confirm() {
      if (this.visable) {
        const condition = {
          id: this.currentItem.id,
          img: this.imageUrl,
          name: this.editProductName,
          desc: this.editDesc,
          price: this.editProductPrice,
          stocks: this.editProductStocks,
          product_id: this.editProductId
        };
        this.$http.post("/editProduct", condition).then(res => {
          this.dialogEditFormVisible = false;
          this.getProduct();
        });
      } else {
        const condition = {
          img: this.imageUrl,
          name: this.editProductName,
          desc: this.editDesc,
          price: this.editProductPrice,
          stocks: this.editProductStocks,
          product_id: this.editProductId
        };
        this.$http.post("/addProduct", condition).then(res => {
          this.dialogEditFormVisible = false;
          this.getProduct();
        });
      }
    }
  }
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

