import Vue from 'vue';
import RichText from './RichText.vue';
import Img from './Img.vue';
import Txt from './Txt.vue';
import Btn from './Btn.vue';
import TVideo from './TVideo.vue';

function install() {
  Vue.component('RichText', RichText);
  Vue.component('Img', Img);
  Vue.component('Txt', Txt);
  Vue.component('Btn', Btn);
  Vue.component('TVideo', TVideo);
}
export default { install };
