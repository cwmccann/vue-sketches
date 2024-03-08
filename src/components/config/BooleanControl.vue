<script setup lang="ts">

const props = defineProps({
  modelValue: Boolean,
  label: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.checked);
};
</script>

<template>
  <div class="form-control w-full max-w-xs">
    <div class="label cursor-pointer">
      <span class="label-text">{{ props.label }}</span>
    </div>
          <input type="checkbox" class="toggle" :checked="props.modelValue" @change="updateValue" />

  </div>
</template>
