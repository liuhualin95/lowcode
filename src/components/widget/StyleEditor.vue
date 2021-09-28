<template>
  <div class="style-editor">
    <template v-if="info">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="大小位置" name="size">
          <el-form
            size="mini"
            label-position="left"
            label-width="80px"
            :model="info"
          >
            <el-form-item label="宽">
              <el-input
                class="input"
                size="mini"
                v-model="info.width"
                placeholder=""
                @keydown.native="focuskeydown"
              ></el-input>
            </el-form-item>
            <el-form-item label="高">
              <el-input
                class="input"
                size="mini"
                v-model="info.height"
                placeholder=""
                @keydown.native="focuskeydown"
              ></el-input>
            </el-form-item>
            <el-form-item label="透明度">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="0"
                  :max="1"
                  v-model.number="opacity"
                  :step="0.1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="0.1"
                  :max="1"
                  :step="0.1"
                  size="mini"
                  v-model.number="opacity"
                  placeholder="0-1"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <!-- <el-collapse-item title="背景" name="background">
          <editor-background :info="info"></editor-background>
        </el-collapse-item>
        <el-collapse-item title="边框" name="border">
          <el-form
            size="mini"
            label-position="left"
            label-width="80px"
            :model="info"
          >
            <el-form-item label="样式">
              <div class="sliderWarp">
                <el-select v-model="border.style" placeholder="边框类型">
                  <el-option
                    v-for="item in Metadata.style.borderStyle"
                    :key="item.value"
                    :label="item.label || item.value"
                    :value="item.value"
                    :title="item.desc"
                  >
                    <span style="float: left">
                      {{ item.label || item.value }}
                    </span>
                    <a
                      style="float: right; font-size: 13px"
                      class="iconfont icon-info-light"
                      :title="item.desc"
                    ></a>
                  </el-option>
                </el-select>
                <el-color-picker
                  v-model="border.color"
                  show-alpha
                ></el-color-picker>
              </div>
            </el-form-item>
            <el-form-item label="宽度">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="0"
                  :max="50"
                  v-model.number="border.width"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="0"
                  :max="50"
                  :step="1"
                  size="mini"
                  v-model.number="border.width"
                  placeholder="0-50"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="圆角">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="0"
                  :max="50"
                  v-model.number="borderRadius"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="0"
                  :max="50"
                  :step="1"
                  size="mini"
                  v-model.number="borderRadius"
                  placeholder="0-50"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="阴影" name="boxShadow">
          <el-form
            size="mini"
            label-position="left"
            label-width="80px"
            :model="info"
          >
            <el-form-item label="阴影大小">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="-150"
                  :max="150"
                  v-model.number="boxShadow.spread"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="-150"
                  :max="150"
                  :step="1"
                  size="mini"
                  v-model.number="boxShadow.spread"
                  placeholder="+-150"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="模糊半径">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="0"
                  :max="150"
                  v-model.number="boxShadow.blur"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="0"
                  :max="150"
                  :step="1"
                  size="mini"
                  v-model.number="boxShadow.blur"
                  placeholder="0-150"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="横向偏移">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="-150"
                  :max="150"
                  v-model.number="boxShadow.x"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="-150"
                  :max="150"
                  :step="1"
                  size="mini"
                  v-model.number="boxShadow.x"
                  placeholder="+-150"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="纵向偏移">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="-150"
                  :max="150"
                  v-model.number="boxShadow.y"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="-150"
                  :max="150"
                  :step="1"
                  size="mini"
                  v-model.number="boxShadow.y"
                  placeholder="+-150"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="阴影颜色">
              <el-color-picker
                v-model="boxShadow.color"
                show-alpha
              ></el-color-picker>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="边距" name="margin">
          <el-form
            size="mini"
            label-position="left"
            label-width="80px"
            :model="info"
          >
            <el-form-item label="内边距">
              <div class="sliderWarp">
                <el-slider
                  class="slider"
                  size="mini"
                  :min="0"
                  :max="100"
                  v-model.number="padding"
                  :step="1"
                ></el-slider>
                <el-input
                  class="input"
                  type="number"
                  :min="0"
                  :max="100"
                  :step="1"
                  size="mini"
                  v-model.number="padding"
                  placeholder="0-25"
                ></el-input>
              </div>
            </el-form-item>
            <template v-if="!fixedOrAbsolute">
              <el-form-item label="上边距">
                <div class="sliderWarp">
                  <el-slider
                    class="slider"
                    size="mini"
                    :min="0"
                    :max="250"
                    v-model.number="margin.top"
                    :step="1"
                  ></el-slider>
                  <el-input
                    class="input"
                    type="number"
                    :min="0"
                    :max="250"
                    :step="1"
                    size="mini"
                    v-model.number="margin.top"
                    placeholder="0-25"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="左边距">
                <div class="sliderWarp">
                  <el-slider
                    class="slider"
                    size="mini"
                    :min="0"
                    :max="250"
                    v-model.number="margin.left"
                    :step="1"
                  ></el-slider>
                  <el-input
                    class="input"
                    type="number"
                    :min="0"
                    :max="250"
                    :step="1"
                    size="mini"
                    v-model.number="margin.left"
                    placeholder="0-25"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="右边距">
                <div class="sliderWarp">
                  <el-slider
                    class="slider"
                    size="mini"
                    :min="0"
                    :max="250"
                    v-model.number="margin.right"
                    :step="1"
                  ></el-slider>
                  <el-input
                    class="input"
                    type="number"
                    :min="0"
                    :max="250"
                    :step="1"
                    size="mini"
                    v-model.number="margin.right"
                    placeholder="0-25"
                  ></el-input>
                </div>
              </el-form-item>
              <el-form-item label="下边距">
                <div class="sliderWarp">
                  <el-slider
                    class="slider"
                    size="mini"
                    :min="0"
                    :max="250"
                    v-model.number="margin.bottom"
                    :step="1"
                  ></el-slider>
                  <el-input
                    class="input"
                    type="number"
                    :min="0"
                    :max="250"
                    :step="1"
                    size="mini"
                    v-model.number="margin.bottom"
                    placeholder="0-25"
                  ></el-input>
                </div>
              </el-form-item>
            </template>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="文字样式" name="text">
          <editor-text :info="info"></editor-text>
        </el-collapse-item> -->
        <el-collapse-item title="文字样式" name="text">
          <el-form
            size="mini"
            label-position="left"
            label-width="50px"
            :model="info"
          >
            <el-form-item label="字体:">
              <el-select v-model="info['font-family']" placeholder="字体">
                <el-option
                  v-for="item in Metadata.style.fontFamily"
                  :key="item.value"
                  :label="item.label || item.value"
                  :value="item.value"
                  :title="item.desc"
                >
                  <span style="float: left">
                    {{ item.label || item.value }}
                  </span>
                  <a
                    style="float: right; font-size: 13px"
                    class="iconfont icon-info-light"
                  ></a>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="对齐:">
              <el-select v-model="info['text-align']" placeholder="对齐方式">
                <el-option
                  v-for="item in Metadata.style.textAlign"
                  :key="item.value"
                  :label="item.label || item.value"
                  :value="item.value"
                  :title="item.desc"
                >
                  <span style="float: left">
                    {{ item.label || item.value }}
                  </span>
                  <a
                    style="float: right; font-size: 13px"
                    class="iconfont icon-info-light"
                  ></a>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="加粗:">
              <el-select v-model="info['font-weight']" placeholder="加粗大小">
                <el-option
                  v-for="item in Metadata.style.fontWeight"
                  :key="item.value"
                  :label="item.desc || item.value"
                  :value="item.value"
                  :title="item.desc"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字号:">
              <el-input
                class="input"
                type="number"
                :min="10"
                :max="100"
                size="mini"
                v-model="info['font-size']"
                placeholder=""
                @keydown.native="focuskeydown"
              ></el-input>
            </el-form-item>
            <el-form-item label="行高:">
              <el-input
                class="input"
                type="number"
                :max="100"
                size="mini"
                v-model="info['line-height']"
                placeholder=""
                @keydown.native="focuskeydown"
              ></el-input>
            </el-form-item>
            <el-form-item label="颜色:">
              <el-input
                v-model="info['color']"
                size="mini"
                @keydown.native="focuskeydown"
              >
                <el-color-picker
                  slot="prefix"
                  size="mini"
                  v-model="info['color']"
                  show-alpha
                ></el-color-picker>
              </el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </template>
    <i v-if="!info" class="el-icon-lollipop icon-nodata nodata"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';
