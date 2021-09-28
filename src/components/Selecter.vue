<template>
  <div
    ignorehtml2canvas
    class="eqc-select ng-isolate-scope"
    :class="{ 'root-node': isRoot }"
    v-if="visible"
    @mousedown="mousedown($event, 'm')"
  >
    <template v-if="isRoot">
      <div class="line-s line resizable">
        <div
          class="circle"
          @mousedown.stop="mousedown($event, 's')"
          v-show="show.s"
          style="cursor: ns-resize"
        ></div>
      </div>
    </template>
    <template v-else>
      <div
        class="rotate-circle"
        @mousedown="mousedown($event, 'r')"
        v-show="show.r && !accessResizeRotate"
      ></div>
      <div class="rotate-line" v-show="show.r && !accessResizeRotate"></div>
      <div class="bar bar-m-line"></div>
      <div class="line-n line resizable">
        <div
          class="circle"
          @mousedown.stop="mousedown($event, 'n')"
          v-show="!packed && show.n"
          style="cursor: ns-resize"
        ></div>
      </div>
      <div class="line-e line resizable">
        <div
          class="circle"
          @mousedown.stop="mousedown($event, 'e')"
          v-show="!packed && show.e"
          style="cursor: ew-resize"
        ></div>
      </div>
      <div class="line-s line resizable">
        <div
          class="circle"
          @mousedown.stop="mousedown($event, 's')"
          v-show="!packed && show.s"
          style="cursor: ns-resize"
        ></div>
      </div>
      <div class="line-w line resizable">
        <div
          class="circle"
          @mousedown.stop="mousedown($event, 'w')"
          v-show="!packed && show.w"
          style="cursor: ew-resize"
        ></div>
      </div>
      <div
        class="circle-nw circle resizable"
        @mousedown="mousedown($event, 'nw')"
        v-show="show.nw"
        style="cursor: nwse-resize"
      ></div>
      <div
        class="circle-ne circle resizable"
        @mousedown="mousedown($event, 'ne')"
        v-show="show.ne"
        style="cursor: nesw-resize"
      ></div>
      <div
        class="circle-se circle resizable"
        @mousedown="mousedown($event, 'se')"
        v-show="show.se"
        style="cursor: nwse-resize"
      ></div>
      <div
        class="circle-sw circle resizable"
        @mousedown="mousedown($event, 'sw')"
        v-show="show.sw"
        style="cursor: nesw-resize"
      ></div>
      <div
        class="circle-center resizable"
        v-if="movable"
        :class="{ canDraged: canDraged }"
        @mousedown="mousedown($event, 'm')"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import {
  isUnset,
  dimensionAnyTopx,
  getNoRotateBoundingClientRect,
} from '@/utils/common';
import axios, { AxiosResponse } from 'axios';
import { mapState } from 'vuex';

// function getRect($vm) {
//   const id = $vm.nodeInfo.id;
//   const rect = $vm.$el.getBoundingClientRect();
//   console.log('1');
//   const children = $vm.$children.filter((v) => v.$options.name == 'node');
//   const rects = [{ [id]: rect }].concat(
//     children.map((child) => getRect(child)),
//   );
//   return Object.assign.apply(null, rects);
// }

// let RECTS = {};

@Component
export default class Selecter extends Mixins(baseComponent) {
  @Prop({
    default: false,
  })
  isRoot?: Boolean;

  @Prop({
    default: false,
  })
  visible?: Boolean;

  @Prop({
    default: false,
  })
  packed?: Boolean;

  @Prop({
    default: false,
  })
  canDraged?: Boolean;

  @Prop({
    default: true,
  })
  movable?: Boolean;

  allRectProps = ['top', 'left', 'bottom', 'right', 'width', 'height'];
  startPos = {
    x: 0,
    y: 0,
    initx: 0,
    inity: 0,
  };
  rectangles = null; // 页面元素参考线集合
  sorbRectangles = {}; // 页面元素参考线集合
  isMoved = false;
  keyShifted = false;
  doType = ''; // 操作类型
  show = {
    n: true,
    e: true,
    s: true,
    w: true,
    nw: true,
    ne: true,
    se: true,
    sw: true,
    r: true,
  };
  accessResizeRotate = false;

