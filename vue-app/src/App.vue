<script setup>
import { ref, watch } from 'vue'
import Form from './components/CommentForm.vue'
import CommentsList from './components/CommentsList.vue'

const parentId = ref('')
const isFormVisible = ref(false)
const selectedOption = ref('new')
const isSubscribed = ref(true)

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
  <div>
    <header class="header">
      <h1>
        <a class="header__link" href="http://vue-app-stpavlenko.std-2121.ist.mospolytech.ru">
          Comments
        </a>
      </h1>
      <div class="header__actions">
        <label class="header__label">
          <span>Live comments</span>
          <span class="switch">
            <input type="checkbox" v-model="isSubscribed" class="visually-hidden" />
            <span class="switch__slider switch__slider--round"></span>
          </span>
        </label>
        <select v-model="selectedOption">
          <option value="old">From old to new</option>
          <option value="new">From new to old</option>
        </select>
        <my-button @click="addComment">Add comment</my-button>
      </div>
    </header>
    <main>
      <Form :parentId="parentId" v-model:show="isFormVisible" />
      <CommentsList @reply="reply" :selectedOption="selectedOption" :isSubscribed="isSubscribed" />
    </main>
  </div>
</template>

<style lang="scss">
html {
  font-size: 11px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-wrap: wrap;
  &__label {
    display: flex;
    align-content: center;
    gap: 0.3em;
  }
  &__link {
    color: white;
    text-decoration: none;
    font-size: 2rem;
    font-weight: 700;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 0.7em;
    flex-wrap: wrap;
  }
}

select {
  padding: 0.5em 1em;
  background: white;
  border: 1px solid white;
  color: black;
  font-family: inherit;
  border-radius: 0.5em;
  font-size: inherit;
  cursor: pointer;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  white-space: nowrap;
  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.switch {
  position: relative;
  display: inline-block;
  width: 3em;
  height: 1.5em;
  &__slider {
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.2s;
    &:before {
      position: absolute;
      content: '';
      height: 1.2em;
      width: 1.2em;
      left: 0.2em;
      bottom: 0.15em;
      background-color: white;
      transition: 0.2s;
    }
    &--round {
      border-radius: 3em;
      &:before {
        border-radius: 50%;
      }
    }
    input:checked + & {
      background-color: #5dff7d;
    }
    input:checked + &:before {
      transform: translateX(1.3rem);
    }
    input:focus-visible + & {
      outline: -webkit-focus-ring-color auto 1px;
    }
  }
}
@media (min-width: 480px) {
  html {
    font-size: 12px;
  }
}
@media (min-width: 640px) {
  html {
    font-size: 14px;
  }
}
</style>
