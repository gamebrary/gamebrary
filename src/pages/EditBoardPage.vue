<!-- TODO: Clone board -->
<!-- TODO: like/favorite board -->
<!-- TODO: Fork board -->
<!-- TODO: refactor platforms and wallpapers -->
<!-- TODO: add board preview-->
<!-- TODO: use board placeholder for preview / disable placeholder animation -->
<template lang="html">
  <b-container>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="{ name: 'board', params: { id: board.id } }"
          variant="light"
          class="mr-2"
        >
          <i class="fa-solid fa-chevron-left" />
        </b-button>

        Edit board
      </div>
    </portal>

    <b-row>
      <b-col>
        <form
          ref="boardSettingsForm"
          class="field"
          @submit.stop.prevent="saveBoard"
        >
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

          <b-form-checkbox v-model="isPublic" switch class="mb-2">
            Make board public
          </b-form-checkbox>

          <b-alert show variant="info" v-if="isPublic" class="m-0 text-truncate">
            <strong>Public Board URL</strong>
            <br>
            <small>{{ `https://gamebrary.com/b/${board.id}` }}</small>
          </b-alert>

          <hr class="my-3">

          <edit-board-background-modal />

          <b-button v-b-modal.boardBackground>
            <i class="fas fa-images fa-fw" aria-hidden />
            <br />
            Change background
          </b-button>

          <hr class="my-3">

          <b-button
            variant="primary"
            :disabled="saving"
            type="submit"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>

          <b-button
            variant="link"
            @click="confirmDelete"
          >
            {{ $t('board.settings.deleteBoard') }}
          </b-button>
        </form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import EditBoardBackgroundModal from '@/components/Board/EditBoardBackgroundModal';
// import BoardPlaceholder from '@/components/Board/BoardPlaceholder';
import orderby from 'lodash.orderby';

export default {
  components: {
    // BoardPlaceholder,
    EditBoardBackgroundModal,
  },

  data() {
    return {
      saving: false,
      description: null,
      isPublic: false,
      name: null,
      theme: null,
    };
  },

  computed: {
    ...mapState(['board', 'user']),
  },

  mounted() {
    this.init();
  },

  methods: {
    goToBoard() {
      this.$router.push({ name: 'board', params: { id: this.$route.params.id } });
    },

    async init() {
      // TODO: load board if cached board id does not match route board id
      const { board } = this;
      this.description = board.description;
      this.name = board.name;
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
      this.$bvToast.toast('Board removed');
      this.$router.push({ name: 'home' });
    },

    async saveBoard() {
      this.saving = true;

      const { board } = this;

      const payload = {
        ...board,
        description: this.description,
        name: this.name,
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
      this.$router.push({ name: 'board', params: { id: board.id } });
    },
  },
};
</script>
