<template>
  <div class="profile">
    <video
      class="video"
      :src="src"
      :loop="loop"
      :poster="poster"
      :autoplay="autoplay"
      :controls="controls"
    >
      {{ videoContent }}
    </video>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TVideo extends Vue {
  @Prop({
    default: true,
    type: Boolean,
  })
  controls?: Boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  autoplay?: Boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  loop?: Boolean;

  @Prop({
    default: 'http://vfx.mtime.cn/Video/2019/02/04/mp4/190204084208765161.mp4',
    type: String,
  })
  src?: String;

  @Prop({
    default: 'code',
    type: String,
  })
  type?: String;

  @Prop({
    default: '抱歉，您的浏览器不支持内嵌视频',
    type: String,
  })
  videoContent?: String;

  // 一个海报帧的URL
  @Prop({
    default:
      'https://upload-images.jianshu.io/upload_images/5809200-a99419bb94924e6d.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
    type: String,
  })
  poster?: String;

  @Prop({
    type: Function,
  })
  errFn?: Function;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.profile {
  width: 100%;
  height: 100%;
  .video {
    width: 100%;
    height: 100%;
    padding: 0;
  }
}
</style>
