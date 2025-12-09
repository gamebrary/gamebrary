<template lang="html">
  <div class="flex-shrink-0 pe-2">
    <div
      v-if="active || empty"
      class="card me-3"
      :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'"
    >
      <form
        ref="addListForm"
        class="p-2"
        @submit.prevent="addList"
      >
        <div class="input-group">
          <input
            id="listName"
            type="text"
            v-model="listName"
            autofocus
            class="form-control"
            placeholder="List name"
            required
          />

          <button
            type="submit"
            class="btn btn-dark"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <span v-else>Add</span>
          </button>
        </div>
      </form>
    </div>

    <button
      v-else
      type="button"
      class="btn me-2"
      :class="darkTheme ? 'btn-dark' : 'btn-light'"
      @click.stop="showForm"
    >
      <i class="fas fa-plus" aria-hidden />
    </button>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  empty: Boolean,
});

const store = useStore();

// Reactive state
const listName = ref('');
const active = ref(false);
const saving = ref(false);
const addListForm = ref(null);

// Store state and getters
const board = computed(() => store.state.board);
const darkTheme = computed(() => store.getters.darkTheme);

// Methods
const reset = () => {
  listName.value = '';
  active.value = false;
};

const showForm = () => {
  active.value = true;
  scrollToEnd();
};

const addList = async () => {
  saving.value = true;

  try {
    const list = {
      games: [],
      name: listName.value,
      settings: {},
    };

    store.commit('ADD_LIST', list);
    await store.dispatch('SAVE_BOARD');

    reset();
    scrollToEnd();
    showToast('List added', 'success');
  } catch (error) {
    showToast('Error adding list', 'danger');
  } finally {
    saving.value = false;
  }
};

const scrollToEnd = () => {
  nextTick(() => {
    const boardEl = document.querySelector('.viewport');
    if (boardEl) {
      boardEl.scrollLeft = boardEl.scrollWidth;
    }
  });
};

const showToast = (message, variant = 'info') => {
  const toastElement = document.createElement('div');
  toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
  toastElement.setAttribute('role', 'alert');
  toastElement.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  document.body.appendChild(toastElement);
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
  toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
};
</script>
