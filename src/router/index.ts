import * as VueRouter from 'vue-router';

import P5Sketch from '@/components/P5Sketch.vue';
import NavBar from '@/components/NavBar.vue';
import SketchConfig from '@/components/SketchConfig.vue';
import StatusBar from '@/components/StatusBar.vue';

import boidSketchDef from '@/sketches/boid/sketch';
import sampleSketchDef from '@/sketches/sample/sketch';

export const sketches = {
  boids: boidSketchDef,
  sample: sampleSketchDef,
};

const routes = Object.entries(sketches).map(([name, sketchDef]) => ({
  path: `/sketch/${name}`,
  name,
  components: {
    default: P5Sketch,
    NavBar,
    SketchConfig,
    StatusBar,
  },
  props: {
    default: {
      sketch: sketchDef.sketch,
    },
    NavBar: {},
    SketchConfig: {
      useSketchStore: sketchDef.useStore,
    },
    StatusBar: {
      useSketchStore: sketchDef.useStore,
    },
  },
}));

//Add the default route
routes.unshift({ path: '/', redirect: `/sketch/${Object.keys(sketches)[0]}` });

export const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});
