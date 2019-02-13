<template>
  <el-menu
    class="navbar"
    mode="horizontal"
  >
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb />
    <el-dropdown
      class="avatar-container"
      trigger="click"
    >
      <div class="avatar-wrapper">
        <img
          :src="`../../../service/upload/${userInfo.image}`"
          class="user-avatar"
        >
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu
        slot="dropdown"
        class="user-dropdown"
      >
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="goHome"
          >Home</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span
            style="display:block;"
            @click="logout"
          >LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import { mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    ...mapState({
      userInfo: state => state.user.user
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
    goHome() {
      this.$router.push("/dashboard");
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

