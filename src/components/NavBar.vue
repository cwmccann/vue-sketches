<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import MenuIcon from '@/components/icons/MenuIcon.vue';
import { sketches } from '@/router';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const store = useAppStore();
const details = ref<HTMLDetailsElement | null>(null);
const route = useRoute();

const closeDropdown = () => {
  if (!details.value) {
    console.error('details is null');
    return;
  }
  details.value.open = false;
};

const formatRouteName = (name: string | undefined | null) => {
  if (!name) {
    return '';
  }
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const currentRouteName = computed(() => {
  return formatRouteName(route.name);
});
</script>
<template>
  <div class="navbar bg-base-100 pb-0">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl" @click="store.toggleConfig"><MenuIcon /></a>
      <a class="text-xl">P5 Sketches - {{ currentRouteName }}</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <details ref="details">
            <summary>Sketches</summary>
            <ul class="p-2 bg-base-100 rounded-t-none">
              <li v-for="(route, index) in sketches" :key="index">
                <router-link :to="index" @click="closeDropdown">{{ formatRouteName(index) }}</router-link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  </div>
</template>
