<template>
  <div
    class="ui-dock"
    :class="[info.type, showMask ? 'showMask' : '']"
    :style="{ flex: info.flex || 1, 'z-index': level }"
  >
    <template v-for="(item, key) in info.children">
      <panel
        v-if="item.type == 'panel'"
        :key="'panel' + key"
        :info="item"
        :level="level + 1"
      ></panel>
      <dock-main
        v-else
        :key="'main' + key"
        :info="item"
        :level="level + 1"
      ></dock-main>
      <resizer
        v-if="key != info.children.length - 1"
        :key="'resize' + key"
        :type="info.type"
        :class="[info.type]"
        :level="level + 1"
      ></resizer>
    </template>
    <!-- <div
      v-if="showMask && info.children.length != 1"
      :style="{ 'z-index': level }"
      @dragover="dragover($event)"
      @drop="drop($event)"
      @dragleave="dragleave($event)"
      @dragenter="dragenter($event)"
      class="mask top"
    ></div>
    <div
      v-if="showMask && info.children.length != 1"
      :style="{ 'z-index': level }"
      @dragover="dragover($event)"
      @drop="drop($event)"
      @dragleave="dragleave($event)"
      @dragenter="dragenter($event)"
      class="mask left"
    ></div>
    <div
      v-if="showMask && info.children.length != 1"
      :style="{ 'z-index': level }"
      @dragover="dragover($event)"
      @drop="drop($event)"
      @dragleave="dragleave($event)"
      @dragenter="dragenter($event)"
      class="mask right"
    ></div>
    <div
      v-if="showMask && info.children.length != 1"
      :style="{ 'z-index': level }"
      @dragover="dragover($event)"
      @drop="drop($event)"
      @dragleave="dragleave($event)"
      @dragenter="dragenter($event)"
      class="mask bottom"
    ></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import Panel from './Panel.vue';
import Resizer from './Resizer.vue';

@Component({
  components: { Panel, Resizer },
})
export default class DockMain extends Vue {
  @Prop()
  info?: any;

  @Prop()
  level?: number;

  // [key: string]: any;
  showMask = false;
  preBrother: any = null;
  nextBrother: any = null;
  preFlex: any = null;
  nextFlex: any = null;

  boxSize: Record<string, number> = {
    width: 0,
    iwidth: 0,
    height: 0,
    iheight: 0,
  };
  resizerSize = 3;

  mounted() {
    setTimeout(() => {
      // this.info.children[0].flex = 0.4;
    }, 1500);
  }

  getBrother(resizer: any) {
    let index = 0;
    const child = this.$children;
    child.find((value, key) => {
      if (value == resizer) {
        index = key;
        return true;
      }
    });
    if (index) {
      this.preBrother = child[index - 1];
      this.nextBrother = child[index + 1];
    }
  }

  initBounding() {
    const box = this.$el.getBoundingClientRect();
    const length = this.$children.length;
    this.boxSize.width = box.width;
    this.boxSize.iwidth = box.width - Math.floor(length / 2) * this.resizerSize;
    this.boxSize.height = box.height;
    this.boxSize.iheight =
      box.height - Math.floor(length / 2) * this.resizerSize;
  }

  dealPx() {
    const key = this.info.type == 'row' ? 'width' : 'height';
    const total = this.boxSize['i' + key];
    // 查询是否有不是百分比的数据，如果有的话。统一容错处理
    const px = this.info.children.find((element: any) => {
      if ((element.flex + '').indexOf('px') != -1) {
        return true;
      }
    });
    if (px) {
      this.info.children.forEach((element: any) => {
        element.flex = 1 / this.info.children.length;
      });
    }
    this.info.children.forEach((element: any) => {
      this.$set(element, 'flex', element.flex * total + 'px');
    });
  }

  mousedown(params: any) {
    this.getBrother(params);
    this.initBounding();
    this.dealPx();
    if (this.preBrother && this.nextBrother) {
      this.preFlex = parseFloat(this.preBrother.info.flex);
      this.nextFlex = parseFloat(this.nextBrother.info.flex);
    }
  }

  doMove(move: any) {
    const key = this.info.type == 'row' ? 'x' : 'y';
    // @ts-ignore
    const preFlex = parseFloat(this.preFlex - move[key]);
    const nextFlex = parseFloat(this.nextFlex + move[key]);
    if (this.preBrother && this.nextBrother) {
      this.preBrother.info.flex = preFlex + 'px';
      this.nextBrother.info.flex = nextFlex + 'px';
    }
  }

  /**
   * 拖动完成后，需要把孩子元素的px转换为百分比
   */
  mouseup() {
    this.initBounding();
    const key = this.info.type == 'row' ? 'width' : 'height';
    const total = this.boxSize['i' + key];
    this.info.children.forEach((element: any) => {
      this.$set(element, 'flex', parseFloat(element.flex) / total);
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.ui-dock {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  overflow: auto;

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

  &.row {
    flex-direction: row;
    flex-wrap: nowrap;
  }

  &.column {
    flex-direction: column;
    flex-wrap: nowrap;
  }
}
</style>
