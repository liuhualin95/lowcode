<template>
  <div
    class="ui-dock-panel"
    :class="{ showMask: showMask }"
    :style="{ flex: info.flex || 1, 'z-index': level }"
    @keydown="keydown($event)"
    @keyup="keydown($event)"
  >
    <el-tabs
      type="border-card"
      :class="{ active: active }"
      class="border-card"
      v-model="editableTabsValue"
    >
      <el-tab-pane
        class="tab-panel"
        v-for="item in info.children"
        :key="item.component"
        :name="item.component"
      >
        <span slot="label" class="tab-label">
          <i class="el-icon-date"></i>
          {{ item.name }}
        </span>
        <component
          :active="editableTabsValue == item.component"
          v-if="item.component"
          :is="item.component"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
// import axios, { AxiosResponse } from 'axios';
import baseComponent from '@/components/extend/baseComponent';
import basePanel from '@/components/extend/basePanel';
import cloneDeep from 'lodash/cloneDeep';

@Component
export default class Panel extends Mixins(baseComponent, basePanel) {
  @Prop()
  info?: any;

  @Prop()
  level?: number;

  active = false;
  editableTabsValue = '';

  mounted() {
    this.activeFirst();
  }

  keydown(ev) {
    if (this.active) {
      ev.panelName = this.selectPanel.component;
    }
  }

  activeFirst() {
    const $first = this.info.children && this.info.children[0];
    this.editableTabsValue = $first.component;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
* {
  user-select: none;
}
.ui-dock-panel {
  max-width: 100%;
  max-height: 100%;
}
.ui-dock-panel:focus {
  outline: none;
}

.ui-dock-panel {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  position: relative;
  box-sizing: border-box;
  contain: content;
  color: #bdbdbd;
  cursor: default;
  &.showMask {
    pointer-events: none;

    .mask {
      pointer-events: auto;
    }
  }

  .mask {
    position: absolute;
    width: 30%;
    height: 30%;
    margin: auto;

    &.header {
      background-color: rgba(255, 255, 255, 0);
      left: 0;
      right: 0;
      top: 0;
      width: 100%;
      height: 30px;
    }

    &.top {
      left: 0;
      right: 0;
      top: 0;
    }

    &.left {
      left: 0;
      bottom: 0;
      top: 0;
    }

    &.right {
      right: 0;
      bottom: 0;
      top: 0;
    }

    &.bottom {
      right: 0;
      left: 0;
      bottom: 0;
    }
  }

  .border-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .control {
    position: absolute;
    right: 10px;
    top: 5px;
    color: #dddddd;
  }

  .tab-panel {
    height: 100%;
    background: #212020;
    > * {
      width: 100%;
    }
  }
}
</style>
<style lang="less">
.ui-dock-panel .el-tabs__content {
  padding: 0px !important;
  flex: 1 0 0;
  overflow: auto;
}
.ui-dock-panel .el-tabs__item {
  line-height: 30px;
  height: 30px;
  padding: 0 10px;
}

.ui-dock-panel .widget {
  padding: 0px;
}
.ui-dock-panel > .el-tabs--border-card {
  border: none;
}
</style>
