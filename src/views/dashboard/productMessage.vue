<template>
  <div class="body">
    <div class="dashboard-container">
      <el-menu class="el-menu-demo" mode="horizontal" style="position: fixed;top: 0;width: 100%;z-index: 9999999;">
        <el-menu-item index="1"><span id="logo">码市</span></el-menu-item>
        <el-menu-item index="2">项目</el-menu-item>
        <el-menu-item index="3">估价</el-menu-item>
        <el-menu-item index="4">会员</el-menu-item>
        <el-menu-item index="5">开发者</el-menu-item>
        <el-menu-item index="6">帮助</el-menu-item>
        <el-menu-item index="8" style="float:right" @click="register">注册</el-menu-item>
        <el-menu-item index="7" style="float:right" @click="login">登录</el-menu-item>
      </el-menu>
      <div class="box-card">
        <div class="box-header">
          <div class="title">
            <span class="name">{{productMessage.name}}</span>
            <span class="status">{{productMessage.active}}</span>
          </div>
          <div class="number">
            <span class="reward-no">{{'No.' + productMessage.id}}</span>
            <span class="reward-name">{{productMessage.development_name}}</span>
          </div>
          <div class="segmentation">
            <span class="gray">
              金额
            </span>
            <span>￥{{Number(productMessage.price).toLocaleString()}}</span>
            <span class="gray" style="transform: translateY(-2px);display: inline-block;margin:0 5px;">|</span>
            <span class="gray">
              类型
            </span>
            <span>{{productMessage.development_type ? productMessage.development_type : '无'}}</span>
            <span class="gray" style="transform: translateY(-2px);display: inline-block;margin:0 5px;">|</span>
            <span class="gray">
              周期
            </span>
            <span>{{productMessage.developDay}}天</span>
            <span class="gray" style="float:right">报名人数：{{productMessage.contendCount}}</span>
          </div>
        </div>
        <div class="box-content">
          <h2>项目描述</h2>
          <div style="line-height: 28px;font-size:14px;">
            {{productMessage.message}}
          </div>
          <h2>项目规划</h2>
          <h3>项目周期</h3>
          <div style="font-size:14px">{{productMessage.developDay}}天</div>
          <h2>招募角色</h2>
          <div style="font-size:14px">{{productMessage.development_name}}</div>
          <h2>专业领域</h2>
          <div style="font-size:14px">{{productMessage.major}}</div>
          <h2>需求文件</h2>
          <div class="file">
            <span v-if="!productMessage.enclosure || productMessage.enclosure == ' '">无</span>
            <template v-else>
              <svg-icon icon-class="documentation" style="color:#4289DB;margin-left:10px;cursor: pointer;" @click="download(productMessage.enclosure)" />
              <span style="color: #979FA8;font-size:14px;cursor: pointer;" @click="download(productMessage.enclosure)">{{productMessage.enclosure}}</span>
              <span style="float:right;color: #979FA8;font-size:14px;cursor: pointer;" @click="download(productMessage.enclosure)">下载</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        productMessage: ''
      }
    },
    methods: {
      register() {
        this.$router.push('/register')
      },
      login() {
        this.$router.push('/login')
      },
      getProductMessage() {
        this.$http.post('/getProjectList').then(res => {
          if (res.data.msg == 'success') {
            this.productMessage = res.data.pageData.filter(product => product.id == this.$route.query.id)[0]
            const day = Math.ceil((new Date(this.productMessage.update_time).getTime() - new Date(this.productMessage
                .create_time).getTime()) /
              (60 * 60 * 60 * 1000))
            this.$set(this.productMessage, 'developDay', day)
            this.$http.post('/getBidList', {
              projectId: this.productMessage.id
            }).then(result => {
              if (result.data.msg == 'success') {
                if (result.data.pageData.length) {
                  let flag = false
                  result.data.pageData.forEach(item => {
                    if (item.status == 5) {
                      flag = true
                    }
                  })
                  if (flag) {
                    this.$set(this.productMessage, 'active', '已结束')
                  } else {
                    this.$set(this.productMessage, 'active', '开发中')
                  }
                } else {
                  this.$set(this.productMessage, 'active', '招募中')
                }
                this.$set(this.productMessage, 'contendCount', result.data.pageData.length)
              }
            })
          }
        })
      },
      download(file) {
        window.open(`../../../service/upload/${file}`);
      }
    },
    created() {
      this.getProductMessage()
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-container {
    background-color: #f0f2f5;
    padding: 55px 0;
    width: 100%;

    #logo {
      color: #49a9ee;
      font-size: 26px;
    }

    .box-card {
      width: 50%;
      margin: 20px auto;
      border-radius: 5px;

      .box-header {
        padding: 30px 25px;
        background-color: #F7FAFC;
        border-top: 1px solid #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid #ededed;

        .name {
          font-size: 28px;
          color: #2D3238;
        }

        .status {
          color: #65C279;
          float: right;
          font-size: 16px;
        }

        .number {
          margin: 20px 0;

          .reward-no {
            border-radius: 3px;
            background-color: #8796A8;
            color: #fff;
            font-size: 10px;
            padding: 3px 4px;
            margin-right: 6px;
          }

          .reward-name {
            font-size: 14px;
            transform: translateY(1px);
            display: inline-block;
          }
        }

        .segmentation {
          margin-top: 50px;
          font-size: 14px;
        }
      }

      .box-content {
        padding: 20px 25px 30px 25px;
        background-color: #fff;

        h2 {
          font-weight: 400;
          margin-top: 50px;
        }

        h3 {
          font-weight: 400;
          margin-top: 50px;
        }

        .file {
          background: #edf5fc;
          border: 1px solid rgba(221, 221, 221, .3);
          border-radius: 5px;
          margin-bottom: 6px;
          padding: 10px 20px;
        }
      }

      .gray {
        color: #727f8f;
      }
    }
  }

  .body {
    background-color: #f0f2f5;
    width: 100%;
    height: 100%;
  }

</style>
