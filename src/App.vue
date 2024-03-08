<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, reactive } from 'vue';
import NavBar from '@/components/NavBar.vue';

const header = ref(null);
const footer = ref(null);
const container = ref(null);
const state = reactive({
  sketchHeight: 0,
  sketchWidth: 0,
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  const updateSizes = () => {
    const headerHeight = getVerticalElementSize(header.value);
    const footerHeight = getVerticalElementSize(footer.value);
    const containerStyle = window.getComputedStyle(container.value);
    const containerWidth =
      parseFloat(containerStyle.marginTop) +
      parseFloat(containerStyle.marginBottom) +
      parseFloat(containerStyle.paddingTop) +
      parseFloat(containerStyle.paddingBottom);
    const containerHeight =
      parseFloat(containerStyle.marginLeft) +
      parseFloat(containerStyle.marginRight) +
      parseFloat(containerStyle.paddingLeft) +
      parseFloat(containerStyle.paddingRight);

    state.sketchHeight = window.innerHeight - headerHeight - footerHeight - containerHeight;
    state.sketchWidth = window.innerWidth - containerWidth;
  };

  const getVerticalElementSize = (e: HTMLElement | null) => {
    if (!e) {
      return 0;
    }
    const style = window.getComputedStyle(e);
    const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
    return e.offsetHeight + margin;
  };

  updateSizes();

  resizeObserver = new ResizeObserver(updateSizes);
  resizeObserver.observe(document.body);
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});
</script>

<template>
  <div class="flex flex-col h-screen">
    <header ref="header">
      <NavBar />
    </header>
    <main ref="container" class="flex-1 p-4">
      <router-view :key="$route.fullPath" name="SketchConfig"></router-view>
      <router-view :key="$route.fullPath" v-slot="{ Component }">
        <component
          :is="Component"
          :sketchHeight="state.sketchHeight"
          :sketchWidth="state.sketchWidth"
        />
      </router-view>
    </main>
    <footer ref="footer" class="bg-gray-700">
      <router-view :key="$route.fullPath" name="StatusBar"></router-view>
    </footer>
  </div>
</template>
