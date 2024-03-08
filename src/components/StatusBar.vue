<script setup lang="ts">
import ResetIcon from '@/components/icons/ResetIcon.vue';
import PlayIcon from '@/components/icons/PlayIcon.vue';
import PauseIcon from '@/components/icons/PauseIcon.vue';
import { computed } from 'vue';
import type { SketchState } from './SketchState';

const props = defineProps({
  useSketchStore: {
    type: Function,
    required: true,
  },
});

const store = props.useSketchStore() as SketchState;

const togglePlay = () => {
  store.playing = !store.playing;
};

const reset = () => {
  store.resetSketch();
};

const statusMap = computed(() => {
  return Object.fromEntries(
    Object.entries(store.props)
      .filter(([, prop]) => prop.type === 'status')
      .map(([key, prop]) => [prop.label || key, prop.value])
  );
});
</script>

I
<template>
  <div class="flex justify-center items-center h-full border-t border-gray-500">
    <div class="flex justify-between items-center max-w-screen-md w-full px-4 pt-2">
      <div>
        <button class="btn btn-outline btn-sm mr-2" data-test-id="reset-button" @click="reset">
          <ResetIcon />
        </button>
        <button class="btn btn-outline btn-sm mr-2" data-test-id="play-button" @click="togglePlay">
          <PlayIcon v-if="!store.playing" />
          <PauseIcon v-else />
        </button>
      </div>
      <div v-for="(value, key) in statusMap" :key="key" class="ml-2">
        <span class="badge">{{ key }}: {{ value }}</span>
      </div>
    </div>
  </div>
</template>
