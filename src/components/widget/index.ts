import Vue from 'vue';
import Scene from './Scene.vue';
// import PageTemplate from './PageTemplate'
import Components from './Components.vue';
// import ComponentInfo from './ComponentInfo'
import Attribute from './Attribute.vue';
import ComponentTree from './ComponentTree.vue';
// import CombinedComponents from './CombinedComponents'
// import ScriptEditor from './ScriptEditor'
// import Animate from './animate/index'
// import PageInfo from './PageInfo'
import StyleEditor from './StyleEditor.vue';
// import CodePanel from './CodePanel'
// import Shop from './Shop'

function install() {
  Vue.component('widgetScene', Scene);
  // Vue.component('widgetPageTemplate', PageTemplate)
  Vue.component('widgetAttribute', Attribute);
  Vue.component('widgetComponent', Components);
  Vue.component('widgetComponentTree', ComponentTree);
  Vue.component('widgetStyleEditor', StyleEditor);
  // Vue.component('widgetScriptEditor', ScriptEditor)
  // Vue.component('widgetAnimate', Animate)
  // Vue.component('widgetPageInfo', PageInfo)
  // Vue.component('widgetComponentInfo', ComponentInfo)
  // Vue.component('widgetCombinedComponents', CombinedComponents)
  // Vue.component('widgetCodePanel', CodePanel)
  // Vue.component('widgetShop', Shop)
}
export default { install };
