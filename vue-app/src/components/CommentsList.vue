<script setup>
import { ref, computed, onMounted } from 'vue'
import CommentItem from './CommentItem.vue'

const comments = ref([])
const url = 'http://194.67.93.117:80'

const sortedCommentsTree = computed(() => {
  let a = sortTree(arrayToTree(comments.value), props.selectedOption)
  return a
})

const emit = defineEmits(['reply'])

const props = defineProps({
  selectedOption: {
    type: String,
    required: true
  }
})

function reply(commentId) {
  emit('reply', commentId)
}

function arrayToTree(items, id = null) {
  return items
    .filter((item) => item.parentId === id)
    .map((item) => ({
      ...item,
      children: arrayToTree(items, item.id)
    }))
}

function sortTree(tree, option) {
  return tree
    .sort((item1, item2) =>
      option === 'new'
        ? new Date(item2.createdAt) - new Date(item1.createdAt)
        : new Date(item1.createdAt) - new Date(item2.createdAt)
    )
    .map((item) => ({
      ...item,
      children: sortTree(item.children)
    }))
}

function subscribeComments() {
  const eventSource = new EventSource(`${url}/comments/stream`)
  eventSource.addEventListener('message', (event) => {
    const comment = JSON.parse(event.data)
    if (!comment.parentId) {
      comment.parentId = null
    }
    comments.value.push(comment)
  })
}

async function getComments() {
  try {
    let response = await fetch(`${url}/comments`)
    comments.value = await response.json()
    subscribeComments()
  } catch (err) {
    console.log('Error')
  }
}

onMounted(() => {
  getComments()
})
</script>

<template>
  <div>
    <p>Total comments: {{ sortedCommentsTree.length }}</p>
    <ul>
      <comment-item
        v-for="comment in sortedCommentsTree"
        :key="comment.id"
        :comment="comment"
        @reply="reply"
      />
    </ul>
  </div>
</template>

<style scoped>
ul {
  padding-left: 0;
}
</style>
