<template>
  <div class="component-tree">
    <el-tree
      ref="tree"
      :data="treeData"
      :props="{ children: 'child' }"
      :show-checkbox="false"
      highlight-current
      :indent="8"
      draggable
      node-key="id"
      :filter-node-method="filterNode"
      default-expand-all
      :expand-on-click-node="false"
      :allow-drop="allowDrop"
      @current-change="onCheckChange"
      @node-drop="nodeDropEnd"
    >
      <span
        class="custom-tree-node"
        :class="{ 'packed-node': rootNode.id !== data.id && data.packed }"
        slot-scope="{ node, data }"
        @dragstart.stop.prevent="() => {}"
        :draggable="data.renaming"
      >
        <span v-show="!data.renaming" class="custom-tree-node-left">
          {{ data.label || data.id }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import { cloneDeep } from 'lodash';

@Component
export default class ComponentTree extends Mixins(baseComponent) {
  // @ts-ignore
  info = window.Editor.nodeInfo;

  get treeData() {
    return [this.info];
  }

  get rootNode() {
    return this.info;
  }

  mounted() {
    this.ema.bind('select.one', (id) => {
      let $comtree = this.$refs['tree'];
      if (!id) return;
      console.log('select.one 2', id, $comtree.getNode(id));
      $comtree.setCurrentKey(id);
    });
  }

  filterNode(value, data) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  allowDrop(draggingNode, dropNode, type) {
    if (!dropNode || !dropNode.id) return false;
    if (!draggingNode || !draggingNode.id) return false;
    if (draggingNode.data && draggingNode.data.id == this.rootNode.id)
      return false;
    if (
      dropNode.data.id == this.rootNode.id &&
      (type == 'prev' || type == 'next')
    )
      return false;
    if (dropNode.id == draggingNode.id) return false;
    var parentNode = type === 'inner' ? dropNode : dropNode.parent;
    var childLimit =
      parentNode.data && parentNode.data.leaf
        ? 0
        : parentNode.data && parentNode.data.childLimit;
    var childLen =
      (parentNode.data &&
        parentNode.data.child &&
        parentNode.data.child.length) ||
      0;
    if (childLen >= childLimit) return false;
    if (type == 'inner' && dropNode.data && dropNode.data.packed) return false;
    return true;
  }

  nodeDropEnd(draggingNode, dropNode, type) {
    var parentNode = type === 'inner' ? dropNode : dropNode.parent;
    var parentNodeInfo = parentNode.data || {};
    var draggingNodeInfo = draggingNode.data || {};
    console.log(draggingNodeInfo.id, 'droped in', parentNodeInfo.id);
    if (
      draggingNodeInfo.style &&
      draggingNodeInfo.style.position ===
        (parentNodeInfo.stack ? 'relative' : 'absolute')
    ) {
      draggingNodeInfo.style = Object.assign({}, draggingNodeInfo.style, {
        position: parentNodeInfo.stack ? 'absolute' : 'relative',
        left: '0px',
        top: '0px',
      });
    }
    console.log(parentNode);
    if (parentNode.childNodes?.length) {
      console.log(
        ' parentNode.childNodes[0].data.id',
        parentNode.childNodes[0].data.id,
      );
      parentNode.childNodes.forEach((child) =>
        this.ema.fire('select.one', child.data.id),
      );
    }
    this.ema.fire('select.one', parentNode.data.id);
  }

  onCheckChange(data, node) {
    this.ema.fire('select.one', data.id);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.el-tree-node.is-current > .el-tree-node__content {
  .custom-tree-node-left::before {
    background: #383225 !important;
  }
}
.component-tree {
  position: relative;
  min-height: 100%;
  .el-tree {
    background: #212020;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    text-shadow: 1px 1px 0px #000;
    &:hover {
      .custom-tree-node-left::before {
        background: #353535 !important;
      }
    }
  }

  .el-tree-node.is-current > .el-tree-node__content {
    color: #e6a23c;
    font-weight: bold;
    background: #353535 !important;
  }

  .el-tree-node__content {
    .el-icon-caret-right {
      color: #e6a23c;
    }
    &:hover {
      background: #353535 !important;
    }
    .el-tree-node__expand-icon.is-leaf {
      color: transparent;
    }
  }
}
</style>
