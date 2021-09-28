<template>
  <div class="mycomponents">
    <div class="components" :class="[comListsStyle]">
      <div
        class="com-item"
        v-for="com in comLists"
        :key="com.id"
        @dragstart="dragstart($event, com)"
        draggable="true"
        @click="addOne(com)"
      >
        <div class="com-item-avatar">
          <img
            @error="imgError($event)"
            :src="com.path | componentIcon"
            class="icon-img"
          />
        </div>
        <div class="com-item-content">
          <!-- <p class="com-item-name">{{ com.name }}</p> -->
          <p class="com-item-desc" @click.stop="readme(com)">{{ com.desc }}</p>
          <!-- <p class="com-item-count">
            <i class="iconfont icon-download"></i>
            {{ com.useNumber || 0 }}
          </p> -->
        </div>
      </div>

      <!-- <a @click="goShop" class="addComponent">添加组件</a> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import comLists from '@/assets/data/compList.json';
import axios, { AxiosResponse } from 'axios';

@Component({
  filters: {
    componentIcon: function (path: string) {
      return !path
        ? 'https://imagecdn.ymm56.com/ymmfile/explore-biz/ymm_1527843621175.png'
        : path.replace(/index.js$/, 'icon.png');
    },
  },
})
export default class Components extends Mixins(baseComponent) {
  comListsStyle = 'card';
  comLists = [];

  mounted() {
    this.search();
  }

  search() {
    this.comLists = comLists;
    // this.ema.bind('components.refresh', this.search);
  }

  dragstart(ev: any, menu: any) {
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('componentInfo', JSON.stringify(menu));
    ev.dataTransfer.setData(
      'dragPos',
      JSON.stringify({
        x: ev.offsetX,
        y: ev.offsetY,
      }),
    );
    ev.dataTransfer.setDragImage(ev.target, ev.offsetX, ev.offsetY);
    return true;
  }

  addOne(menu: any) {
    this.ema.fire('commponent.addOne', menu);
    this.ema.fire('dock.panelActive', 'widgetScene');
  }

  imgError(ev: any = {}) {
    const target = ev.target || {};
    const src = target.src;
    if (/cover.png$/.test(src))
      target.src = src.replace(/cover.png$/, 'icon.png');
  }

  readme(com: any) {
    // this.ema.fire('widgetComponentInfo.selectOne', com);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.mycomponents {
  height: 100%;
  position: relative;
  flex-direction: column;
  display: flex;

  .components {
    width: 100%;
    overflow: auto;
    height: 0;
    flex: 1;
    padding-bottom: 5px;
    padding-top: 5px;

    .addComponent {
      text-align: center;
      padding: 10px;
      clear: both;
      float: none;
      display: block;
      color: #faad14;
      font-size: 12px;
      cursor: pointer;
    }

    .com-item {
      position: relative;
      height: 50px;
      padding: 0 10px;
      display: flex;

      &:hover {
        background-color: #6081bd33;
        cursor: pointer;
      }

      .com-item-avatar {
        margin-top: 5px;
        width: 40px;
        height: 40px;

        img {
          overflow: hidden;
          border-radius: 5px;
          width: 90%;
          height: auto;
          vertical-align: bottom;
        }
      }

      .com-item-content {
        height: 50px;
        flex: 1;

        p {
          padding: 0;
          margin: 0;
          font-size: 12px;
          line-height: 1;
          text-align: left;
          margin-left: 5px;
        }

        .com-item-name {
          margin-top: 6px;
          font-size: 14px;
          font-weight: bold;
        }

        .com-item-desc {
          margin-top: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;

          &:hover {
            color: #3899ec;
          }
        }

        .com-item-count {
          position: absolute;
          right: 10px;
          top: 3px;
          color: #00a5e0;
          font-size: 12px;
          transform: scale(0.8);

          i {
            vertical-align: -1px;
          }
        }
      }
    }

    &.card {
      .com-item {
        width: 118px;
        height: 118px;
        overflow: hidden;
        display: block;
        border: 1px solid #505152;
        box-shadow: 0 0 6px 0 rgba(22, 45, 61, 0.27);
        float: left;
        margin-left: 8px;
        margin-bottom: 8px;
        padding: 0;
        text-align: center;
        border-radius: 5px;
        display: block;
        position: relative;
        .com-item-avatar {
          margin: 0;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            object-position: center center;
            vertical-align: top;
          }
        }

        .com-item-name {
          word-wrap: break-word;
          display: none;
        }

        .com-item-content {
          margin: auto;
          height: auto;

          .com-item-desc {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            white-space: pre-line;
            line-height: 1.3;
            padding: 10px 10px;
            background-color: rgba(0, 0, 0, 0.5);
            margin: 0;
            color: #fff;
            &:hover {
              color: #f9bf4d;
            }
          }

          .com-item-count {
            top: 0;
            right: 1px;
          }
        }
      }
    }
  }
}
</style>
