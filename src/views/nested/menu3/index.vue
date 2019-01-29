<template lang="">
    <div class="app-container">
        <!-- <el-row :gutter="20">
            <el-col :span="5">
                <el-button-group>
                    <el-button>本周</el-button>
                    <el-button>上周</el-button>
                    <el-button>上月</el-button>
                </el-button-group>
            </el-col>
            <el-col :span="5" :offset="3">
            <el-date-picker
                v-model="dateShow"
                type="date"
                placeholder="选择日期">
            
            </el-date-picker>
            </el-col>
        </el-row> -->
        <el-row :gutter="20" class="message">
            <el-col :span="5">
                <span>订货单</span>
                <p>{{comeInCount}}笔</p>
            </el-col>
            <el-col :span="5">
                <span>退货单</span>
                <p>{{goOutCount}}笔</p>
            </el-col>                       
             <el-col :span="5">
                <span>订货金额</span>
                <p>{{orderGoodsPrice.toFixed(2)}}</p>
            </el-col>           
            <el-col :span="4">
                <span>退货金额</span>
                <p>{{returnGoodsPrice.toFixed(2)}}</p>
            </el-col>
            <el-col :span="4">
                <span>金额总计</span>
                <p>{{(orderGoodsPrice - returnGoodsPrice).toFixed(2)}}</p>
            </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" class="charts" ref="IncomePriceChart">
          </el-col>
          <el-col :span="12" class="charts" ref="PayPriceChart">
          </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  data() {
    return {
      dateShow: false,
      failIncomePrice: [],
      failPayPrice: [],
      finishIncomePrice: [],
      finishPayPrice: [],
      comeIn: [],
      goOut: []
    };
  },
  computed: {
    orderGoodsPrice() {
      return this.finishIncomePrice.length
        ? this.finishIncomePrice
            .map(e => e.finishIncomePrice)
            .reduce((a, b) => a + b)
        : 0;
    },
    returnGoodsPrice() {
      return this.finishPayPrice.length
        ? this.finishPayPrice.map(e => e.finishPayPrice).reduce((a, b) => a + b)
        : 0;
    },
    goOutCount() {
      return this.goOut.length
        ? this.goOut.map(e => e.goOut).reduce((a, b) => a + b)
          ? this.goOut.map(e => e.goOut).reduce((a, b) => a + b)
          : 0
        : 0;
    },
    comeInCount() {
      return this.comeIn.length
        ? this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b)
          ? this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b)
          : 0
        : 0;
    }
  },
  created() {
    this.getTotalMoney();
    this.getStatistics();
  },
  methods: {
    getTotalMoney() {
      this.$http.post("/totalMoney").then(res => {
        if (res.data.status === 0) {
          this.failIncomePrice = res.data.failIncomePrice;
          this.failPayPrice = res.data.failPayPrice;
          this.finishIncomePrice = res.data.finishIncomePrice;
          this.finishPayPrice = res.data.finishPayPrice;
          const IncomePriceChartDiv = this.$refs.IncomePriceChart.$el;
          const PayPriceChartDiv = this.$refs.PayPriceChart.$el;
          const option = {
            title: {
              left: "center",
              text: "收入统计"
            },
            xAxis: {
              type: "category",
              data: this.getWeek()
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: this.getWeekData(
                  this.finishIncomePrice
                    .map(e => e.finishIncomePrice)
                    .reduce((a, b) => a + b)
                ),
                type: "line"
              }
            ]
          };
          const option1 = {
            title: {
              left: "center",
              text: "支出统计"
            },
            xAxis: {
              type: "category",
              data: this.getWeek()
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: this.getWeekData(
                  this.finishPayPrice
                    .map(e => e.finishPayPrice)
                    .reduce((a, b) => a + b)
                ),
                type: "line"
              }
            ]
          };
          const IncomePriceChart = this.$echarts.init(IncomePriceChartDiv);
          IncomePriceChart.setOption(option);
          const PayPriceChart = this.$echarts.init(PayPriceChartDiv);
          PayPriceChart.setOption(option1);
        }
      });
    },
    getStatistics() {
      this.$http.post("/statistics").then(res => {
        if (res.data.status === 0) {
          this.comeIn = res.data.comeIn;
          this.goOut = res.data.goOut;
        }
      });
    },
    getWeek() {
      const date = new Date();
      const result = [];
      for (let index = 0; index < 6; index++) {
        const time = new Date(date.getTime() - 60 * 60 * 1000 * 24 * index);
        result.push(`${time.getMonth() + 1}-${time.getDate()}`);
      }
      return result.reverse();
    },
    getWeekData(data) {
      const result = [];
      for (let index = 0; index < 6; index++) {
        result.push(Number(data) * Math.random());
      }
      return result;
    }
  }
};
</script>
<style scoped>
.message {
  background-color: #cbd4de;
  width: 100%;
  height: 100px;
  margin-top: 30px;
  border-radius: 2px;
  padding-top: 25px;
  font-size: 14px;
  color: #49494a;
}
.message .el-col {
  height: 100%;
  text-align: center;
}
.message span {
  font-size: 12px;
  color: #8d8f91;
}
.charts {
  height: 300px;
  margin-top: 50px;
}
</style>

