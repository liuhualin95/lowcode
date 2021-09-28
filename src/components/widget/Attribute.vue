<template>
  <div class="widget attribute">
    <div v-show="selectNode">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基础信息" name="base">
          <el-form
            v-if="selectNode"
            size="mini"
            label-position="left"
            label-width="100px"
            :model="selectNode"
          >
            <el-form-item label="唯一id" style="position: relative">
              <el-input
                size="mini"
                @keydown.native="focuskeydown"
                v-model="selectNode.id"
                style="padding-right: 25px"
              ></el-input>
            </el-form-item>
            <el-form-item label="名称">
              <el-input
                size="mini"
                @keydown.native="focuskeydown"
                v-model="selectNode.label"
                style="padding-right: 25px"
              >
                <!-- <template slot="append">
                  <el-tooltip content="组件当前版本" placement="top">
                    <a class="">v{{ selectNode.version }}</a>
                  </el-tooltip>
                </template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="显示">
              <el-switch
                key="1"
                size="mini"
                v-model="selectNode.visible"
              ></el-switch>
            </el-form-item>
          </el-form>
        </el-collapse-item>
        <el-collapse-item title="属性设置" name="attr">
          <div
            v-if="selectNode"
            size="mini"
            label-position="left"
            label-width="80px"
            :model="selectNode"
          >
            <template v-for="item in propsInfo">
              <div
                class="form-item"
                :key="item.key"
                v-if="(!item.work || item.work()) && !item.meta.ignore"
              >
                <template>
                  <span class="label">
                    <el-tooltip placement="top">
                      <div style="max-width: 300px" slot="content">
                        {{ item.desc || '无' }}
                      </div>
                      <span>{{ item.label || item.key }}</span>
                    </el-tooltip>
                  </span>
                  <span class="value" v-if="item">
                    <!-- 文本相关 -->
                    <el-input
                      v-if="item.type == 'string'"
                      @keydown.native="focuskeydown"
                      size="mini"
                      v-model="selectNode.props[item.key]"
                    ></el-input>
                    <!-- <el-input
                      v-else-if="item.type == 'number'"
                      type="number"
                      size="mini"
                      v-model.number="selectNode.props[item.key]"
                    ></el-input>
                    <el-input
                      v-else-if="item.type == 'input'"
                      size="mini"
                      v-model="selectNode.props[item.key]"
                    ></el-input> -->
                    <el-input
                      v-else-if="item.type == 'text'"
                      :autosize="{ minRows: 2, maxRows: 5 }"
                      type="textarea"
                      size="mini"
                      v-model="selectNode.props[item.key]"
                    ></el-input>
                    <rich-text
                      v-else-if="item.type == 'richtext'"
                      :id="id"
                      v-model="selectNode.props[item.key]"
                    ></rich-text>
                    <el-switch
                      v-else-if="item.type == 'boolean'"
                      size="mini"
                      v-model="selectNode.props[item.key]"
                    ></el-switch>
                  </span>
                </template>
              </div>
            </template>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <i v-show="!selectNode" class="el-icon-lollipop icon-nodata nodata"></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import baseComponent from '@/components/extend/baseComponent';

@Component
export default class Attribute extends Mixins(baseComponent) {
  activeNames = ['base', 'attr'];
  selectNode = null;
  id = '';
  canEditId = false;
  targetVm = null;
  vm = null;
  propsInfo = {};

  mounted() {
    // 绑定被选中事件。确保只有一个元素被激活
    window.$vue && this.onSelectOne(window.$vue);
    this.ema.bind('select.oneInfo', ({ vm }) => {
      this.onSelectOne(vm);
    });
    this.ema.bind('select.noOne', () => {
      this.selectNode = null;
      this.vm = null;
    });
  }

  onSelectOne(vm) {
    let id = vm.nodeInfo.id;
    this.selectNode = null;
    this.targetVm = vm.$refs[id];
    this.vm = vm;
    this.dealPropsType();
    // this.loadEditor(vm.nodeInfo);
    this.selectNode = vm.nodeInfo;
    if (this.selectNode) {
      this.id = vm.nodeInfo.id;
    }
  }

  dealPropsType() {
    var instance = this.targetVm;
    this.propsInfo = [];
    function getPropType(prop) {
      // 编辑器属性上存在类型信息。以编辑器为准
      var propEditor = prop.editor || prop.editer;
      if (propEditor && propEditor.type) {
        return propEditor.type.toLocaleLowerCase();
      }
      var type = prop.type || '';
      if (typeof type == 'string') {
        return type;
      }
      const match = type.toString().match(fnTypeRE);
      var ttype =
        typeof type === 'function' ? (match && match[1]) || 'any' : 'any';
      return ttype.toLocaleLowerCase();
    }
    if (instance && instance.$options) {
      var props = instance.$options.props;
      var fnTypeRE = /^(?:function|class) (\w+)/;
      var propsData = [];
      for (let key in props) {
        const prop = props[key];
        var propEditor = prop.editor || prop.editer;
        let propData = {
          key,
          value: instance[key],
          type: getPropType(prop),
          work: ((propEditor && propEditor.work) || (() => true)).bind(
            instance,
          ), // 新增属性有效性（是否应出现）的检测 绑定this至当前组件实例
          meta: propEditor || {},
          order: prop.order || 10000,
          required: !!prop.required,
        };
        // 编辑属性存在则处理些特殊属性
        if (propEditor) {
          propData.label = propEditor.label;
          propData.desc = propEditor.desc;
        }
        propsData.push(propData);
      }
      this.propsInfo = propsData || [];
      this.propsInfo = this.propsInfo.sort(function (a, b) {
        return a.order - b.order;
      });
      console.log('propsData', propsData);
    }
  }

  focuskeydown(ev) {
    ev.panelName = 'attribute';
  }
}
</script>

<style lang="less">
.widget.attribute {
  .el-collapse {
    border: none;
  }
  .el-collapse-item {
    border-bottom: 1px solid #000;
    box-shadow: 0 2px 1px -2px #fff;
  }
  .el-collapse-item__header {
    border: none;
    background: none;
    color: #cccccc;
  }
  .el-collapse-item__wrap {
    background: none;
    border: none;
  }
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.widget.attribute {
  position: relative;
  padding: 5px !important;
  box-sizing: border-box;
  .el-input-group__append {
    padding: 0 10px;
    cursor: pointer;
  }

  .update {
    padding: 20px 10px;
    text-align: center;

    .desc {
      text-align: left;
      margin: 10px 5px;
    }
  }

  .id-lock {
    position: absolute;
    right: 0;
    top: 0;
  }

  .alerttip {
    margin-bottom: 5px;
  }

  .noselect {
    font-size: 20px;
    color: #aaa;
    font-weight: bolder;
    text-align: center;
  }

  .form-item {
    margin-bottom: 5px;
    padding: 5px;

    &:hover {
      background-color: #6081bd33;
      border-radius: 5px;
      .label {
        color: #ffffff;
      }
    }

    .label {
      font-weight: bold;
      display: inline-block;
      margin-bottom: 4px;
      font-size: 12px;
      min-width: 70px;
    }

    .value {
      color: #909399;
    }
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
