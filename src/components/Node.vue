<template>
  <div
    class="node"
    v-show="visible"
    @dragenter="dragenter($event)"
    @dragover="dragover($event)"
    @drop="drop($event)"
    @dragleave="dragleave($event)"
    @click.stop="actived"
    @contextmenu.prevent.stop="showContextMenu(nodeInfo, $event)"
    :class="{ active: isActive, dragentered: dragentered }"
    :style="computedStyle"
  >
    <component
      :is="handleDynamicComp(currPage)"
      v-bind="nodeInfo.props"
      :ref="nodeInfo.id"
      :style="componentStyle"
    >
      <template v-if="nodeInfo.child && !(slots === false)">
        <node
          :slot-style="slots(index) && slots(index).style"
          :slot="slots(index) && slots(index).name"
          v-for="(item, index) in nodeInfo.child"
          :node-index="index"
          :stacked="nodeInfo.stack"
          :key="item.id"
          :info="item"
        ></node>
      </template>
    </component>
    <selecter
      ref="selector"
      :packed="packed"
      :is-root="isRootNode && !nodeInfo.packed"
      :visible="isActive"
      :warpStyle="nodeInfo.style"
    ></selecter>
    <template v-if="nodeInfo.child && slots === false">
      <node
        v-for="(item, index) in nodeInfo.child"
        :node-index="index"
        :stacked="nodeInfo.stack"
        :key="item.id"
        :info="item"
      ></node>
    </template>
    <!-- <div
      :style="{ width: phoneSize.width }"
      :class="{ hover: dragenteredDivider }"
      class="node-divider"
      @dragleave="dragleaveDivider"
      @dragover="dragoverDivider"
      @dragenter="dragenterDivider"
      @drop="dropDivider"
      v-if="!stacked && !fixed"
    ></div>
    <div
      v-show="!stacked && !fixed"
      class="type-icon iconfont icon-stack"
    ></div>
    <div v-show="fixed" class="type-icon iconfont icon-nail-fixed"></div>
    <div
      v-show="nodeInfo.leaf"
      :style="{ 'margin-right': !stacked || fixed ? '14px' : '0' }"
      class="type-icon iconfont icon-leaf"
    ></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import { getBaseNode, componentAddJudge } from '@/utils/common';
import { mapState } from 'vuex';
import baseComponent from '@/components/extend/baseComponent';
import axios, { AxiosResponse } from 'axios';
import Selecter from './Selecter.vue';

function styleParser(style = {}): any {
  // @ts-ignore
  styleParser.$div = styleParser.$div || document.createElement('div');
  const sortedStyle = Object.keys(style)
    .sort((a = '', b = '') => (a.length > b.length ? 1 : -1))
    .reduce((o, k) => {
      // @ts-ignore
      o += `${k}: ${style[k]};`;
      return o;
    }, '');
  // @ts-ignore
  styleParser.$div.style = sortedStyle;
  // @ts-ignore
  return styleParser.$div.style.cssText.split(/;\s*/).reduce((o, v = '') => {
    const arr = v.match(/^\s*([^:]+):\s*(.+)\s*$/);
    const info = arr ? { [arr[1]]: arr[2] } : {};
    return Object.assign(o, info);
  }, {});
}

@Component({
  components: { Selecter },
  computed: mapState({
    phoneSize: (state: any) => state.setting.phoneSize,
  }),
})
export default class Node extends Mixins(baseComponent) {
  @Prop()
  info!: any;

  @Prop({
    default: true,
  })
  stacked?: Boolean;

  @Prop()
  nodeIndex?: number;

  isActive = false;
  dragentered = false;
  slots = false;
  currPage = '';
  componentEvents = 'auto';
  oldId = '';

  get nodeInfo() {
    this.$set(this.info, 'version', this.info.version || '0.1.0');
    return this.info;
  }

  get computedStyle() {
    // @ts-ignore
    const sortedStyle = styleParser(this.nodeInfo.style);
    const slotStyle =
      typeof this.slotStyle === 'object' && this.slotStyle
        ? this.slotStyle
        : {};
    return Object.assign(
      { 'pointer-events': this.packedChild ? 'none' : 'auto' },
      sortedStyle,
      slotStyle,
    );
  }

  get isRootNode() {
    return (
      this.nodeInfo.id === 'root' ||
      this.nodeInfo.type === 'node' ||
      this.$parent.$options.name === 'Scene'
    );
  }

  get packed() {
    return !this.isRootNode && this.nodeInfo.packed;
  }

  get componentStyle() {
    return {
      'pointer-events': this.packedChild ? 'none' : this.componentEvents,
    };
  }

  get parentNodeVm(): any {
    let $vm = this;
    // @ts-ignore
    while ((($vm = $vm.$parent), $vm && $vm.$options.name !== 'Node'));
    return $vm;
  }

  get packedChild(): any {
    if (this.isRootNode) return false;
    return this.parentNodeVm.packed || this.parentNodeVm.packedChild;
  }

  // getter
  get visible() {
    if (this.nodeInfo) {
      return (this.nodeInfo as any).visible;
    } else {
      return false;
    }
  }

  // setter
  set visible(newValue) {
    (this.nodeInfo as any).visible = newValue;
  }

  mounted() {
    this.currPage = this.nodeInfo.id;
    this.oldId = this.nodeInfo.id;
    this.bindSelectOne();
  }

  handleDynamicComp(name: string) {
    if (name.startsWith('truck/richtext')) {
      return 'RichText';
    } else if (name.startsWith('truck/image')) {
      return 'Img';
    } else if (name.startsWith('truck/text')) {
      return 'Txt';
    } else if (name.startsWith('truck/button')) {
      return 'Btn';
    } else if (name.startsWith('truck/video')) {
      return 'TVideo';
    }
    return '';
  }

