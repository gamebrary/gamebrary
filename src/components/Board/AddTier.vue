<template lang="html">
  <div class="mb-3">
    <b-button
      v-b-tooltip.hover.right
      title="Add tier"
      :variant="darkTheme ? 'dark' : 'secondary'"
      v-b-modal.addTier
    >
      <i class="fas fa-plus" aria-hidden />
    </b-button>

    <b-modal
      id="addTier"
      hide-footer
      :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
      :header-text-variant="darkTheme ? 'white' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
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
        class="d-flex justify-content-between"
        @submit.stop.prevent="submit"
      >
        <v-swatches
          v-model="list.backgroundColor"
          show-fallback
          v-bind="swatchesProps"
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
    ...mapGetters(['darkTheme', 'swatchesProps']),
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
      try {
        this.saving = true;

        this.$store.commit('ADD_LIST', this.list);

        await this.$store.dispatch('SAVE_BOARD');
        this.$bvModal.hide('addTier');
        this.$bvToast.toast('Tier added');
      } catch (e) {
        this.$bvToast.toast('Error adding tier', { variant: 'danger' });
      }

      this.saving = false;
    },
  },
};
</script>