  mounted() {
    console.log(this.$options.name);
    this.ema.bind('ui.mouseup', (ev) => {
      if (!this.visible || !this.doType) {
        return;
      }
      // const doType = this.doType;
      this.rectangles = null;
      this.doType = '';
      // if (!this.isRoot) {
      //   this.setRectInfo(this.isSetArray, this.isUnSetArray);
      // }
      // this.ema.fire('AssistLines.hide');
      // if (this.packed) this.resizeChildren(doType);
    });
    this.ema.bind('ui.mousemove', (ev: any) => {
      if (!this.visible) {
        return;
      }
      this.isMoved = true;
      if (!this.doType) {
        return;
      }
      // // 如果开启智能参考线或者吸附效果。需要初始化计算现在已有元素的位置信息
      // if (this.Setting.line || this.Setting.sorb) {
      //   this.initAllSorbLine();
      // }
      // if (this.Setting.line) {
      //   this.updateLine();
      // }
      this.dealMove(ev);
    });
  }

  mousedown(ev: any, type: any) {
    console.log(ev, type, 'mousedown');

    this.isMoved = false;
    // 记录定位信息那些属性设置过。那些没设置过
    // if (!this.isRoot) {
    //   this.isSetArray = [];
    //   this.isUnSetArray = [];
    //   this.allRectProps.forEach((element) => {
    //     var style = this.$parent.nodeInfo.style;
    //     if (!isUnset(style[element])) {
    //       this.isSetArray.push(element);
    //     } else {
    //       this.isUnSetArray.push(element);
    //     }
    //   });
    // }
    this.doType = type;
    var thisNode = this.$parent;
    var parentNode = thisNode.isRootNode
      ? { $el: document.querySelector('#stage') }
      : this.$parent.parentNodeVm || {};
    var size = dimensionAnyTopx(thisNode.$el, parentNode.$el);

    this.startPos = {
      size: size.rect,
      parentSize: size.parentRect,
      x: ev.pageX,
      y: ev.pageY,
      w: size.width,
      h: size.height,
      aspect: size.width / size.height,
      left: size.left,
      top: size.top,
      bottom: size.bottom,
      right: size.right,
      initx: ev.offsetX,
      inity: ev.offsetY,
      rightControl: size.rightControl,
      bottomControl: size.bottomControl,
    };
    // this.allRectProps.map((dis) => {
    //   let val = size[dis];
    //   if (dis == 'left' && size.rightControl)
    //     this.$set(thisNode.nodeInfo.style, 'left', null);
    //   else if (dis == 'top' && size.bottomControl)
    //     this.$set(thisNode.nodeInfo.style, 'top', null);
    //   else if (!isUnset(val) && !/%$/.test(thisNode.nodeInfo.style[dis]))
    //     this.$set(thisNode.nodeInfo.style, dis, val + 'px');
    // });
    // RECTS = getRect(thisNode);
    ev.stopPropagation();
  }

