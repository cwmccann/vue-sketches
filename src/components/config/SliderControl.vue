<script setup lang="ts">

const props = defineProps({
  modelValue: Number,
  label: String,
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (event) => {
  emit('update:modelValue', Number(event.target.value));
};
</script>

<template>
  <div class="form-control w-full max-w-xs">
    <div class="label">
      <span class="label-text">{{ props.label }}</span>
    </div>
    <input
      type="range"
      :min="props.min"
      :max="props.max"
      :value="props.modelValue"
      @input="updateValue"
      class="slider"
    />
  </div>
</template>
