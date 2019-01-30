<template>
  <div class="components-container">
    <pan-thumb :image="image" />
    <span class="greeting">你好，admin</span>
    <el-button type="primary" icon="upload" style="margin-left: 40px;" @click="imagecropperShow=true">修改头像
    </el-button>
    <el-button type="primary" style="margin-left: 20px;" @click="dialogEditFormVisible = true">修改密码
    </el-button>
    <image-cropper v-show="imagecropperShow" :width="300" :height="300" :key="imagecropperKey" url="https://httpbin.org/post"
      lang-type="en" @close="close" @crop-upload-success="cropSuccess" />
    <el-form label-position="right" label-width="100px" :model="formLabelAlign" class="message-form" :rules="rules2"
      ref="ruleForm2">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="formLabelAlign.name" v-if="isEdit"></el-input>
        <span v-else>{{formLabelAlign.name}}</span>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formLabelAlign.mail" v-if="isEdit"></el-input>
        <span v-else>{{formLabelAlign.mail}}</span>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="formLabelAlign.tel" v-if="isEdit"></el-input>
        <span v-else>{{formLabelAlign.tel}}</span>
      </el-form-item>
      <el-form-item label="专业技能">
        <el-input v-model="formLabelAlign.skill" v-if="isEdit"></el-input>
        <span v-else>{{formLabelAlign.skill}}</span>
      </el-form-item>
      <el-form-item label="作品链接">
        <el-input type="textarea" v-model="formLabelAlign.projectAddress" v-if="isEdit"></el-input>
        <span v-else>{{formLabelAlign.projectAddress}}</span>
      </el-form-item>
      <el-form-item label="平台验证状态">
        <el-tag type="success">已通过</el-tag>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button @click="isEdit = !isEdit">{{isEdit ? '查看资料' :'修改资料'}}</el-button>
        <el-button type="primary" @click="submitForm('ruleForm2')" v-if="isEdit">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogEditFormVisible" style="width:50%;left:30%">
      <el-form label-position="left" label-width="70px">
        <el-form-item label="旧密码">
          <el-input v-model="oldPsw" :type="oldPswType" />
          <span class="show-pwd" @click="showPwd('oldPswType')">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="newPsw" :type="newPswType" />
          <span class="show-pwd" @click="showPwd('newPswType')">
            <svg-icon icon-class="eye" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'AvatarUploadDemo',
    components: {
      ImageCropper,
      PanThumb
    },
    data() {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
      };
      return {
        imagecropperShow: false,
        imagecropperKey: 0,
        image: '../../../service/upload/u=2798619853,3698865108&fm=27&gp=0.jpg',
        formLabelAlign: {
          name: '',
          mail: '',
          tel: '',
          skill: '',
          projectAddress: ''
        },
        rules2: {
          name: [{
            validator: checkName,
            trigger: 'blur'
          }],
        },
        isEdit: false,
        dialogEditFormVisible: false,
        oldPswType: "password",
        newPswType: "password",
        oldPsw: '',
        newPsw: ''
      }
    },
    methods: {
      cropSuccess(resData) {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
        this.image = resData.files.avatar
      },
      close() {
        this.imagecropperShow = false
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
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
    }
  }

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
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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

  .el-dialog{
    width: 500px !important;
  }

</style>
