<script setup>
const props = defineProps({
  disabled: {
    type: Boolean
  }
})
</script>
<template>
  <button :disabled="props.disabled"><slot></slot></button>
</template>
<style lang="scss" scoped>
button {
  font-size: inherit;
  padding: 0.5em 1em;
  background: #fff;
  color: black;
  font-family: inherit;
  border-radius: 0.5em;
  border: none;
  transition: 0.1s;
  cursor: pointer;
  &:hover {
    background: #5dff7d;
  }
  &:disabled {
    background: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
  }
}
</style>
