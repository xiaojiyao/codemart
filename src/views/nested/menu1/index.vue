<template>
  <div class="app-container">
    <el-row>
      <el-select
        v-model="searchType"
        placeholder="请选择搜索类型"
      >
        <el-option
          label="名称"
          value="name"
        ></el-option>
        <el-option
          label="专业区域"
          value="major"
        ></el-option>
      </el-select>
      <el-input
        v-model="searchValue"
        size="mini"
        placeholder="输入关键字搜索"
        style="width:200px"
      />
      <el-date-picker
        v-model="searchTime"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-button
        type="primary"
        style="margin-left:10px;"
        @click="search"
      >搜索</el-button>
    </el-row>
    <el-table
      :data="searchData"
      style="width: 100%"
    >
      <el-table-column
        align="center"
        label="序号"
        width="65"
        type="index"
      >
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="需求方"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="项目名称"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="专业区域"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.major }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="200px"
        label="项目介绍"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="费用"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="110px"
        align="center"
        label="竞标状态"
      >
        <template slot-scope="scope">
          <el-tag
            type="info"
            v-if="scope.row.bidStatus == 1"
          >待审核</el-tag>
          <el-tag v-if="scope.row.bidStatus == 2">开发中</el-tag>
          <el-tag
            type="danger"
            v-if="scope.row.bidStatus == 3"
          >已拒绝</el-tag>
          <el-tag
            type="danger"
            v-if="scope.row.bidStatus == 4"
          >已取消</el-tag>
          <el-tag
            type="success"
            v-if="scope.row.bidStatus == 5"
          >已完成</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        width="300px"
        align="center"
        label="起讫时间"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }} ~ {{ scope.row.update_time |
            parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="250px"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="star(scope.row.id)"
            v-if="scope.row.isStar"
          >收藏</el-button>
          <el-button
            size="mini"
            @click="bid(scope.row)"
            type="primary"
            v-if="scope.row.isBid && userInfo.status == 2"
          >竞标</el-button>
          <el-button
            size="mini"
            @click="openWindow(scope.row.enclosure)"
            type="primary"
            v-if="scope.row.enclosure"
          >下载附件</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      dataList: [],
      searchData: [],
      searchType: "",
      searchValue: "",
      searchTime: "",
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.user
    })
  },
  methods: {
    getProjectList() {
      const condition = {
        starUser: this.userInfo.username
      };
      this.$http.post("/getProjectList").then(res => {
        if (res.data.msg == "success") {
          res.data.pageData = res.data.pageData.filter(e => e.release_status == 2);
          res.data.pageData.forEach(element => {
            const condition = {
              starUser: this.userInfo.username,
              projectId: element.id
            };
            const condition1 = {
              bidUser: this.userInfo.username,
              projectId: element.id
            };
            this.$http.post("/getStarList", condition).then(res => {
              if (res.data.msg == "success") {
                this.$set(element, "isStar", !!!res.data.pageData.length);
              }
            });
            this.$http.post("/getBidList", condition1).then(res => {
              if (res.data.msg == "success") {
                this.$set(
                  element,
                  "isBid",
                  !!!res.data.pageData.length ||
                    res.data.pageData[0].status == 4
                );
                this.$set(
                  element,
                  "bidId",
                  res.data.pageData.length ? res.data.pageData[0].id : ""
                );
                this.$set(
                  element,
                  "bidStatus",
                  res.data.pageData.length ? res.data.pageData[0].status : ""
                );
              }
            });
          });
          this.dataList = res.data.pageData;
          this.searchData = res.data.pageData;
        }
      });
    },
    search() {
      this.searchData = this.dataList.filter(data =>
        data[this.searchType]
          ? data[this.searchType].indexOf(this.searchValue) !== -1
          : true
      );
      if (this.searchTime.length) {
        this.searchData = this.dataList.filter(
          data =>
            new Date(data.create_time).getTime() >
              new Date(this.searchTime[0]).getTime() &&
            new Date(data.update_time).getTime() <
              new Date(this.searchTime[1]).getTime()
        );
      }
    },
    star(projectId) {
      const condition = {
        starUser: this.userInfo.username,
        projectId
      };
      this.$http.post("/addStar", condition).then(res => {
        if (res.data.msg == "success") {
          this.getProjectList();
          this.$message({
            message: "收藏成功",
            type: "success"
          });
        }
      });
    },
    bid(item) {
      if (item.bidStatus == 4) {
        const condition = {
          id: item.bidId,
          status: 1
        };
        this.$http.post("/updateBid", condition).then(res => {
          if (res.data.msg == "success") {
            this.$message({
              message: "已重新申请竞标",
              type: "success"
            });
          }
          this.getProjectList();
        });
      } else {
        const condition = {
          bidUser: this.userInfo.username,
          projectId: item.id
        };
        this.$http.post("/addBid", condition).then(res => {
          if (res.data.msg == "success") {
            this.$message({
              message: "已提交竞标申请",
              type: "success"
            });
          }
          this.getProjectList();
        });
      }
    },
    openWindow(url) {
      window.open(`../../../../service/upload/${url}`);
    }
  },
  created() {
    this.getProjectList();
  }
};
</script>
<style scoped>
.el-table {
  border: 1px solid #ebeef5;
  margin-top: 20px;
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
  padding: 0 5px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  color: #212121;
  margin-right: 10px;
}

.el-select {
  width: 200px;
  height: 40px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 10px;
}
</style>
