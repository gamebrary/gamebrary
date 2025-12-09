<template>
  <div class="px-3 text-center d-flex align-items-center justify-content-center flex-column">
    <div>
      <a
        href="https://github.com/romancm/gamebrary/"
        target="_blank"
        class="btn btn-lg"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
        data-bs-toggle="tooltip"
        title="GitHub"
      >
        <i class="fa-brands fa-github" />
      </a>

      <button
        type="button"
        class="btn btn-lg"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
        data-bs-toggle="offcanvas"
        data-bs-target="#keyboard-shortcuts-sidebar"
        title="Keyboard Shortcuts"
      >
        <i class="fa-solid fa-command" />
      </button>

      <router-link
        :to="{ name: 'help' }"
        id="help"
        class="btn btn-lg"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
        data-bs-toggle="tooltip"
        title="Help"
      >
        <i class="fa-regular fa-circle-info" />
      </router-link>

      <button
        type="button"
        class="btn btn-lg"
        :class="darkTheme ? 'btn-dark' : 'btn-light'"
        data-bs-toggle="tooltip"
        title="Toggle theme"
        @click="toggleTheme"
      >
        <i v-if="darkTheme" class="fa-solid fa-sun" />
        <i v-else class="fa-solid fa-moon" />
      </button>
    </div>

    <div>&copy; {{ currentYear }} Gamebrary</div>
  </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

// Store state and getters
const settings = computed(() => store.state.settings);
const darkTheme = computed(() => store.getters.darkTheme);
const showGameThumbnails = computed(() => store.getters.showGameThumbnails);
const transparencyEnabled = computed(() => store.getters.transparencyEnabled);
const ageRating = computed(() => store.getters.ageRating);

// Computed properties
const currentYear = computed(() => {
  return new Date().getFullYear();
});

// Methods
const toggleTheme = async () => {
  try {
    await store.dispatch('SAVE_SETTINGS', {
      ...settings.value,
      darkTheme: !settings.value?.darkTheme,
    });
  } catch (error) {
    // Show error toast using Bootstrap
    const toastElement = document.createElement('div');
    toastElement.className = 'toast align-items-center text-white bg-danger border-0';
    toastElement.setAttribute('role', 'alert');
    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">There was an error saving your settings</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    document.body.appendChild(toastElement);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  }
};

// Lifecycle hooks
onMounted(() => {
  // Initialize tooltips
  nextTick(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  });
});
</script>