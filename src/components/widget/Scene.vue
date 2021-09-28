<template>
  <div
    class="appWarp dont-override"
    ref="appWarp"
    id="appWarp"
    @scroll="scrollChange"
    @mousemove="mousemove"
    @mouseup="mouseup"
    @mouseleave="mouseup"
    @click="bgClick"
  >
    <!-- <div class="headertool" v-if="selectNode">
      <align :stacked="selectNodeStacked" :info="selectNode.style"></align>
    </div> -->
    <div class="editType">
      <el-radio-group @click.native.stop="" size="mini" v-model="editType">
        <el-radio-button label="editor">编辑模式</el-radio-button>
        <el-radio-button label="preview">预览模式</el-radio-button>
      </el-radio-group>
    </div>
    <!-- <div class="phoneSize">
      <div
        class="phoneItem"
        @click="changePhoneSize(item)"
        :class="{ active: phoneSize.name == item.name }"
        v-for="(item, index) in PHONE_SIZES"
        :key="index"
        :style="{ width: item.width, zIndex: 20 - index }"
      >
        <div class="desc">{{ item.name }} - {{ item.width }}</div>
      </div>
    </div> -->
    <div
      class="app"
      id="stage"
      :class="[phoneSize.name.toLowerCase().replace(/\s+/, '-')]"
      :style="{ width: phoneSize.width, minHeight: phoneSize.height }"
    >
      <node
        :key="info && info.id"
        :info="info"
        v-if="info && editType == 'editor'"
        ref="node"
      ></node>
      <perview-node
        :info="previewInfo"
        v-if="previewInfo && editType == 'preview'"
      ></perview-node>
    </div>
    <!-- <assist-lines></assist-lines> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import Node from '@/components/Node.vue';
import axios, { AxiosResponse } from 'axios';
import { mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  components: { Node },
  computed: mapState({
    phoneSize: (state: any) => state.setting.phoneSize,
  }),
})
export default class Scene extends Mixins(baseComponent) {
  editType = 'editor';
  // @ts-ignore
  info = window.Editor.nodeInfo;
  previewInfo = null;

  mounted() {
    console.log(this.$options.name);
    this.bindMove();
  }

  scrollChange() {
    const appWarp: any = this.$refs['appWarp'];
    this.ema.fire('appWarpOffsetChange', {
      top: appWarp.scrollTop,
      left: appWarp.scrollLeft,
    });
  }

  deleteNode(id) {
    var node = null;
    var parent = null;
    var key = 0;
    var walk = function (datas) {
      datas = datas || [];

      for (let index = 0; index < datas.length; index++) {
        const element = datas[index];
        if (element.id === id) {
          node = element;
          key = index;
          parent = datas;
          return;
        }
        if (element.child) {
          walk(element.child);
        }
      }
    };
    walk([this.info]);
    console.log(parent, key);
    if (!parent) return;
    this.$delete(parent, key);
    return node;
  }

  bindMove() {
    this.ema.bind('move.node', (moveId, targetNode, pos) => {
      console.log('move.node is coming', this.info);
      var moveNode = cloneDeep(this.deleteNode(moveId));
      if (pos) {
        moveNode.style.left = pos.left;
        moveNode.style.top = pos.top;
      }
      if (targetNode) {
        targetNode.child.push(moveNode);
      }
    });
  }

  /**
   * 背景点击，处理选中内容
   */
  bgClick() {
    this.ema.fire('hide.contextMenu');
    this.ema.fire('select.noOne');
  }
  mouseup(ev: any) {
    this.ema.fire('ui.mouseup', ev);
  }
  mousemove(ev: any) {
    this.ema.fire('ui.mousemove', ev);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.appWarp.dont-override {
  position: relative;
  font-size: 12px;
  width: 100%;
  height: 100%;
  overflow: auto;
  left: auto;
  right: auto;
  bottom: 0;
  padding-top: 85px;
  box-sizing: content-box;

  .editType {
    left: 0;
    right: 0;
    margin: 5px auto;
    width: 200px;
    display: block;
    z-index: 10000;
    top: 55px;
    position: fixed;

    .el-radio-group {
      box-shadow: 0px 8px 24px 1px #000000bd;
    }
  }

  .app {
    position: relative;
    margin: 0 auto 30000px;
    font-size: 12px;
    color: #000000;
    background-color: #ffffff;
    transform: translate(0, 0);
  }
  .app.desktop {
    margin-top: 5px;
  }
  .app.desktop:before {
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: -30px;
    height: 30px;
    content: '';
    display: block;
    background-repeat: no-repeat;
    background-size: 1366px auto;
    background-position: 50% bottom;
    // background-image: url('../../assets/image/ruler.png');
  }
}
</style>
