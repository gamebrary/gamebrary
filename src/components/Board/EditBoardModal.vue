<template lang="html">
  <b-modal
    id="edit-board"
    :header-bg-variant="nightMode ? 'dark' : null"
    :header-text-variant="nightMode ? 'white' : null"
    :body-bg-variant="nightMode ? 'dark' : null"
    :body-text-variant="nightMode ? 'white' : null"
    hide-footer
    @show="init"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit board"
        @close="close"
      >
        <b-button
          variant="primary"
          :disabled="saving || noPlatformsSelected"
          @click="saveSettings"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>
      </modal-header>
    </template>

    <form ref="boardSettingsForm" @submit.stop.prevent="submit">
      <b-form-group
        :label="$t('board.settings.nameLabel')"
        label-for="name"
      >
        <b-form-input
          id="name"
          v-model="name"
          required
        />
      </b-form-group>

      <b-form-group
        :label="$t('board.settings.descriptionLabel')"
        label-for="description"
      >
        <b-form-textarea
          id="description"
          v-model="description"
          maxlength="280"
          rows="3"
        />
      </b-form-group>

      <b-form-checkbox v-model="pinned" switch>
        Pinned to dock
      </b-form-checkbox>

      <b-form-checkbox v-model="isPublic" switch class="mb-2">
        Make board public (beta)
      </b-form-checkbox>

      <b-alert show variant="info" v-if="isPublic" class="m-0">
        <strong>Public Board URL</strong>
        <br>
        <small>{{ `https://app.gamebrary.com/#/b/${board.id}` }}</small>
      </b-alert>

      <!-- TODO: move to a separate file -->
      <b-modal
        id="editPlatforms"
        :header-bg-variant="nightMode ? 'dark' : null"
        :header-text-variant="nightMode ? 'white' : null"
        :body-bg-variant="nightMode ? 'dark' : null"
        :body-text-variant="nightMode ? 'white' : null"
        :footer-bg-variant="nightMode ? 'dark' : null"
        :footer-text-variant="nightMode ? 'white' : null"
        hide-footer
      >
        <template v-slot:modal-header="{ close }">
          <modal-header
            title="Board platforms"
            @close="close"
          />
        </template>

        <b-alert :show="noPlatformsSelected" variant="warning">
          Please select at least 1 platform
        </b-alert>

        <platform-picker v-model="board.platforms" />
      </b-modal>

      <hr>

      <b-button
        v-b-modal.editPlatforms
        :variant="noPlatformsSelected ? 'warning' : 'info'"
      >
        <i class="fas fa-gamepad fa-fw" aria-hidden />
        <br />
        Edit platforms
      </b-button>

      <b-button v-b-modal.boardBackground>
        <i class="fas fa-images fa-fw" aria-hidden />
        <br />
        Change background
      </b-button>

      <board-background-modal />

      <hr class="my-3">

      <b-button
        variant="link"
        class="text-danger px-0"
        @click="confirmDelete"
      >
        {{ $t('board.settings.deleteBoard') }}
      </b-button>
    </form>
  </b-modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import BoardBackgroundModal from '@/components/Board/BoardBackgroundModal';
import PlatformPicker from '@/components/Board/PlatformPicker';

export default {
  components: {
    PlatformPicker,
    BoardBackgroundModal,
  },

  data() {
    return {
      saving: false,
      description: null,
      pinned: false,
      isPublic: false,
      name: null,
      platforms: null,
      theme: null,
    };
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['nightMode']),

    noPlatformsSelected() {
      return this.board.platforms.length === 0;
    },
  },

  methods: {
    submit(e) {
      e.preventDefault();

      if (this.$refs.boardSettingsForm.checkValidity()) {
        this.saveSettings();
      }
    },

    async init() {
      const { board } = this;
      this.description = board.description;
      this.name = board.name;
      this.platforms = board.platforms;
      this.pinned = board.pinned || false;
      this.isPublic = board.isPublic || false;
      this.theme = board.theme || 'default';
    },

    confirmDelete() {
      this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        headerBgVariant: this.nightMode ? 'dark' : null,
        headerTextVariant: this.nightMode ? 'white' : null,
        bodyBgVariant: this.nightMode ? 'dark' : null,
        bodyTextVariant: this.nightMode ? 'white' : null,
        footerBgVariant: this.nightMode ? 'dark' : null,
        footerTextVariant: this.nightMode ? 'white' : null,
        okTitle: 'Yes, delete board',
      })
        .then((value) => {
          if (value) {
            this.deleteBoard();
          }
        });
    },

    async deleteBoard() {
      this.loading = true;

      await this.$store.dispatch('DELETE_BOARD', this.board.id)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('There was an error deleting board', { variant: 'error' });
        });

      this.loading = false;
      this.$bvToast.toast('Board removed');
      this.$router.push({ name: 'dashboard' });
    },

    async saveSettings() {
      this.saving = true;

      const { board } = this;

      const payload = {
        ...board,
        description: this.description,
        name: this.name,
        platforms: this.platforms,
        pinned: this.pinned,
        isPublic: this.isPublic,
        theme: this.theme,
      };

      this.$store.commit('SET_ACTIVE_BOARD', payload);
      this.$store.commit('UPDATE_BOARDS', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('Board settings saved');
      this.$bvModal.hide('edit-board');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss">
.dropdown-menu {
  max-height: 400px;
  max-width: 360px;
  overflow: auto;
}

.color-picker {
  width: 38px;
}
</style>
