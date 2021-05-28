<template lang="html">
  <b-modal
    id="editPlatforms"
    scrollable
    hide-footer
    @show="show"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Board platforms"
        @close="close"
      >
        <b-button
          variant="primary"
          :disabled="saving"
          @click="saveSettings"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

    <b-alert :show="noPlatformsSelected" variant="warning">
      No platforms selected, game search will include all platforms.
    </b-alert>

    <b-alert :show="noPlatformsSelected" variant="success">
      Select platforms to limit search results.
    </b-alert>

    <platform-picker v-model="platforms" />
  </b-modal>
</template>

<script>
import PlatformPicker from '@/components/Board/PlatformPicker';
import { mapState } from 'vuex';

export default {
  components: {
    PlatformPicker,
  },

  data() {
    return {
      saving: false,
      platforms: [],
    };
  },

  computed: {
    ...mapState(['board']),

    noPlatformsSelected() {
      return this.platforms.length === 0;
    },
  },

  methods: {
    show() {
      this.platforms = JSON.parse(JSON.stringify(this.board.platforms));
    },

    async saveSettings() {
      this.saving = true;
      const { board, platforms } = this;

      const payload = {
        ...board,
        platforms,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Platforms saved');
      this.$bvModal.hide('editPlatforms');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
