<script setup>
import { computed } from 'vue'

const rating = computed(() =>
  props.comment.children.reduce((acc, child) => acc + +child.reaction, 0)
)

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  depth: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['reply'])

function toRightDate(date) {
  return Intl.DateTimeFormat('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(date))
}

function reply(commentId) {
  emit('reply', commentId)
}
</script>

<template>
  <li class="comment">
    <article
      class="comment__content"
      :class="{
        'comment--positive': rating < 0,
        'comment--negative': rating > 0
      }"
    >
      <p class="comment__author">{{ comment.author }}</p>
      <p class="comment__text">{{ comment.text }}</p>
      <div class="comment__row">
        <my-button @click="$emit('reply', comment.id)">Reply</my-button>
        <div>
          <span v-if="comment.children.length > 0" class="comment__replies">
            Replies: {{ comment.children.length }}
          </span>
          <time :datetime="comment.createdAt">{{ toRightDate(comment.createdAt) }}</time>
        </div>
      </div>
    </article>
    <ul v-if="comment.children.length > 0" :class="{ 'comment__list--pl': props.depth <= 7 }">
      <comment-item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :depth="props.depth + 1"
        @reply="reply"
      />
    </ul>
  </li>
</template>

<style scoped lang="scss">
.comment {
  list-style: none;
  &__author {
    font-size: 1.3rem;
    font-weight: 700;
  }
  &__text {
    margin-bottom: 1rem;
    white-space: normal;
    hyphens: auto;
    word-wrap: break-word;
  }
  &__content {
    background: rgb(47, 47, 47);
    margin-top: 1rem;
    padding: 1rem 1.3rem;
    border-radius: 0.5rem;
  }
  &__row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
  }
  &__replies {
    margin-right: 1rem;
  }
  &__list--pl {
    padding-left: 6%;
  }
  &--negative {
    background: crimson;
  }
  &--positive {
    background: green;
  }
}
// .comment__content {
//   background: rgb(47, 47, 47);
//   margin-top: 1rem;
//   padding: 1rem 1.3rem;
//   border-radius: 0.5rem;
// }
</style>
