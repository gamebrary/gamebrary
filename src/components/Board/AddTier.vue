<template lang="html">
  <div class="add-tier">
    <b-button
      class="ml-3"
      style="width: 100px;"
      v-b-tooltip.hover
      title="Add tier"
      :variant="darkTheme ? 'dark' : 'light'"
      v-b-modal.addTier
    >
      <i class="fas fa-plus fa-fw" aria-hidden />
    </b-button>

    <b-modal
      id="addTier"
      hide-footer
      :header-bg-variant="darkTheme ? 'dark' : 'white'"
      :header-text-variant="darkTheme ? 'white' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'white'"
      :body-text-variant="darkTheme ? 'white' : 'dark'"
      @show="reset"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Add tier"
          @close="close"
        />
      </template>

      <form
        ref="addListForm"
        class="p-2 d-flex justify-content-between"
        @submit.stop.prevent="submit"
      >
        <v-swatches
          v-model="list.backgroundColor"
          show-fallback
          :trigger-style="{ height: '34px', width: '34px' }"
          popover-x="left"
        />

        <b-form-input
          autofocus
          placeholder="Tier name"
          class="mx-3"
          v-model="list.name"
          required
        />

        <b-button
          split
          variant="primary"
          type="submit"
        >
          <b-spinner v-if="saving" small />
          <span v-else>Add</span>
        </b-button>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import VSwatches from 'vue-swatches'

export default {
  components: {
    VSwatches,
  },

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

  methods: {
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
      this.saving = true;

      this.$store.commit('ADD_LIST', this.list);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('Error adding tier', { variant: 'danger' });
        });

      this.$bvModal.hide('addTier');
      this.saving = false;
    },
  },
};
</script>
