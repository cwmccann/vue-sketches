<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { computed } from 'vue';
import type { SketchState } from './SketchState';
import TextControl from './config/TextControl.vue';
import BooleanControl from './config/BooleanControl.vue';
import SliderControl from './config/SliderControl.vue';

const appStore = useAppStore();

const props = defineProps({
  useSketchStore: {
    type: Function,
    required: true,
  },
});

const sketchStore = props.useSketchStore() as SketchState;
const config = computed(() => {
  return Object.fromEntries(
    Object.entries(sketchStore.props)
      .filter(([, prop]) => prop.type !== 'status')
      .map(([key, prop]) => [key, prop.type])
  );
});

const componentMap = computed(() => {
  return {
    text: TextControl,
    color: TextControl,
    boolean: BooleanControl,
    slider: SliderControl,
    status: TextControl,
  };
});

const getLabel = (key: string) => {
  return sketchStore.props[key].label ? sketchStore.props[key].label : key;
};
</script>

<template>
  <div class="drawer">
    <input
      id="config-drawer"
      type="checkbox"
      class="drawer-toggle"
      v-model="appStore.configVisible"
    />
    <div class="drawer-side">
      <label for="config-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <div v-for="(type, key) in config" :key="key">
          <component
            :is="componentMap[type]"
            :key="key"
            :label="getLabel(key)"
            v-model="sketchStore.props[key].value"
          />
        </div>
      </div>
    </div>
  </div>
</template>
