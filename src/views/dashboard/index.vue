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
      <el-card class="box-card">
        <div class="search-box">
          <span class="search-title">项目类型：</span>
          <div>
            <span :class="'search-value ' + (activeItem == item ? 'active' : '')" v-for="item in dynamicTags1" :key="item"
              @click="activeItem = item">{{item}}</span>
          </div>
        </div>
        <div class="search-box">
          <span class="search-title">项目进度：</span>
          <div>
            <span :class="'search-value ' + (activeItem1 == item ? 'active' : '')" v-for="item in dynamicTags2" :key="item"
              @click="activeItem1 = item">{{item}}</span>
          </div>
        </div>
        <div class="search-box">
          <span class="search-title">项目角色：</span>
          <div>
            <span :class="'search-value ' + (activeItem2 == item ? 'active' : '')" v-for="item in dynamicTags" :key="item"
              @click="activeItem2 = item">{{item}}</span>
          </div>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-bottom:0px;">
        <div class="product-box" v-for="product in productList" :key="product.id">
          <div style="cursor: pointer;" @click="toProductPage(product.id)">
            <span>{{'No.' + product.id}}</span>
            <span style="margin:0 5px;">{{product.name}}</span>
            <el-tag size="small" v-if="product.active === '开发中'">开发中</el-tag>
            <el-tag type="success" size="small" v-if="product.active === '已结束'">已结束</el-tag>
            <el-tag type="info" size="small" v-if="product.active === '招募中'">招募中</el-tag>
          </div>
          <div style="margin:15px 0;">
            <span class="gray">招募：</span>
            <span>{{product.development_name}}</span>
            <span class="gray ml-10">类型：</span>
            <span>{{product.development_type ? product.development_type : '无'}}</span>
            <span class="gray ml-10">周期：</span>
            <span>{{product.developDay + '天'}}</span>
          </div>
          <div class="gray">
            <span>
              {{new Date(product.time).toLocaleString() + '发布'}}
            </span>
            <span style="transform: translateY(-1px);display: inline-block;margin:0 3px;">|</span>
            <span>
              {{product.contendCount + '人报名'}}
            </span>
          </div>
          <span class="product-price">￥{{Number(product.price).toLocaleString()}}</span>
        </div>
        <span v-if="!productList.length" style="margin: 0 auto;display: block;text-align: center;">无数据</span>
      </el-card>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        productList: '',
        productList1: '',
        dynamicTags: '',
        dynamicTags1: '',
        dynamicTags2: ['全部', '招募中', '开发中', '已结束'],
        activeItem: '全部',
        activeItem1: '全部',
        activeItem2: '全部'
      }
    },
    methods: {
      register() {
        this.$router.push('/register')
      },
      login() {
        this.$router.push('/login')
      },
      getDynamicTags() {
        this.$http.post('/getLabelList').then(res => {
          if (res.data.msg == 'success') {
            this.dynamicTags = res.data.pageData.filter(e => e.type == "developer")[0].label.split(',')
            this.dynamicTags1 = res.data.pageData.filter(e => e.type == "project")[0].label.split(',')
            this.dynamicTags.unshift('全部')
            this.dynamicTags1.unshift('全部')
          }
        })
      },
      getProductList() {
        this.$http.post('/getProjectList').then(res => {
          if (res.data.msg == 'success') {
            this.productList = res.data.pageData
            this.productList.forEach(product => {
              const day = Math.ceil((new Date(product.update_time).getTime() - new Date(product.create_time).getTime()) /
                (60 * 60 * 60 * 1000))
              this.$set(product, 'developDay', day)
              this.$http.post('/getBidList', {
                projectId: product.id
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
                      this.$set(product, 'active', '已结束')
                    } else {
                      this.$set(product, 'active', '开发中')
                    }
                  } else {
                    this.$set(product, 'active', '招募中')
                  }
                  this.$set(product, 'contendCount', result.data.pageData.length)
                }
              })
            })
            this.productList1 = this.productList
          }
        })
      },
      toProductPage(id) {
        window.open(`${window.location.origin}/#/productMessage?id=${id}`)
        // this.$router.push(`/productMessage?id=${id}`)
      }
    },
    watch: {
      activeItem(newV, oldV) {
        if (newV !== '全部') {
          if (this.activeItem1 == '全部' && this.activeItem2 == '全部') {
            this.productList = this.productList1.filter(product => product.development_type == newV)
          } else {
            if (this.activeItem1 == '全部') {
              this.productList = this.productList1.filter(product => product.development_name.includes(this.activeItem2) &&
                product.development_type == newV)
            }
            if (this.activeItem2 == '全部') {
              this.productList = this.productList1.filter(product => product.active == this.activeItem1 && product.development_type ==
                newV)
            }
            if (this.activeItem1 != '全部' && this.activeItem2 != '全部') {
              this.productList = this.productList1.filter(product => product.development_type == newV && product.active ==
                this.activeItem1 && product.development_name.includes(this.activeItem2))
            }
          }
        } else {
          if (this.activeItem1 == '全部' && this.activeItem2 == '全部') {
            this.productList = this.productList1
          } else {
            if (this.activeItem1 == '全部') {
              this.productList = this.productList1.filter(product => product.development_name.includes(this.activeItem2))
            }
            if (this.activeItem2 == '全部') {
              this.productList = this.productList1.filter(product => product.active == this.activeItem1)
            }
            if (this.activeItem1 != '全部' && this.activeItem2 != '全部') {
              this.productList = this.productList1.filter(product => product.active ==
                this.activeItem1 && product.development_name.includes(this.activeItem2))
            }
          }
        }
      },
      activeItem1(newV, oldV) {
        if (newV !== '全部') {
          if (this.activeItem == '全部' && this.activeItem2 == '全部') {
            this.productList = this.productList1.filter(product => product.active == newV)
          } else {
            if (this.activeItem == '全部') {
              this.productList = this.productList1.filter(product => product.development_name.includes(this.activeItem2) &&
                product.active == newV)
            }
            if (this.activeItem2 == '全部') {
              this.productList = this.productList1.filter(product => product.development_type == this.activeItem &&
                product.active == newV)
            }
            if (this.activeItem != '全部' && this.activeItem2 != '全部') {
              this.productList = this.productList1.filter(product => product.active == newV && product.development_type ==
                this.activeItem && product.development_name.includes(this.activeItem2))
            }
          }
        } else {
          if (this.activeItem == '全部' && this.activeItem2 == '全部') {
            this.productList = this.productList1
          } else {
            if (this.activeItem == '全部') {
              this.productList = this.productList1.filter(product => product.development_name.includes(this.activeItem2))
            }
            if (this.activeItem2 == '全部') {
              this.productList = this.productList1.filter(product => product.development_type == this.activeItem)
            }
            if (this.activeItem != '全部' && this.activeItem2 != '全部') {
              this.productList = this.productList1.filter(product => product.development_type ==
                this.activeItem && product.development_name.includes(this.activeItem2))
            }
          }
        }
      },
      activeItem2(newV, oldV) {
        if (newV !== '全部') {
          if (this.activeItem == '全部' && this.activeItem1 == '全部') {
            this.productList = this.productList1.filter(product => product.development_name.includes(newV))
          } else {
            if (this.activeItem == '全部') {
              this.productList = this.productList1.filter(product => product.active == this.activeItem1 && product.development_name
                .includes(newV))
            }
            if (this.activeItem1 == '全部') {
              this.productList = this.productList1.filter(product => product.development_type == this.activeItem &&
                product.development_name.includes(newV))
            }
            if (this.activeItem != '全部' && this.activeItem1 != '全部') {
              this.productList = this.productList1.filter(product => product.development_name.includes(newV) && product
                .active == this.activeItem1 && product.development_type == this.activeItem)
            }
          }
        } else {
          if (this.activeItem == '全部' && this.activeItem1 == '全部') {
            this.productList = this.productList1
          } else {
            if (this.activeItem == '全部') {
              this.productList = this.productList1.filter(product => product.active == this.activeItem1)
            }
            if (this.activeItem1 == '全部') {
              this.productList = this.productList1.filter(product => product.development_type == this.activeItem)
            }
            if (this.activeItem != '全部' && this.activeItem1 != '全部') {
              this.productList = this.productList1.filter(product => product
                .active == this.activeItem1 && product.development_type == this.activeItem)
            }
          }
        }
      }
    },
    created() {
      this.getDynamicTags()
      this.getProductList()
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
      padding: 25px;
    }

    .search-box {
      border-bottom: 1px solid #eff2f7;
      padding: 10px;

      .search-title {
        display: inline-block;
        font-size: 14px;
        color: #727f8f;
        margin-right: 10px;
        float: left;
        margin-top: 8px;
      }

      div {
        margin-left: 80px;

        .search-value {
          display: inline-block;
          padding: .3rem 1rem;
          color: #273444;
          font-size: .9rem;
          line-height: 1.3rem;
          cursor: pointer;
          margin: 0 .1rem .5rem;

          &.active {
            border-radius: 2px;
            background: #4289dc;
            color: #fff;
          }
        }
      }
    }

    .product-box {
      border-bottom: 1px solid #eff2f7;
      padding: 10px;
      font-size: 14px;
      position: relative;

      div:first-child {
        font-size: 18px;
      }

      .gray {
        color: #727f8f;
      }

      .ml-10 {
        margin-left: 30px;
      }

      .product-price {
        float: right;
        color: #f75288;
        position: absolute;
        right: 20px;
        top: 20px;
      }

      &:hover {
        background: #f9fafc;
      }
    }
  }

  .body {
    background-color: #f0f2f5;
    width: 100%;
    height: 100%;
  }

</style>
