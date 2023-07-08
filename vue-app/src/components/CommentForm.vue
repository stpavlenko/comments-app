<script setup>
import { ref, watch } from 'vue'
import MyAlert from '@/components/MyAlert.vue'

const name = ref('')
const comment = ref('')
const reaction = ref(0)
const isBtnDisabled = ref(false)
const isAlertVisible = ref(false)
const alertMessage = ref('')
const alertDuration = ref(3000)
const isNameEmpty = ref(false)
const isCommentEmpty = ref(false)
const nameInput = ref(null)

const props = defineProps({
  parentId: {
    required: true
  },
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:show'])

function showAlert(message) {
  alertMessage.value = message
  isAlertVisible.value = true
  setTimeout(() => {
    isAlertVisible.value = false
  }, alertDuration.value)
}

function hideDialog() {
  emit('update:show', false)
}

function checkCommentEmpty() {
  isCommentEmpty.value = comment.value.trim() === ''
}

function checkNameEmpty() {
  isNameEmpty.value = name.value.trim() === ''
}

async function send() {
  isBtnDisabled.value = true
  const data = {
    author: name.value,
    text: comment.value,
    reaction: reaction.value,
    parentId: props.parentId
  }
  try {
    const response = await fetch('http://slavaver.space/comments', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Username: 'stpavlenko'
      },
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (response.ok) {
      showAlert('Comment successfully added')
      hideDialog()
      name.value = ''
      comment.value = ''
      reaction.value = 0
      isNameEmpty.value = false
      isCommentEmpty.value = false
    } else {
      showAlert('Something went wrong')
    }
  } catch (e) {
    showAlert('Something went wrong')
    console.error(e)
  } finally {
    isBtnDisabled.value = false
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal && nameInput.value) {
      setTimeout(() => {
        nameInput.value.focus()
      })
    }
  }
)
</script>

<template>
  <div>
    <transition>
      <div class="form" @click="hideDialog" v-show="show">
        <div class="form__content" @click.stop>
          <div class="form__tab">
            <h2 class="form__title">Add comment</h2>
            <my-button @click="hideDialog">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 -960 960 960"
                width="20"
                fill="currentColor"
              >
                <path
                  d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"
                />
              </svg>
            </my-button>
          </div>
          <form>
            <label class="form__label">
              <span class="visually-hidden">Enter your</span>
              <span>Name</span>
              <input
                type="text"
                name="name"
                v-model="name"
                class="form__input"
                required
                @blur="checkNameEmpty"
                ref="nameInput"
              />
            </label>
            <label class="form__label">
              <span class="visually-hidden">Enter your</span>
              <span>Comment</span>
              <textarea
                name="comment"
                class="form__textarea"
                rows="10"
                v-model="comment"
                required
                @blur="checkCommentEmpty"
              ></textarea>
            </label>
            <span class="form__hint" v-if="isNameEmpty">Please fill in the name field</span>
            <span class="form__hint" v-if="isCommentEmpty">Please fill in the comment field</span>
            <div class="form__lower">
              <fieldset>
                <label>
                  <span class="visually-hidden">Choose your reaction</span>
                  <input
                    class="form__radio visually-hidden"
                    id="negative"
                    type="radio"
                    v-model="reaction"
                    value="1"
                    name="reaction"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    class="form__svg"
                    fill="currentColor"
                  >
                    <path
                      d="M242-840h444v512L408-40l-39-31q-6-5-9-14t-3-22v-10l45-211H103q-24 0-42-18t-18-42v-81.839Q43-477 41.5-484.5T43-499l126-290q8.878-21.25 29.595-36.125Q219.311-840 242-840Zm384 60H229L103-481v93h373l-53 249 203-214v-427Zm0 427v-427 427Zm60 25v-60h133v-392H686v-60h193v512H686Z"
                    />
                  </svg>
                </label>
                <label>
                  <input
                    class="form__radio visually-hidden"
                    id="default"
                    type="radio"
                    v-model="reaction"
                    value="0"
                    name="reaction"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    class="form__svg"
                    fill="currentColor"
                  >
                    <path
                      d="M626-533q22.5 0 38.25-15.75T680-587q0-22.5-15.75-38.25T626-641q-22.5 0-38.25 15.75T572-587q0 22.5 15.75 38.25T626-533Zm-292 0q22.5 0 38.25-15.75T388-587q0-22.5-15.75-38.25T334-641q-22.5 0-38.25 15.75T280-587q0 22.5 15.75 38.25T334-533Zm20 194h253v-49H354v49ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 340q142.375 0 241.188-98.812Q820-337.625 820-480t-98.812-241.188Q622.375-820 480-820t-241.188 98.812Q140-622.375 140-480t98.812 241.188Q337.625-140 480-140Z"
                    />
                  </svg>
                </label>
                <label>
                  <input
                    class="form__radio visually-hidden"
                    id="positive"
                    type="radio"
                    v-model="reaction"
                    value="-1"
                    name="reaction"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    class="form__svg"
                    fill="currentColor"
                  >
                    <path
                      d="m480-121-41-37q-105.768-97.121-174.884-167.561Q195-396 154-451.5T96.5-552Q80-597 80-643q0-90.155 60.5-150.577Q201-854 290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.423Q880-733.155 880-643q0 46-16.5 91T806-451.5Q765-396 695.884-325.561 626.768-255.121 521-158l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712-426 750.5-476t54-89.135q15.5-39.136 15.5-77.72Q820-709 778-751.5T670.225-794q-51.524 0-95.375 31.5Q531-731 504-674h-49q-26-56-69.85-88-43.851-32-95.375-32Q224-794 182-751.5t-42 108.816Q140-604 155.5-564.5t54 90Q248-424 314-358t166 158Zm0-297Z"
                    />
                  </svg>
                </label>
              </fieldset>
              <my-button
                @click.prevent="send"
                type="submit"
                :disabled="isBtnDisabled || !comment || !name || isCommentEmpty || isNameEmpty"
              >
                Send
              </my-button>
            </div>
          </form>
        </div>
      </div>
    </transition>
    <my-alert :show="isAlertVisible" :message="alertMessage" />
  </div>
</template>

<style scoped lang="scss">
.form {
  position: fixed;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
  background: rgba($color: #000, $alpha: 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  &__title {
    font-size: 1.8rem;
    font-weight: 700;
  }
  &__content {
    background: rgb(47, 47, 47);
    padding: 1rem 2rem;
    border-radius: 1rem;
    min-width: 60%;
  }
  &__textarea {
    width: 100%;
    resize: none;
    border-radius: 0.3em;
    border-style: none;
  }
  &__input {
    display: block;
    border-radius: 0.3em;
    border-style: none;
  }
  &__tab,
  &__lower {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__hint {
    color: crimson;
    display: block;
  }
  fieldset {
    border: none;
  }
  &__radio {
    &:checked + svg {
      color: #5dff7d;
    }
    &:focus-visible + svg {
      outline: 1px solid white;
    }
  }
  &__svg {
    width: 4rem;
    height: 4rem;
    cursor: pointer;
    transition: color 0.1s;
    &:hover {
      color: #5dff7d;
    }
  }
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
