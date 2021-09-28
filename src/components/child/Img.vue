<template>
  <div class="profile">
    <img :src="url" class="img" />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Img extends Vue {
  @Prop({
    default:
      'https://ymmtest.oss-cn-hangzhou.aliyuncs.com/ymmfile/explore-biz/ymm_1528188057605.png',
    type: String,
  })
  url?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.profile {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .img {
    width: 100%;
  }
}
</style>