import { cloneDeep } from 'lodash';

@Component
export default class StyleEditor extends Mixins(baseComponent) {
  info = null;
  nodeId = null;
  activeNames = [
    'size',
    'border',
    'align',
    'background',
    'border',
    'boxShadow',
    'margin',
    'text',
  ];
  opacity = 1;

  @Watch('opacity')
  changeOpacity(val = 1) {
    this.$set(this.info, 'opacity', val);
  }

  mounted() {
    this.info = window.$vue && window.$vue.nodeInfo.style;
    this.nodeId = window.$vue && window.$vue.nodeInfo.id;
    this.ema.bind('select.oneInfo', ({ vm }) => {
      this.info = vm.nodeInfo.style;
      this.nodeId = vm.nodeInfo.id;
    });
    this.ema.bind('select.noOne', () => {
      this.info = null;
      this.nodeId = null;
    });
  }

  focuskeydown(ev) {
    ev.panelName = 'attribute';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.style-editor {
  box-sizing: border-box;
  height: 100%;
  position: relative;
  padding: 5px;

  .sliderWarp {
    display: flex;
  }

  .input {
    width: 68px;
  }

  .slider {
    width: 90px;
    flex: 1;
    float: left;
    margin-right: 15px;
    margin-left: 10px;
    position: relative;
    bottom: 5px;
    display: inline-block;
  }

  .icon-nodata.nodata {
    font-size: 117px;
    margin: 30px auto;
    display: block;
    width: 130px;
    height: 130px;
  }
}
</style>
