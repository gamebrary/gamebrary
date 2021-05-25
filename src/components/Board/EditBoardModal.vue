<template lang="html">
  <b-modal
    id="edit-board"
    hide-footer
    @show="init"
  >
    <template v-slot:modal-header="{ close }">
      <modal-header
        title="Edit board"
        :subtitle="board.name"
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

      <hr class="my-3">

      <b-button
        v-b-modal.editPlatforms
        variant="secondary"
      >
        <i class="fas fa-gamepad fa-fw" aria-hidden />
        <br />
        Edit platforms
      </b-button>

      <edit-board-platforms-modal />

      <b-button
        v-b-modal.boardBackground
        variant="secondary"
      >
        <i class="fas fa-images fa-fw" aria-hidden />
        <br />
        Change background
      </b-button>

      <edit-board-background-modal />

      <hr class="my-3">

      <b-button
        variant="danger"
        @click="confirmDelete"
      >
        {{ $t('board.settings.deleteBoard') }}
      </b-button>
    </form>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex';
import EditBoardBackgroundModal from '@/components/Board/EditBoardBackgroundModal';
import EditBoardPlatformsModal from '@/components/Board/EditBoardPlatformsModal';

export default {
  components: {
    EditBoardBackgroundModal,
    EditBoardPlatformsModal,
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
      this.$bvModal.hide('edit-board');
      this.$bvToast.toast('Board removed');
      this.$router.push({ name: 'home' });
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

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an saving board settings', { variant: 'danger' });
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
