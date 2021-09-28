<template>
  <div v-html="text"></div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';
import axios, { AxiosResponse } from 'axios';
import baseComponent from '@/components/extend/baseComponent';

@Component
export default class RichText extends Vue {
  @Prop({
    default:
      '<p><span style="font-size: 54px; color: #ff0000;">Hi, <span style="color: #666699;">t</span></span><span style="font-size: 54px; color: #666699;">here</span></p>',
    type: String,
  })
  text?: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped></style>
