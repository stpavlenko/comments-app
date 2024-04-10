<script setup>
const props = defineProps({
  show: Boolean,
  message: String
})
</script>
<template>
  <transition>
    <div class="alert" v-if="props.show">
      <p>
        {{ props.message }}
      </p>
    </div>
  </transition>
</template>
<style lang="scss">
.alert {
  position: fixed;
  bottom: 1rem;
  margin-inline: auto;
  left: 0;
  right: 0;
  background: white;
  color: black;
  padding: 1rem 2rem;
  border-radius: 1rem;
  width: fit-content;
  max-width: 30%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
