<script setup>
import { computed } from 'vue'

const rating = computed(() =>
  props.comment.children.reduce((acc, child) => acc + +child.reaction, 0)
)

const props = defineProps({
  comment: {
    type: Object,
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
  <li class="item">
    <div
      class="item__content"
      :class="{
        'item--positive': rating < 0,
        'item--negative': rating > 0
      }"
    >
      <p>{{ comment.author }}</p>
      <p>{{ comment.text }}</p>
      <div class="item__row">
        <my-button @click="$emit('reply', comment.id)">Reply</my-button>
        <div>
          <span v-if="comment.children.length > 0" class="item__replies">
            Replies: {{ comment.children.length }}
          </span>
          <span>{{ toRightDate(comment.createdAt) }}</span>
        </div>
      </div>
    </div>
    <ul v-if="comment.children.length > 0" class="item__list">
      <comment-item
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        @reply="reply"
      />
    </ul>
  </li>
</template>

<style scoped lang="scss">
.item {
  list-style: none;
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
  &__list {
    padding-left: 5%;
  }
  &--negative {
    background: crimson;
  }
  &--positive {
    background: green;
  }
}
</style>
