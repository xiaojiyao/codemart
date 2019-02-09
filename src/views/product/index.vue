<template>
  <div class="components-container">
    <pan-thumb :image="image" />
    <span class="greeting">你好，{{userInfo.username}}</span>
    <el-button
      type="primary"
      icon="upload"
      style="margin-left: 40px;"
      @click="imagecropperShow=true"
    >修改头像
    </el-button>
    <el-button
      type="primary"
      style="margin-left: 20px;"
      @click="dialogEditFormVisible = true"
    >修改密码
    </el-button>
    <image-cropper
      v-show="imagecropperShow"
      :width="300"
      :height="300"
      :key="imagecropperKey"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      class="message-form"
      :rules="rules2"
      ref="ruleForm2"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="formLabelAlign.username"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.username}}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="formLabelAlign.mail"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.mail}}</span>
      </el-form-item>
      <el-form-item label="电话">
        <el-input
          v-model="formLabelAlign.tel"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.tel}}</span>
      </el-form-item>
      <el-form-item label="专业技能">
        <el-input
          v-model="formLabelAlign.skill"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.skill}}</span>
      </el-form-item>
      <el-form-item label="作品链接">
        <el-input
          type="textarea"
          v-model="formLabelAlign.projectAddress"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.projectAddress}}</span>
      </el-form-item>
      <el-form-item label="平台验证状态">
        <el-tag
          type="danger"
          v-if="formLabelAlign.status == 0"
        >验证失败</el-tag>
        <el-tag
          type="success"
          v-if="formLabelAlign.status == 1"
        >验证成功</el-tag>
        <el-tag
          type="info"
          v-if="formLabelAlign.status == 2"
        >验证中</el-tag>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click="editOrSee">{{isEdit ? '查看资料' :'修改资料'}}</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm2')"
          v-if="isEdit"
        >提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogEditFormVisible"
      style="width:50%;left:30%"
    >
      <el-form
        label-position="left"
        label-width="70px"
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm2"
      >
        <el-form-item
          label="旧密码"
          prop="password"
        >
          <el-input
            v-model="ruleForm2.password"
            :type="oldPswType"
          />
          <span
            class="show-pwd"
            @click="showPwd('oldPswType')"
          >
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="checkPass"
        >
          <el-input
            v-model="ruleForm2.checkPass"
            :type="newPswType"
          />
          <span
            class="show-pwd"
            @click="showPwd('newPswType')"
          >
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button
          @click="changePsw"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
import { mapState } from "vuex";

export default {
  name: "AvatarUploadDemo",
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var checkOldPsw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var checkNewPsw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      rules2: {
        username: [
          {
            validator: checkName,
            trigger: "blur"
          }
        ]
      },
      rules: {
        password: [
          {
            validator: checkOldPsw,
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            validator: checkNewPsw,
            trigger: "blur"
          }
        ]
      },
      isEdit: false,
      dialogEditFormVisible: false,
      oldPswType: "password",
      newPswType: "password",
      ruleForm2: {
        password: "",
        checkPass: ""
      },
      formLabelAlign: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    }),
    image() {
      return `../../../service/upload/${this.userInfo.image}`;
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      const obj = JSON.parse(JSON.stringify(this.userInfo));
      obj.image = resData.data;
      this.$http.post("/updateUserImage", obj).then(res => {
        if (res.data.msg == "success") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
        }
      });
      this.$store.dispatch("login", obj);
    },
    close() {
      this.imagecropperShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("/updateUser", this.formLabelAlign).then(res => {
            if (res.data.msg == "success") {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.$store.dispatch("login", this.formLabelAlign);
              this.isEdit = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showPwd(pwdType) {
      if (this[pwdType] === "password") {
        this[pwdType] = "";
      } else {
        this[pwdType] = "password";
      }
    },
    changePsw() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.ruleForm2.password == this.userInfo.password) {
            const condition = {
              username: this.userInfo.username,
              password: this.ruleForm2.checkPass
            };
            this.$http.post("/updatePsw", condition).then(res => {
              if (res.data.msg == "success") {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.$store.dispatch("logout");
                this.$router.push("/login");
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "密码错误",
              type: "error"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editOrSee() {
      this.isEdit = !this.isEdit;
      if (!this.isEdit) {
        const obj = JSON.parse(JSON.stringify(this.userInfo));
        this.formLabelAlign = obj;
      }
    }
  },
  created() {
    const obj = JSON.parse(JSON.stringify(this.userInfo));
    this.formLabelAlign = obj;
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.greeting {
  position: absolute;
  top: 36px;
  left: 225px;
  font-size: 48px;
  line-height: 48px;
  color: #212121;
}

.message-form {
  width: 600px;
  height: 100%;
  margin: 100px 30%;
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
  width: 100%;
  color: #212121;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 3px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

.el-dialog {
  width: 500px !important;
}
</style>
<template>
  <div class="components-container">
    <pan-thumb :image="image" />
    <span class="greeting">你好，{{userInfo.username}}</span>
    <el-button
      type="primary"
      icon="upload"
      style="margin-left: 40px;"
      @click="imagecropperShow=true"
    >修改头像
    </el-button>
    <el-button
      type="primary"
      style="margin-left: 20px;"
      @click="dialogEditFormVisible = true"
    >修改密码
    </el-button>
    <image-cropper
      v-show="imagecropperShow"
      :width="300"
      :height="300"
      :key="imagecropperKey"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />
    <el-form
      label-position="right"
      label-width="100px"
      :model="formLabelAlign"
      class="message-form"
      :rules="rules2"
      ref="ruleForm2"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="formLabelAlign.username"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.username}}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="formLabelAlign.mail"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.mail}}</span>
      </el-form-item>
      <el-form-item label="电话">
        <el-input
          v-model="formLabelAlign.tel"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.tel}}</span>
      </el-form-item>
      <el-form-item label="专业技能">
        <el-input
          v-model="formLabelAlign.skill"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.skill}}</span>
      </el-form-item>
      <el-form-item label="作品链接">
        <el-input
          type="textarea"
          v-model="formLabelAlign.projectAddress"
          v-if="isEdit"
        ></el-input>
        <span v-else>{{formLabelAlign.projectAddress}}</span>
      </el-form-item>
      <el-form-item label="平台验证状态">
        <el-tag
          type="danger"
          v-if="formLabelAlign.status == 0"
        >验证失败</el-tag>
        <el-tag
          type="success"
          v-if="formLabelAlign.status == 1"
        >验证成功</el-tag>
        <el-tag
          type="info"
          v-if="formLabelAlign.status == 2"
        >验证中</el-tag>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click="editOrSee">{{isEdit ? '查看资料' :'修改资料'}}</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm2')"
          v-if="isEdit"
        >提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible.sync="dialogEditFormVisible"
      style="width:50%;left:30%"
    >
      <el-form
        label-position="left"
        label-width="70px"
        ref="ruleForm"
        :rules="rules"
        :model="ruleForm2"
      >
        <el-form-item
          label="旧密码"
          prop="password"
        >
          <el-input
            v-model="ruleForm2.password"
            :type="oldPswType"
          />
          <span
            class="show-pwd"
            @click="showPwd('oldPswType')"
          >
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="checkPass"
        >
          <el-input
            v-model="ruleForm2.checkPass"
            :type="newPswType"
          />
          <span
            class="show-pwd"
            @click="showPwd('newPswType')"
          >
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button
          @click="changePsw"
          type="primary"
        >确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
