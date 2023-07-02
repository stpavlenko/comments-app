<script setup>
import { ref, watch } from 'vue'
import Form from './components/CommentForm.vue'
import CommentsList from './components/CommentsList.vue'

const parentId = ref('')
const isFormVisible = ref(false)
const selectedOption = ref('new')

function reply(commentId) {
  parentId.value = commentId
  isFormVisible.value = true
}

function addComment() {
  parentId.value = null
  isFormVisible.value = true
}

watch(isFormVisible, (newValue) => {
  if (newValue) {
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = 'auto'
  }
})
</script>

<template>
  <main>
    <my-button @click="addComment">Add comment</my-button>
    <select v-model="selectedOption">
      <option value="old">From old to new</option>
      <option value="new">From new to old</option>
    </select>
    <Form :parentId="parentId" v-model:show="isFormVisible" />
    <CommentsList @reply="reply" :selectedOption="selectedOption" />
  </main>
</template>

<style scoped lang="scss">
select {
  padding: 0.5em 1em;
  background: white;
  border: 1px solid white;
  color: black;
  font-family: inherit;
  border-radius: 0.5em;
  cursor: pointer;
}
</style>
