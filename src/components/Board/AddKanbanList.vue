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

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: {
    empty: Boolean,
  },

  data() {
    return {
      listName: '',
      active: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['darkTheme']),
  },

  methods: {
    reset() {
      this.listName = '';
      this.active = false;
    },

    showForm() {
      this.active = true;
      this.scrollToEnd();
    },

    async addList() {
      this.saving = true;

      try {
        const list = {
          games: [],
          name: this.listName,
          settings: {},
        };

        this.$store.commit('ADD_LIST', list);
        await this.$store.dispatch('SAVE_BOARD');

        this.reset();
        this.scrollToEnd();
        this.showToast('List added', 'success');
      } catch (error) {
        this.showToast('Error adding list', 'danger');
      } finally {
        this.saving = false;
      }
    },

    scrollToEnd() {
      this.$nextTick(() => {
        const board = document.querySelector('.viewport');
        board.scrollLeft = board.scrollWidth;
      });
    },

    showToast(message, variant = 'info') {
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
    },
  },
};
</script>
