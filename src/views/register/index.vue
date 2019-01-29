<template>
  <div class="login-container">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm2.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm2.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="type">
        <el-select v-model="ruleForm2.type" placeholder="请选择用户类型">
          <el-option label="竞标方" value="contend"></el-option>
          <el-option label="招标方" value="recruit"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密保问题" prop="question">
        <el-input v-model="ruleForm2.question"></el-input>
      </el-form-item>
      <el-form-item label="密保答案" prop="answer">
        <el-input v-model="ruleForm2.answer"></el-input>
      </el-form-item>
      <el-button @click="resetForm('ruleForm2')">重置</el-button>
      <el-button type="primary" @click="submitForm('ruleForm2')" style="margin-right:20px;">提交</el-button>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("账号不能为空"));
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
      var checkQuestion = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("密保问题不能为空"));
        } else {
          callback();
        }
      };
      var checkAnswer = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("密保答案不能为空"));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm2.checkPass !== "") {
            this.$refs.ruleForm2.validateField("checkPass");
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm2.password) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        ruleForm2: {
          password: "",
          checkPass: "",
          username: "",
          type: "",
          question: '',
          answer: ''
        },
        rules2: {
          password: [{
            validator: validatePass,
            trigger: "blur"
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: "blur"
          }],
          username: [{
            validator: checkAge,
            trigger: "blur"
          }],
          type: [{
            validator: checkType,
            trigger: "blur"
          }],
          question: [{
            validator: checkQuestion,
            trigger: "blur"
          }],
          answer: [{
            validator: checkAnswer,
            trigger: "blur"
          }],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/userRegister", this.ruleForm2).then(res => {
              if (res.data.msg == "success") {
                this.$message({
                  showClose: true,
                  message: "注册成功",
                  type: "success"
                });
                this.$router.push("/login");
              }
            });
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  };

</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    .demo-ruleForm {
      width: 500px;
      margin: 200px auto;

      .el-form-item__label {
        color: #c5c5c5;
        padding: 0 25px 0 0;
      }

      .el-form-item__content {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }
    }

    .el-input {
      display: inline-block;
      height: 47px;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-button {
      float: right;
    }

    .el-select {
      width: 100%;
    }
  }

</style>
