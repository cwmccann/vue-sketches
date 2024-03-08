<template>
  <div ref="canvasParent" class="h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import p5 from 'p5';

const canvasParent = ref(null);
let p5Sketch: p5 | null = null;

const props = defineProps({
  sketchHeight: {
    type: Number,
    required: true,
  },
  sketchWidth: {
    type: Number,
    required: true,
  },
  sketch: {
    type: Function,
    required: true,
  },
});

onMounted(() => {
  if (!canvasParent.value) {
    return;
  }

  p5Sketch = new p5((p: p5) => {
    p.setup = () => {
      p.createCanvas(props.sketchWidth, props.sketchHeight);
      props.sketch(p);
    };
  }, canvasParent.value);
});

watch(
  () => [props.sketchWidth, props.sketchHeight],
  ([newWidth, newHeight]) => {
    if (p5Sketch) {
      p5Sketch.resizeCanvas(newWidth, newHeight);
    }
  }
);

onBeforeUnmount(() => {
  if (p5Sketch) {
    p5Sketch.remove();
    p5Sketch = null;
  }
});
</script>