  dealMove(ev) {
    var style = this.$parent.nodeInfo.style;
    var type = this.doType;
    var height;
    var width;
    var left;
    var top;
    var right;
    var bottom;
    var rightControl = this.startPos.rightControl;
    var bottomControl = this.startPos.bottomControl;
    if (type.includes('s')) {
      height = ev.pageY - this.startPos.y + this.startPos.h;
      if (bottomControl)
        bottom = this.startPos.bottom - (ev.pageY - this.startPos.y);
    }
    if (type.includes('e')) {
      width = ev.pageX - this.startPos.x + this.startPos.w;
      if (rightControl)
        right = this.startPos.right - (ev.pageX - this.startPos.x);
    }
    if (type.includes('w')) {
      width = this.startPos.x - ev.pageX + this.startPos.w;
      if (!rightControl)
        left = this.startPos.left + (ev.pageX - this.startPos.x);
    }
    if (type.includes('n')) {
      height = this.startPos.y - ev.pageY + this.startPos.h;
      if (!bottomControl)
        top = this.startPos.top + (ev.pageY - this.startPos.y);
    }
    switch (type) {
      case 'se':
        if (this.keyShifted || this.packed) {
          [width, height] = ratioWH(width, height, this.startPos.aspect);
          if (bottomControl)
            bottom = this.startPos.bottom + (this.startPos.h - height);
          if (rightControl)
            right = this.startPos.right + (this.startPos.w - width);
        }
        break;
      case 'sw':
        if (this.keyShifted || this.packed) {
          [width, height] = ratioWH(width, height, this.startPos.aspect);
          if (!rightControl)
            left = this.startPos.left + (this.startPos.w - width);
          if (bottomControl)
            bottom = this.startPos.bottom + (this.startPos.h - height);
        }
        break;
      case 'nw':
        if (this.keyShifted || this.packed) {
          [width, height] = ratioWH(width, height, this.startPos.aspect);
          if (!bottomControl)
            top = this.startPos.top + (this.startPos.h - height);
          if (!rightControl)
            left = this.startPos.left + (this.startPos.w - width);
        }
        break;
      case 'ne':
        if (this.keyShifted || this.packed) {
          [width, height] = ratioWH(width, height, this.startPos.aspect);
          if (!bottomControl)
            top = this.startPos.top + (this.startPos.h - height);
          if (rightControl)
            right = this.startPos.right + (this.startPos.w - width);
        }
        break;
      case 'm':
        var pos = this.getSorbPos(ev);
        if (rightControl) {
          right = this.startPos.parentSize.width - this.startPos.w - pos.left;
        } else {
          left = pos.left;
        }
        if (bottomControl) {
          bottom = this.startPos.parentSize.height - this.startPos.h - pos.top;
        } else {
          top = pos.top;
        }
        break;
      case 'r':
        var rotate = 10;
        // 计算锚点
        var ancher = {
          left: this.startPos.size.left + this.startPos.size.width / 2,
          top: this.startPos.size.top + this.startPos.size.height / 2,
        };
        // 计算单位向量
        var unit = {
          x: ev.pageX - ancher.left,
          y: ev.pageY - ancher.top,
        };
        // 可吸附的角度
        var step = 30;
        // 计算角度
        rotate = (180 / Math.PI) * Math.atan(unit.y / unit.x) + 90;
        var cha = rotate % step;
        var baseRote = Math.round(rotate / step);
        // 角度容错率
        if (cha < 6) {
          rotate = baseRote * step;
        }
        if (unit.x < 0) {
          rotate = rotate - 180;
        }
        rotate = rotate.toFixed(2);
        this.$set(style, 'transform', `rotateZ(${rotate}deg)`);
        break;
    }
    // 记录位置的6个属性，有那些属性是设置过值的。

    if (!isUnset(top)) this.$set(style, 'top', top + 'px');
    if (!isUnset(left)) this.$set(style, 'left', left + 'px');
    if (!isUnset(bottom)) this.$set(style, 'bottom', bottom + 'px');
    if (!isUnset(right)) this.$set(style, 'right', right + 'px');
    if (!isUnset(width)) this.$set(style, 'width', width + 'px');
    if (!isUnset(height)) this.$set(style, 'height', height + 'px');

    function ratioWH(w, h, r) {
      var wh = w / r; // 宽对应的高
      var hw = h * r; // 高对应的宽
      return [hw > w ? w : hw, wh > h ? h : wh]; // width height
    }
  }

