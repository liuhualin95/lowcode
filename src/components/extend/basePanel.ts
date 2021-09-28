// @ts-nocheck
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class BasePanel extends Vue {
  showMask = false;
  dragPanel = null;

  mounted() {
    // // panel 标题开始拖动事件处理
    // this.ema.bind('dock.panelTitleDragStart', (target, info) => {
    //   this.showMask = true;
    //   this.dragPanel = target;
    //   this.dragInfo = info;
    // });
    // // 标题拖动完成事件处理
    // this.ema.bind('dock.panelTitleDragEnd', (value) => {
    //   this.showMask = false;
    // });
  }
}