import { mapState } from "vuex";

export default {
  name: "AvatarUploadDemo",
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var checkOldPsw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var checkNewPsw = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      rules2: {
        username: [
          {
            validator: checkName,
            trigger: "blur"
          }
        ]
      },
      rules: {
        password: [
          {
            validator: checkOldPsw,
            trigger: "blur"
          }
        ],
        checkPass: [
          {
            validator: checkNewPsw,
            trigger: "blur"
          }
        ]
      },
      isEdit: false,
      dialogEditFormVisible: false,
      oldPswType: "password",
      newPswType: "password",
      ruleForm2: {
        password: "",
        checkPass: ""
      },
      formLabelAlign: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    }),
    image() {
      return `../../../service/upload/${this.userInfo.image}`;
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      const obj = JSON.parse(JSON.stringify(this.userInfo));
      obj.image = resData.data;
      this.$http.post("/updateUserImage", obj).then(res => {
        if (res.data.msg == "success") {
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success"
          });
        }
      });
      this.$store.dispatch("login", obj);
    },
    close() {
      this.imagecropperShow = false;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http.post("/updateUser", this.formLabelAlign).then(res => {
            if (res.data.msg == "success") {
              this.$message({
                showClose: true,
                message: "修改成功",
                type: "success"
              });
              this.$store.dispatch("login", this.formLabelAlign);
              this.isEdit = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showPwd(pwdType) {
      if (this[pwdType] === "password") {
        this[pwdType] = "";
      } else {
        this[pwdType] = "password";
      }
    },
    changePsw() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.ruleForm2.password == this.userInfo.password) {
            const condition = {
              username: this.userInfo.username,
              password: this.ruleForm2.checkPass
            };
            this.$http.post("/updatePsw", condition).then(res => {
              if (res.data.msg == "success") {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.$store.dispatch("logout");
                this.$router.push("/login");
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "密码错误",
              type: "error"
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editOrSee() {
      this.isEdit = !this.isEdit;
      if (!this.isEdit) {
        const obj = JSON.parse(JSON.stringify(this.userInfo));
        this.formLabelAlign = obj;
      }
    }
  },
  created() {
    const obj = JSON.parse(JSON.stringify(this.userInfo));
    this.formLabelAlign = obj;
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}

.greeting {
  position: absolute;
  top: 36px;
  left: 225px;
  font-size: 48px;
  line-height: 48px;
  color: #212121;
}

.message-form {
  width: 600px;
  height: 100%;
  margin: 100px 30%;
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
  width: 100%;
  color: #212121;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 3px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

.el-dialog {
  width: 500px !important;
}
</style>
