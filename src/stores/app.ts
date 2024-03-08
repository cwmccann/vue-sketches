import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    configVisible: false,
  }),
  actions: {
    toggleConfig() {
      this.configVisible = !this.configVisible;
    },
    hideConfig() {
      this.configVisible = false;
    },
  },

});
