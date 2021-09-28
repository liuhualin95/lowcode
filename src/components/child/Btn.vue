<template>
  <div class="profile">
    <el-button :type="type" class="btn">{{ text }}</el-button>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Btn extends Vue {
  @Prop({
    default: '输入文字',
    type: String,
  })
  text?: string;

  @Prop({
    default: 'default',
    type: String,
  })
  type?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.profile {
  width: 100%;
  height: 100%;
  .btn {
    width: 100%;
    height: 100%;
    padding: 0;
  }
}
</style>
