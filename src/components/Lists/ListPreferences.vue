<template lang="html">
  <form ref="renameListForm" @submit.stop.prevent="save">
    <b-list-group-item>
      <b-form-checkbox
        v-model="showReleaseDates"
        name="check-button"
        class="mb-2"
        switch
      >
        {{ $t('board.list.showReleaseDates') }}
      </b-form-checkbox>
    </b-list-group-item>

    <b-list-group-item>
      <b-form-checkbox
        v-model="showGameProgress"
        name="check-button"
        class="mb-2"
        switch
      >
        {{ $t('board.list.showGameProgress') }}
      </b-form-checkbox>
    </b-list-group-item>

    <b-list-group-item>
      <b-form-checkbox
        v-model="highlightCompletedGames"
        name="check-button"
        class="mb-2"
        switch
      >
        Highlight completed games
      </b-form-checkbox>
    </b-list-group-item>

    <b-list-group-item>
      <b-form-checkbox
        v-model="showGameNotes"
        name="check-button"
        class="mb-2"
        switch
      >
        {{ $t('board.list.showGameNotes') }}
      </b-form-checkbox>
    </b-list-group-item>

    <b-list-group-item>
      <b-form-checkbox
        v-model="showGameTags"
        name="check-button"
        class="mb-2"
        switch
      >
        {{ $t('board.list.showGameTags') }}
      </b-form-checkbox>
    </b-list-group-item>

    <b-list-group-item>
      <b-form-checkbox
        v-model="showGameCount"
        name="check-button"
        switch
      >
        {{ $t('board.list.showGameCount') }}
      </b-form-checkbox>
    </b-list-group-item>
  </form>
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
      showGameProgress: false,
      highlightCompletedGames: false,
      showGameNotes: false,
      showGameTags: false,
      showGameCount: false,
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

  mounted() {
    this.getSettings();
  },

  methods: {
    getSettings() {
      const {
        showReleaseDates,
        showGameProgress,
        showGameNotes,
        highlightCompletedGames,
        showGameTags,
        showGameCount,
      } = this.list.settings;

      this.highlightCompletedGames = highlightCompletedGames || false;
      this.showReleaseDates = showReleaseDates || false;
      this.showGameProgress = showGameProgress || false;
      this.showGameNotes = showGameNotes || false;
      this.showGameTags = showGameTags || false;
      this.showGameCount = showGameCount || false;
    },

    async save() {
      const { listIndex, list: { settings } } = this;
      this.saving = true;

      settings.showReleaseDates = this.showReleaseDates;
      settings.showGameProgress = this.showGameProgress;
      settings.highlightCompletedGames = this.highlightCompletedGames;
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
