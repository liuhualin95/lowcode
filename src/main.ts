import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Widget from './components/widget';
import Child from './components/child';

import {
  Button,
  Upload,
  MessageBox,
  Message,
  Loading,
  Table,
  TableColumn,
  Pagination,
  Image,
  Popover,
  Tooltip,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  PageHeader,
  Select,
  Option,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Radio,
  Tabs,
  TabPane,
  RadioButton,
  Tree,
  Collapse,
  CollapseItem,
  Switch,
  Slider,
  ColorPicker,
} from 'element-ui';

Vue.use(Button);
Vue.use(Upload);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Image);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(PageHeader);
Vue.use(Select);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(RadioButton);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tree);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Switch);
Vue.use(Slider);
Vue.use(ColorPicker);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

Vue.use(Widget);
Vue.use(Child);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
