<template lang="html">
  <b-dropdown-item-button v-b-modal="modalId">
    <icon name="tools" />
    {{ $t('board.list.settings') }}

    <b-modal
      :id="modalId"
      @show="getSettings"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="$t('board.list.settings')"
        >
          <b-button
            variant="light"
            size="sm"
            @click="close"
          >
            <icon name="x" />
          </b-button>
        </modal-header>
      </template>

      <form ref="renameListForm" @submit.stop.prevent="save">
        <b-form-checkbox
          v-model="showReleaseDates"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showReleaseDates') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="showGameRatings"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showGameRatings') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="showGameProgress"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showGameProgress') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="showGameNotes"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showGameNotes') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="showGameTags"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showGameTags') }}
        </b-form-checkbox>

        <b-form-checkbox
          v-model="showGameCount"
          name="check-button"
          class="mb-2"
          switch
        >
          {{ $t('board.list.showGameCount') }}
        </b-form-checkbox>
      </form>

      <template v-slot:modal-footer="{ cancel }">
        <b-button @click="cancel">
          Cancel
        </b-button>

        <b-button
          variant="primary"
          :disabled="saving"
          @click="save"
        >
          <b-spinner small v-if="saving" />
          <span v-else>Save</span>
        </b-button>
      </template>
    </b-modal>
  </b-dropdown-item-button>
</template>

<script>
export default {
  props: {
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      showReleaseDates: false,
      showGameRatings: false,
      showGameProgress: false,
      showGameNotes: false,
      showGameTags: false,
      showGameCount: false,
      saving: false,
    };
  },

  computed: {
    modalId() {
      return `list-tweaks-${this.listIndex}`;
    },

    isDuplicate() {
      return this.listName && this.existingListNames.includes(this.listName.toLowerCase());
    },
  },

  methods: {
    getSettings() {
      const {
        showReleaseDates,
        showGameRatings,
        showGameProgress,
        showGameNotes,
        showGameTags,
        showGameCount,
      } = this.list.settings;

      this.showReleaseDates = showReleaseDates || false;
      this.showGameRatings = showGameRatings || false;
      this.showGameProgress = showGameProgress || false;
      this.showGameNotes = showGameNotes || false;
      this.showGameTags = showGameTags || false;
      this.showGameCount = showGameCount || false;
    },

    async save() {
      const { listIndex, list: { settings } } = this;
      this.saving = true;

      settings.showReleaseDates = this.showReleaseDates;
      settings.showGameRatings = this.showGameRatings;
      settings.showGameProgress = this.showGameProgress;
      settings.showGameNotes = this.showGameNotes;
      settings.showGameTags = this.showGameTags;
      settings.showGameCount = this.showGameCount;

      this.$store.commit('SET_LIST_SETTINGS', { listIndex, settings });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', {
            title: 'Error',
            variant: 'danger',
          });
        });

      this.saving = false;

      this.$bvToast.toast('Settings saved', {
        title: 'Success',
        variant: 'success',
      });

      await this.$store.dispatch('LOAD_BOARD', this.$route.params.id);

      this.$bvModal.hide(this.modalId);
    },
  },
};
</script>
