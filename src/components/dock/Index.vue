<template>
  <div
    class="ui-dock-main"
    @mouseup="mouseup($event)"
    @mousemove="mousemove($event)"
  >
    <!-- <div class="mask"></div> -->
    <dock-main :info="info.layout" :level="10"></dock-main>
    <!-- <dialogone
      v-for="(item, key) in info.dialogs"
      :key="(item.component || 'main') + key"
      :info="item"
    >
      <main-dock
        v-if="item && item.children"
        :info="item"
        :level="11"
      ></main-dock>
    </dialogone>
    <dialogone
      v-for="(item, key) in onedialogs"
      :key="item.component + key"
      :info="item"
    ></dialogone>
    <div class="dock-mask dock" :style="maskStyle" v-if="showMask"></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import axios, { AxiosResponse } from 'axios';
import DockMain from './Main.vue';

@Component({
  components: {
    DockMain,
  },
})
export default class Dock extends Mixins(baseComponent) {
  @Prop()
  info?: Object;

  mouseup() {
    this.ema.fire('dock-mouseup');
  }

  mousemove($event: any) {
    this.ema.fire('dock-mousemove', $event);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.ui-dock-main {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;

  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  .dock-mask {
    position: absolute;
    pointer-events: none;
    z-index: 999;
    box-sizing: border-box;
    background: rgba(0, 128, 255, 0.3);
    border-width: 2px;
    border-style: solid;
    border-color: rgb(0, 153, 255);
    border-image: initial;
  }
}
</style>
