import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: string) {
  // @ts-ignore
  return originalPush.call(this, location).catch((_) => {});
};

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/editor',
    name: 'Editor',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Editor.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/admin',
  routes,
});

export default router;
