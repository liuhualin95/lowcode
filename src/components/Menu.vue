<template>
  <el-menu :default-active="defaultActive" class="el-menu-vertical-demo">
    <el-menu-item
      :index="item.id"
      :key="key"
      v-for="(item, key) in routerData"
      @click="routerJump(item)"
    >
      <i :class="[item.icon, 'icon-position']"></i>
      <span slot="title">{{ item.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// import axios, { AxiosResponse } from 'axios';

const routerData = [
  {
    id: 'audit',
    icon: 'el-icon-user',
    name: '审核管理',
    path: '/audit',
  },
  {
    id: 'words',
    icon: 'el-icon-phone-outline',
    name: '话术管理',
    path: '/words',
  },
  {
    id: 'tasks',
    icon: 'el-icon-tickets',
    name: '任务管理',
    path: '/tasks',
  },
  {
    id: 'editor',
    icon: 'el-icon-tickets',
    name: '编辑器',
    path: '/editor',
  },
];

@Component
export default class HelloWorld extends Vue {
  defaultActive = 'audit';
  routerData = routerData;

  routerJump(item: Record<string, string>) {
    this.$router.push({ path: item.path });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-menu-vertical-demo {
  height: 100%;
  .icon-position {
    vertical-align: text-bottom;
  }
}
</style>
