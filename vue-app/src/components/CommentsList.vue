<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CommentItem from './CommentItem.vue'

const comments = ref([])
const url = 'http://194.67.93.117:80'
const eventSource = ref(null)

const sortedCommentsTree = computed(() =>
  sortTree(arrayToTree(comments.value), props.selectedOption)
)

const emit = defineEmits(['reply'])

const props = defineProps({
  selectedOption: {
    type: String,
    required: true
  },
  isSubscribed: {
    type: Boolean,
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

function handleMessage(event) {
  const comment = JSON.parse(event.data)
  if (!comment.parentId) {
    comment.parentId = null
  }
  comments.value.push(comment)
}

function subscribeComments() {
  eventSource.value = new EventSource(`${url}/comments/stream`)
  eventSource.value.addEventListener('message', handleMessage)
}

function unsubscribeComments() {
  eventSource.value.close()
  eventSource.value.removeEventListener('message', handleMessage)
}

async function getComments() {
  try {
    let response = await fetch(`${url}/comments`)
    comments.value = await response.json()
    if (props.isSubscribed) {
      subscribeComments()
    }
  } catch (err) {
    console.log('Error')
  }
}

watch(
  () => props.isSubscribed,
  (newVal) => {
    if (newVal) {
      subscribeComments()
    } else {
      unsubscribeComments()
    }
  }
)

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
        :depth="1"
        @reply="reply"
      />
    </ul>
  </div>
</template>

<style>
ul {
  padding-left: 0;
  padding-inline-start: 0;
}
</style>
