<template>
  <div style="margin-top:10%;">
    <el-row :gutter="60">
      <el-col :span="9" :offset="3">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开发者类型</span>
          </div>
          <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag,'developer')"
            class="item">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
            @keyup.enter.native="handleInputConfirm('developer')" @blur="handleInputConfirm('developer')">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </el-card>
      </el-col>
      <el-col :span="9">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目类型</span>
          </div>
          <el-tag :key="tag" v-for="tag in dynamicTags1" closable :disable-transitions="false" @close="handleClose1(tag,'project')"
            class="item">
            {{tag}}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible1" v-model="inputValue1" ref="saveTagInput1" size="small"
            @keyup.enter.native="handleInputConfirm1('project')" @blur="handleInputConfirm1('project')">
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput1">+ New Tag</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dynamicTags: '',
        inputVisible: false,
        inputValue: '',
        dynamicTags1: '',
        inputVisible1: false,
        inputValue1: ''
      };
    },
    methods: {
      handleClose(tag, type) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        this.$http.post('/updateLabel', {
          type,
          label: this.dynamicTags.join(',')
        }).then(res => {
          if (res.data.msg == 'success') {

          }
        })
      },
      handleClose1(tag, type) {
        this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1);
        this.$http.post('/updateLabel', {
          type,
          label: this.dynamicTags1.join(',')
        }).then(res => {
          if (res.data.msg == 'success') {

          }
        })
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      showInput1() {
        this.inputVisible1 = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput1.$refs.input.focus();
        });
      },

      handleInputConfirm(type) {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue)
          this.$http.post('/updateLabel', {
            type,
            label: this.dynamicTags.join(',')
          }).then(res => {
            if (res.data.msg == 'success') {
              this.inputVisible = false;
              this.inputValue = '';
            }
          })
        }
      },
      handleInputConfirm1(type) {
        let inputValue = this.inputValue1;
        if (inputValue) {
          this.dynamicTags1.push(inputValue)
          this.$http.post('/updateLabel', {
            type,
            label: this.dynamicTags1.join(',')
          }).then(res => {
            if (res.data.msg == 'success') {
              this.inputVisible1 = false;
              this.inputValue1 = '';
            }
          })
        }
      },
      getDynamicTags() {
        this.$http.post('/getLabelList').then(res => {
          if (res.data.msg == 'success') {
            this.dynamicTags = res.data.pageData.filter(e => e.type == "developer")[0].label.split(',')
            this.dynamicTags1 = res.data.pageData.filter(e => e.type == "project")[0].label.split(',')
          }
        })
      }
    },
    mounted() {
      this.getDynamicTags()
    }
  }

</script>

<style lang='scss' scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .item {
    margin-right: 20px;
    margin-bottom: 10px;
  }

  .input-new-tag {
    border: 1px solid #409EFF;
    width: 90px;
    vertical-align: top;
    border-radius: 3px;
    height: 30px;
  }

</style>
