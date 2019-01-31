<template>
  <div class="login-container">
    <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
      <el-form-item label="账号" prop="username">
        <el-input v-model="ruleForm2.username"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="ruleForm2.password"></el-input>
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
      var checkPsw = (rule, value, callback) => {
        if (!value) {
          return callback(new Error("密码不能为空"));
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
      return {
        ruleForm2: {
          username: "",
          question: "",
          answer: "",
          password: ''
        },
        rules2: {
          username: [{
            validator: checkAge,
            trigger: "blur"
          }],
          password: [{
            validator: checkPsw,
            trigger: "blur"
          }],
          question: [{
            validator: checkQuestion,
            trigger: "blur"
          }],
          answer: [{
            validator: checkAnswer,
            trigger: "blur"
          }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$http.post("/forgetPassword", this.ruleForm2).then(res => {
              if (res.data.msg == "success") {
                this.$message({
                  showClose: true,
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push("/login");
              } else {
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
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
        color: #a9a9a9;
        padding: 0 25px 0 0;
      }

      .el-input {
        display: inline-block;
        height: 47px;
        width: 100%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
      }
    }

    .el-button {
      float: right;
    }

    .el-select {
      display: inline-block;
      height: 47px;
      width: 100%;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;

      .el-input {
        width: 100%;
      }
    }
  }

</style>