  /**
   * 获取吸附处理后的位置信息
   */
  getSorbPos(ev) {
    var sorbLenght = 8;
    var top = !this.startPos.bottomControl
      ? this.startPos.top
      : this.startPos.parentSize.height -
        this.startPos.bottom -
        this.startPos.h;
    var left = !this.startPos.rightControl
      ? this.startPos.left
      : this.startPos.parentSize.width - this.startPos.right - this.startPos.w;
    var pos = {
      top: top + (ev.pageY - this.startPos.y),
      left: left + (ev.pageX - this.startPos.x),
    };
    // 通过鼠标焦点计算元素当前拖动位置
    // var tempRect = {
    //   width: this.startPos.w,
    //   height: this.startPos.h,
    //   top: this.startPos.size.top + (ev.pageY - this.startPos.y),
    //   left: this.startPos.size.left + (ev.pageX - this.startPos.x),
    // };
    // console.log(this.Setting.sorb, 111111222222);
    // if (this.Setting.sorb) {
    //   // 对元素位置进行处理，计算 坐标 x1,x2,x3,y1,y2,y3
    //   var currPosX = {
    //     x1: tempRect.left,
    //     x2: tempRect.left + this.startPos.w / 2,
    //     x3: tempRect.left + this.startPos.w,
    //   };
    //   var currPosY = {
    //     y1: tempRect.top,
    //     y2: tempRect.top + this.startPos.h / 2,
    //     y3: tempRect.top + this.startPos.h,
    //   };
    //   // 对元素和横向坐标。纵向左边做差值计算，取做小的吸附坐标为参考
    //   var xarray = [];
    //   for (let key in currPosX) {
    //     this.sorbRectangles[key] &&
    //       xarray.push(currPosX[key] - this.sorbRectangles[key][0]);
    //   }
    //   var xindex = this.getMiniNumberIndex(xarray);
    //   if (
    //     xindex >= 0 &&
    //     this.sorbRectangles[`x${xindex + 1}`].length > 0 &&
    //     Math.abs(xarray[xindex]) < sorbLenght
    //   ) {
    //     pos.left = pos.left - xarray[xindex];
    //   }

    //   var yarray = [];
    //   for (let key in currPosY) {
    //     this.sorbRectangles[key] &&
    //       yarray.push(currPosY[key] - this.sorbRectangles[key][0]);
    //   }
    //   var yindex = this.getMiniNumberIndex(yarray);
    //   if (
    //     yindex >= 0 &&
    //     this.sorbRectangles[`y${yindex + 1}`].length > 0 &&
    //     Math.abs(yarray[yindex]) < sorbLenght
    //   ) {
    //     pos.top = pos.top - yarray[yindex];
    //   }
    // }
    return pos;
  }

  // getMiniNumberIndex(array) {
  //   var min = 1000000000;
  //   var index = -1;
  //   array.forEach((element, i) => {
  //     element = Math.abs(element);
  //     if (element) {
  //       if (Math.min(min, element) == element) {
  //         index = i;
  //       }
  //       min = Math.min(min, element);
  //     }
  //   });
  //   return index;
  // }

  // setRectInfo(directions, isUnSetArray) {
  //   var style = this.$parent.nodeInfo.style;
  //   if (style.position == 'relative') {
  //     return;
  //   }
  //   let selfRect = getNoRotateBoundingClientRect(window.$vue.$el);
  //   let parentRect = null;
  //   if (style.position == 'fixed' || window.$vue.isRootNode) {
  //     parentRect = getNoRotateBoundingClientRect(
  //       document.querySelector('#stage'),
  //     );
  //   } else {
  //     if (window.$vue.parentNodeVm.nodeInfo) {
  //       parentRect = getNoRotateBoundingClientRect(
  //         window.$vue.parentNodeVm.$el,
  //       );
  //     }
  //   }
  //   directions.forEach((direction) => {
  //     if (direction == 'height' || direction == 'width') {
  //       if (!/%$/.test(style[direction]))
  //         this.$set(
  //           style,
  //           direction,
  //           `${Math.abs(selfRect[direction]).toFixed(2)}px`,
  //         );
  //     } else {
  //       let dist = 0;
  //       dist = selfRect[direction] - parentRect[direction];
  //       this.$set(style, direction, `${dist.toFixed(2)}px`);
  //     }
  //   });
  //   isUnSetArray.forEach((direction) => {
  //     this.$delete(style, direction);
  //   });
  // }

