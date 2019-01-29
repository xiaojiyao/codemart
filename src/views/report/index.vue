<template lang="">
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="5">
                <el-button-group>
                    <el-button @click="searchDate('thisWeek')">本周</el-button>
                    <el-button @click="searchDate('lastWeek')">上周</el-button>
                    <el-button @click="searchDate('lastMonth')">上月</el-button>
                </el-button-group>
            </el-col>
            <!-- <el-col :span="5" :offset="3">
            <el-date-picker
                v-model="dateShow"
                type="date"
                placeholder="选择日期">
            
            </el-date-picker>
            </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" class="charts" ref="IncomePriceChart">
          </el-col>
          <el-col :span="10" class="charts" ref="PayPriceChart">
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
      goOut: [],
      IncomePriceChart: {},
      PayPriceChart: {},
      PayPriceOption: {},
      IncomePriceOption: {}
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
          const option = {
            title: {
              left: "center",
              text: "商品销售报表"
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
                    .reduce((a, b) => a + b) +
                    this.finishPayPrice
                      .map(e => e.finishPayPrice)
                      .reduce((a, b) => a + b),
                  7
                ),
                type: "line"
              }
            ]
          };
          const IncomePriceChart = this.$echarts.init(IncomePriceChartDiv);
          IncomePriceChart.setOption(option);
          this.IncomePriceChart = IncomePriceChart;
          this.IncomePriceOption = option;
        }
      });
    },
    getStatistics() {
      this.$http.post("/statistics").then(res => {
        if (res.data.status === 0) {
          this.comeIn = res.data.comeIn;
          this.goOut = res.data.goOut;
          const PayPriceChartDiv = this.$refs.PayPriceChart.$el;
          const option = {
            title: {
              left: "center",
              text: "订单统计报表"
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
                  this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b) +
                    this.goOut.map(e => e.goOut).reduce((a, b) => a + b),
                  7
                ),
                type: "line"
              }
            ]
          };
          const PayPriceChart = this.$echarts.init(PayPriceChartDiv);
          PayPriceChart.setOption(option);
          this.PayPriceChart = PayPriceChart;
          this.PayPriceOption = option;
        }
      });
    },
    getWeek() {
      const date = new Date();
      const result = [];
      for (let index = 0; index < 7; index++) {
        const time = new Date(date.getTime() - 60 * 60 * 1000 * 24 * index);
        result.push(`${time.getMonth() + 1}-${time.getDate()}`);
      }
      return result.reverse();
    },
    getLaskWeek() {
      const date = new Date(new Date().getTime() - 60 * 60 * 1000 * 24 * 7);
      const result = [];
      for (let index = 0; index < 7; index++) {
        const time = new Date(date.getTime() - 60 * 60 * 1000 * 24 * index);
        console.log(time);
        result.push(`${time.getMonth() + 1}-${time.getDate()}`);
      }
      return result.reverse();
    },
    getLaskMonth() {
      const date = new Date();
      const today = new Date(date.getFullYear(), date.getMonth(), 1);
      const result = [];
      const days = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
      console.log(days);
      for (let index = 0; index < days; index++) {
        const time = new Date(today.getTime() - 60 * 60 * 1000 * 24 * index);
        result.push(`${time.getMonth() + 1}-${time.getDate()}`);
      }
      console.log(result.reverse());
      return result.reverse();
    },
    getWeekData(data, days) {
      const result = [];
      for (let index = 0; index < days; index++) {
        result.push(Number(data) * Math.random());
      }
      return result;
    },
    searchDate(type) {
      switch (type) {
        case "thisWeek":
          this.IncomePriceOption.xAxis.data = this.getWeek();
          this.IncomePriceOption.series[0].data = this.getWeekData(
            this.finishIncomePrice
              .map(e => e.finishIncomePrice)
              .reduce((a, b) => a + b) +
              this.finishPayPrice
                .map(e => e.finishPayPrice)
                .reduce((a, b) => a + b),
            7
          );
          this.PayPriceOption.xAxis.data = this.getWeek();
          this.PayPriceOption.series[0].data = this.getWeekData(
            this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b) +
              this.goOut.map(e => e.goOut).reduce((a, b) => a + b),
            7
          );
          this.IncomePriceChart.setOption(this.IncomePriceOption);
          this.PayPriceChart.setOption(this.PayPriceOption);
          break;
        case "lastWeek":
          this.IncomePriceOption.xAxis.data = this.getLaskWeek();
          this.IncomePriceOption.series[0].data = this.getWeekData(
            this.finishIncomePrice
              .map(e => e.finishIncomePrice)
              .reduce((a, b) => a + b) +
              this.finishPayPrice
                .map(e => e.finishPayPrice)
                .reduce((a, b) => a + b),
            7
          );
          this.PayPriceOption.xAxis.data = this.getLaskWeek();
          this.PayPriceOption.series[0].data = this.getWeekData(
            this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b) +
              this.goOut.map(e => e.goOut).reduce((a, b) => a + b),
            7
          );
          this.IncomePriceChart.setOption(this.IncomePriceOption);
          this.PayPriceChart.setOption(this.PayPriceOption);
          break;
        case "lastMonth":
          this.IncomePriceOption.xAxis.data = this.getLaskMonth();
          this.IncomePriceOption.series[0].data = this.getWeekData(
            this.finishIncomePrice
              .map(e => e.finishIncomePrice)
              .reduce((a, b) => a + b) +
              this.finishPayPrice
                .map(e => e.finishPayPrice)
                .reduce((a, b) => a + b),
            this.getLaskMonth().length
          );
          this.PayPriceOption.xAxis.data = this.getLaskMonth();
          this.PayPriceOption.series[0].data = this.getWeekData(
            this.comeIn.map(e => e.comeIn).reduce((a, b) => a + b) +
              this.goOut.map(e => e.goOut).reduce((a, b) => a + b),
            this.getLaskMonth().length
          );
          this.IncomePriceChart.setOption(this.IncomePriceOption);
          this.PayPriceChart.setOption(this.PayPriceOption);
          break;
      }
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
  height: 400px;
  margin-top: 50px;
}
</style>

