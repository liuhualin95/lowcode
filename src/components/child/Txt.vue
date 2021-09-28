<template>
  <div>{{ text }}</div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Txt extends Vue {
  @Prop({
    default: '文本内容',
    type: String,
  })
  text?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped></style>
