<script setup lang="ts">

const props = defineProps({
  modelValue: String,
  label: String,
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', event.target.value);
};
</script>

<template>
  <label class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ label }}</span>
    </div>
    <input
      type="text"
      :value="props.modelValue"
      @input="updateValue"
      class="input input-bordered w-full max-w-xs"
    />
  </label>
</template>
