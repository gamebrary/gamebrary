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

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  components: {},

  data() {
    return {
      list: {
        backgroundColor: '',
        name: '',
        games: [],
      },
      active: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['platform', 'board']),
    ...mapGetters(['darkTheme']),
  },

  mounted() {
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  methods: {
    initTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
          }
        });
      });
    },

    reset() {
      this.list = {
        backgroundColor: '',
        name: '',
        games: [],
      }
    },

    submit(e) {
      e.preventDefault();

      if (this.$refs.addListForm.checkValidity()) {
        this.addTier();
      }
    },

    async addTier() {
      try {
        this.saving = true;

        this.$store.commit('ADD_LIST', this.list);

        await this.$store.dispatch('SAVE_BOARD');
        const modalElement = document.getElementById('addTier');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }
        this.showToast('Tier added', 'success');
      } catch (e) {
        this.showToast('Error adding tier', 'danger');
      }

      this.saving = false;
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
