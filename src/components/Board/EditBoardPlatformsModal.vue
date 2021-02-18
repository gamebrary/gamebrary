<template lang="html">
  <b-modal
    id="editPlatforms"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    :footer-bg-variant="nightMode ? 'dark' : null"
    :footer-text-variant="nightMode ? 'white' : null"
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
      Please select at least 1 platform
    </b-alert>

    <platform-picker v-model="platforms" />
  </b-modal>
</template>

<script>
import PlatformPicker from '@/components/Board/PlatformPicker';
import { mapState, mapGetters } from 'vuex';

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
    ...mapGetters(['nightMode']),
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