  mergeProps() {
    var id = this.nodeInfo.id;
    if (this.$refs[id] && this.$refs[id].$props) {
      for (const key in this.$refs[id].$props) {
        if (this.$refs[id].$props.hasOwnProperty(key)) {
          const element = this.$refs[id].$props[key];
          this.$set(this.nodeInfo.props, key, element);
        }
      }
    }
  }

  /**
   * 绑定选中一个节点事件
   */
  bindSelectOne() {
    // 绑定被选中事件。确保只有一个元素被激活
    this.ema.bind('select.one', (id, keepContextMenu) => {
      if (this.nodeInfo.locked) return;
      if (id != this.nodeInfo.id) {
        this.isActive = false;
      } else {
        console.log('select.one 1', this.nodeInfo);
        if (!keepContextMenu || keepContextMenu instanceof window.Event)
          this.ema.fire('hide.contextMenu'); // 隐藏已有菜单
        this.isActive = true;
        // 把组件里面的参数设置到数据里面
        this.mergeProps();
        // 选中的元素把元素节点相关信息通过事件派发出去。提供其他组件进行监听
        window.$vue = this;
        setTimeout(() => {
          this.ema.fire('select.oneInfo', {
            vm: this,
          });
        }, 200);
        // 对page容器特殊处理
        var parent = this.parentNodeVm;
        if (
          parent &&
          parent.nodeInfo &&
          parent.nodeInfo.type.indexOf('PageContainer') != -1
        ) {
          this.ema.fire('select.truckPageContainer', id);
        }
      }
    });
    this.ema.bind('select.noOne', () => {
      this.isActive = false;
      window.$vue = null;
    });
    // 绑定键盘删除按钮事件 对节点进行删除
    this.ema.bind('delete.down', (e) => {
      if (this.isActive) {
        if (e.panelName !== 'attribute') {
          this.$confirm('确认删除该组件?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              this.ema.fire('move.node', this.nodeInfo.id, null);
              this.ema.fire('select.noOne');
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消',
              });
            });
        }
      }
    });
  }

  /**
   * 显示右键菜单
   */
  showContextMenu(info: any, event: any) {
    console.log('showContextMenu');
    this.ema.fire('show.contextMenu', this, event);
  }

  /**
   * ==============拖动元素相关===============
   */
  /**
   * 选中某个节点
   * @augments
   */
  actived(keepContextMenu: any) {
    if (this.packedChild) return;
    // 通知所有节点被选中的是谁
    console.log('actived....', keepContextMenu, this.nodeInfo);
    if (this.nodeInfo.lock) {
      this.$message({ type: 'warning', message: '已被锁定，请先解锁' });
    } else {
      this.ema.fire('select.one', this.nodeInfo.id, keepContextMenu);
    }
  }

  dragenter(ev: any) {
    console.log('dragenter');
    ev.stopPropagation();
    // this.ema.fire('dragenter.one', this.nodeInfo.id);
  }
  dragleave(ev: any) {
    console.log('dragleave');
    ev.stopPropagation();
  }
  dragover(ev: any) {
    console.log('dragover');
    ev.stopPropagation();
    ev.preventDefault();
  }

  /**
   * 拖动释放元素，
   */
  drop(ev: any) {
    console.log('drop');
    ev.stopPropagation();
    ev.preventDefault();
    this.dragentered = false;
    let judge: any = componentAddJudge(this.nodeInfo, this);
    if (!judge.can) return this.$alert(judge.msg);
    // 对孩子数组进行初始化
    if (!this.nodeInfo.child) {
      this.$set(this.nodeInfo, 'child', []);
    }
    // 处理计算新元素的位置信息
    var currNodePos = this.$el.getBoundingClientRect();
    var mousePos = {
      top: ev.pageY,
      left: ev.pageX,
    };
    var dragPos = ev.dataTransfer.getData('dragPos');
    // 获取拖动元素鼠标相对元素的位置信息
    try {
      dragPos = JSON.parse(dragPos);
    } catch (e) {
      dragPos = { x: 0, y: 0 };
    }
    var targetPos = {
      top: mousePos.top - currNodePos.top - dragPos.y + 'px',
      left: mousePos.left - currNodePos.left - dragPos.x + 'px',
    };
    var moveId = ev.dataTransfer.getData('moveid');

    if (moveId) {
      // 内部组件移动
      if (moveId != this.nodeInfo.id) {
        // 拖动到其他组件内部
        this.ema.fire('move.node', moveId, this.nodeInfo, targetPos);
      } else {
      }
    } else {
      // 添加新的组件内容
      var componentInfo = JSON.parse(ev.dataTransfer.getData('componentInfo'));
      if (componentInfo.name) {
        console.log(componentInfo, 'lllllll');
        var nodeInfo: any = getBaseNode(componentInfo);
        // 暂时不添加left top 到style
        nodeInfo.forceStyle = {
          left: targetPos.left,
          top: targetPos.top,
        };
        // 如果给page容器添加孩子元素。孩子元素需要占满全屏
        if (/pageContainer$/i.test(this.nodeInfo.type)) {
          nodeInfo.forceStyle = {
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: '0',
            top: '0',
          };
        }
        console.log(JSON.stringify(nodeInfo), 'pppppppp');
        this.nodeInfo.child.push(nodeInfo);
        this.$nextTick(() => {
          this.ema.fire('select.one', nodeInfo.id);
        });
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.node {
  position: relative;
  cursor: pointer;
  user-select: none;
  font-size: 16px;
}
</style>
