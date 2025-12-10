<template lang="html">
  <div class="mx-3 mb-3">
    <button
      type="button"
      class="btn"
      :class="darkTheme ? 'btn-dark' : 'btn-secondary'"
      data-bs-toggle="modal"
      data-bs-target="#addTier"
      :title="'Add tier'"
      data-bs-placement="right"
    >
      <i class="fas fa-plus" aria-hidden />
    </button>

    <div
      class="modal fade"
      id="addTier"
      tabindex="-1"
      aria-labelledby="addTierLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content" :class="darkTheme ? 'bg-dark text-light' : 'bg-light text-dark'">
          <div class="modal-header">
            <h5 class="modal-title" id="addTierLabel">Add tier</h5>
            <button type="button" class="btn-close" :class="darkTheme ? 'btn-close-white' : ''" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form
              ref="addListForm"
              class="d-flex justify-content-between"
              @submit.stop.prevent="submit"
            >
              <input
                type="color"
                v-model="list.backgroundColor"
                class="form-control form-control-color"
                style="width: 40px; height: 40px; cursor: pointer;"
                title="Background color"
              />

              <input
                type="text"
                autofocus
                placeholder="Tier name"
                class="form-control mx-3"
                v-model="list.name"
                required
              />

              <button
                type="submit"
                class="btn btn-primary"
                :disabled="saving"
              >
                <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-else>Add</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, nextTick } from 'vue';
import { useBoardsStore } from '@/stores/boards';
import { useAppGetters } from '@/stores/getters';

const boardsStore = useBoardsStore();
const { darkTheme } = useAppGetters();

// Template refs
const addListForm = ref(null);

// Reactive state
const list = ref({
  backgroundColor: '',
  name: '',
  games: [],
});
const active = ref(false);
const saving = ref(false);

// Store state and getters
const board = computed(() => boardsStore.board);

// Methods
const initTooltips = () => {
  nextTick(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      if (!tooltipTriggerEl._tooltip) {
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
    });
  });
};

const reset = () => {
  list.value = {
    backgroundColor: '',
    name: '',
    games: [],
  };
};

const submit = (e) => {
  e.preventDefault();

  if (addListForm.value?.checkValidity()) {
    addTier();
  }
};

const addTier = async () => {
  try {
    saving.value = true;

    boardsStore.addList(list.value);

    await boardsStore.saveBoard();
    const modalElement = document.getElementById('addTier');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();
    }
    showToast('Tier added', 'success');
    reset();
  } catch (e) {
    showToast('Error adding tier', 'danger');
  } finally {
    saving.value = false;
  }
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

// Lifecycle hooks
onMounted(() => {
  initTooltips();
});

onUpdated(() => {
  initTooltips();
});
</script>
