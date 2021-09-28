<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <span class="title">后台管理系统</span>
      </el-header>
      <el-container class="profile">
        <template v-if="isAdmin">
          <el-aside width="200px"><Menu></Menu></el-aside>
          <el-container>
            <el-main><router-view /></el-main>
            <!-- <el-footer>Footer</el-footer> -->
          </el-container>
        </template>
        <template v-else><router-view /></template>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Menu from '@/components/Menu.vue'; // @ is an alias to /src

@Component({
  components: {
    Menu,
  },
})
export default class App extends Vue {
  get isAdmin(): boolean {
    return !window.location.pathname.startsWith('/admin/editor');
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  .header {
    line-height: 60px;
    border-bottom: solid 1px #e6e6e6;
    .title {
      margin-left: 4px;
    }
  }
  .profile {
    height: calc(100vh - 60px);
  }
}
</style>