  // resizeChildren(type = '', delta) {
  //   if (!/^[ewsn]{1,2}$/.test(type)) return;
  //   console.log('resizeChildren', type);
  //   const thisNode = this.$parent;
  //   const baseId = thisNode.nodeInfo.id;
  //   const startRects = RECTS;
  //   const start = startRects[baseId];
  //   const end = thisNode.$el.getBoundingClientRect();
  //   const size = ratioWH(end.width, end.height, this.startPos.aspect);
  //   const ratio = size[0] / start.width;
  //   const childrenIds = Object.keys(startRects).filter((v) => v !== baseId);
  //   const relatives = childrenIds.reduce((f, l) => {
  //     const rect = startRects[l];
  //     f[l] = ['left', 'right', 'bottom', 'top'].reduce(
  //       (o, k) => {
  //         o[k] =
  //           (rect[k] - start[k]) * (['right', 'bottom'].includes(k) ? -1 : 1);
  //         return o;
  //       },
  //       { width: rect.width, height: rect.height },
  //     );
  //     return f;
  //   }, {});
  //   const deltas = childrenIds.reduce((f, l) => {
  //     const rect = relatives[l];
  //     f[l] = ['left', 'right', 'bottom', 'top', 'height', 'width'].reduce(
  //       (o, k) => {
  //         o[k] = (ratio - 1) * rect[k];
  //         return o;
  //       },
  //       {},
  //     );
  //     return f;
  //   }, {});
  //   console.log('deltas', size, ratio, startRects, relatives, deltas);
  //   (function setRect({ nodeInfo, parentId, isRoot, ratio }) {
  //     var id = nodeInfo.id;
  //     if (!isRoot) {
  //       var style = nodeInfo.style;
  //       ['left', 'right', 'top', 'bottom', 'width', 'height'].map((v) => {
  //         var val = style[v];
  //         if (!/px$/.test(val)) return;
  //         var delta;
  //         if (style['position'] === 'relative') {
  //           if (['height', 'width'].includes(v)) {
  //             delta = deltas[id][v];
  //           } else {
  //             delta = parseFloat(val) * (ratio - 1);
  //           }
  //         } else {
  //           delta =
  //             deltas[id][v] -
  //             (parentId in deltas && !['height', 'width'].includes(v)
  //               ? deltas[parentId][v]
  //               : 0);
  //         }
  //         style[v] = parseFloat(val) + delta + 'px';
  //       });
  //     }
  //     var children = nodeInfo.child || [];
  //     if (children.length)
  //       children.map((c) => setRect({ nodeInfo: c, parentId: id, ratio }));
  //   })({ nodeInfo: thisNode.nodeInfo, isRoot: true, ratio });
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.eqc-select {
  // z-index: 103;
  position: absolute;
  pointer-events: none;
  height: 100%;
  width: 100%;
  cursor: move;
  top: 0;
  left: 0;
  border: 1px dashed #faad14;

  &.root-node {
    cursor: auto;
  }
}

.eqc-select > div {
  position: absolute;
  pointer-events: auto;
}

.eqc-select .line {
  z-index: 2;
}

.eqc-select .circle {
  z-index: 4;
}

.eqc-select .line-n {
  width: 100%;
  height: 5px;
  top: -4px;
}

.eqc-select .line-n div {
  position: absolute;
  left: 50%;
  top: -2px;
  margin-left: -6px;
}

.eqc-select .line-s {
  width: 100%;
  height: 5px;
  bottom: -4px;
}

.eqc-select .line-s div {
  position: absolute;
  left: 50%;
  bottom: -2px;
  margin-left: -6px;
}

.eqc-select .line-e {
  width: 5px;
  height: 100%;
  top: 0;
  right: -4px;
}

.eqc-select .line-e div {
  position: absolute;
  top: 50%;
  right: -2px;
  margin-top: -5px;
}

.eqc-select .line-w {
  width: 5px;
  height: 100%;
  top: 0;
  left: -4px;
}

.eqc-select .line-w div {
  position: absolute;
  top: 50%;
  left: -2px;
  margin-top: -5px;
}

.eqc-select .circle {
  width: 12px;
  height: 12px;
  background-color: #fff;
  border: 1px solid #59c7f9;
  border-radius: 12px;
  display: block;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}

.eqc-select .circle-center {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  cursor: move;

  .circle-center-point {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    position: absolute;
  }

  &.canDraged {
    .circle-center-point {
      background-color: red;
    }
  }
}

.eqc-select .circle-ne {
  top: -6px;
  right: -6px;
}

.eqc-select .circle-nw {
  top: -6px;
  left: -6px;
}

.eqc-select .circle-se {
  bottom: -6px;
  right: -6px;
}

.eqc-select .circle-sw {
  bottom: -6px;
  left: -6px;
}

.eqc-select .rotate-circle {
  width: 12px;
  height: 12px;
  border-radius: 12px;
  top: -28px;
  left: 50%;
  margin-left: -6px;
  background-color: #44cb83;
  border: none;
  cursor: move;
  cursor: -webkit-grabbing;
}

.eqc-select .rotate-line {
  width: 1px;
  height: 18px;
  top: -18px;
  left: 50%;
  margin-left: -0.5px;
  background-color: #44cb83;
}

.eqc-select .bar-m-line {
  height: 100%;
  border-left: 1px dashed #44cb83;
  top: 0;
  left: 50%;
  margin-left: -0.5px;
  display: none;
}
</style>
