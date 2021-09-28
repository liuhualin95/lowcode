<template>
  <div class="editor-profile">
    <dock v-if="nodeInfo && layoutData" :info="layoutData"></dock>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent'; // @ is an alias to /src
import Dock from '@/components/dock/Index.vue';
import emptyPage from '@/assets/data/empty.json';
import defaultLayoutData from '@/assets/data/default.json';
import cloneDeep from 'lodash/cloneDeep';
import { getBaseNode, componentAddJudge } from '@/utils/common';

@Component({
  components: {
    Dock,
  },
})
export default class Editor extends Mixins(baseComponent) {
  layoutData: any = null;
  nodeInfo: any = null;

  mounted() {
    // @ts-ignore
    window.Editor = this;
    this.bindEvent();
    this.nodeInfo = cloneDeep(emptyPage);
    this.$store.dispatch('SettingChange', { demoMode: true });
    this.layoutData = defaultLayoutData;
  }

  bindEvent() {
    // 按键
    window.document.addEventListener('keydown', (e) => {
      var keyCode = e.keyCode;
      switch (keyCode) {
        case 8:
          this.ema.fire('delete.down', e);
        case 46:
          this.ema.fire('delete.down', e);
          break;
      }
    });
    // 绑定组件点击添加组件到根元素
    this.ema.bind('commponent.addOne', (menu: any) => {
      let selectNode = this.nodeInfo;
      if (window.$vue && window.$vue.nodeInfo) {
        selectNode = window.$vue.nodeInfo;
      }
      const nodeInfo = getBaseNode(menu);
      let judge = componentAddJudge(selectNode, window.$vue || this);
      if (!judge.can) return this.$alert(judge.msg);
      // 如果给page容器添加孩子元素。孩子元素需要占满全屏
      if (/pageContainer$/i.test(selectNode.type)) {
        nodeInfo.forceStyle = {
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: '0',
          top: '0',
        };
      }
      if (!selectNode.child) {
        this.$set(selectNode, 'child', []);
      }
      console.log(selectNode);
      selectNode.child.push(nodeInfo);
    });
  }
}
</script>

<style lang="less" scoped>
.editor-profile {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
