import EMA from '@/utils/ema';
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';

@Component({
  computed: mapState({
    Config: (state: any) => state.Config,
    Setting: (state: any) => state.setting,
    RootNodeInfo: (state: any) => state.RootNodeInfo,
    Metadata: (state: any) => state.Metadata,
    App: (state: any) => state.app,
    demoMode: (state: any) => state.setting.demoMode,
  }),
})
export default class Base extends Vue {
  ema: Record<string, Function> = {};
  [key: string]: any;

  created() {
    this.ema = EMA.getProxy();
  }

  mounted() {}

  destroyed() {
    if (this.ema) {
      this.ema.dispose();
    }
  }

  routerJump(item: Record<string, string>) {
    console.log(item);
    console.log(this.Config);
    this.$router.push({ path: item.path });
  }

  bindEvent(key: string, fn: Function) {
    if (!this.$options.name) {
      console.warn('绑定事件的组件不存在组件名称', key);
    }
    this.ema.bind(`${this.$options.name}.${key}`, fn);
  }

  openDialog(data: any) {
    this.ema.fire('Dialogs.push', data);
  }
}
