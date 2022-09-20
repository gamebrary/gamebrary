<template lang="html">
  <section>
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
          <b-modal id="boardWallpaper" size="xl" scrollable hide-footer>
            <template v-slot:modal-header="{ close }">
              <modal-header
                title="Wallpaper"
                @close="close"
              />
            </template>

            <wallpapers-list selectable @select="selectWallpaper" :selected="board.backgroundUrl" />
          </b-modal>

          <form
            ref="boardSettingsForm"
            class="field centered"
            @submit.stop.prevent="saveBoard"
          >
            <b-form-group
              :label="$t('board.settings.nameLabel')"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="board.name"
                required
              />
            </b-form-group>

            <b-form-group
              :label="$t('board.settings.descriptionLabel')"
              label-for="description"
            >
              <b-form-textarea
                id="description"
                v-model="board.description"
                maxlength="280"
                rows="3"
              />
            </b-form-group>

            <b-form-checkbox v-model="board.isPublic" switch class="mb-2">
              Public
            </b-form-checkbox>

            <b-alert show variant="info" v-if="board.isPublic" class="m-0 text-truncate">
              <strong>Public Board URL</strong>
              <br>
              <small>{{ `https://gamebrary.com/b/${board.id}` }}</small>
            </b-alert>

            <hr class="my-3">

            <b-form-group
              label="Board background"
              class="m-0"
            />

            <div class="d-flex align-items-start">
              <v-swatches
                v-model="board.backgroundColor"
                show-fallback
                popover-x="left"
              />

              <b-button
                v-if="board.backgroundColor"
                @click="board.backgroundColor = null"
                variant="light"
                class="ml-2"
              >
                <!-- <i class="fas fa-trash fa-fw" aria-hidden /> -->
                <i class="fas fa-times fa-fw" aria-hidden></i>
              </b-button>
            </div>

            <b-button
              v-b-modal.boardWallpaper
              variant="light"
              class="mb-2"
              block
            >
              Choose background image
            </b-button>

            <b-button
              v-if="board.backgroundUrl"
              variant="link"
              class="mb-2"
              block
              @click="board.backgroundUrl = null"
            >
              <i class="fas fa-trash fa-fw" aria-hidden /> Remove background image
            </b-button>

            <mini-board
              v-if="board.backgroundUrl || board.backgroundColor"
              v-b-modal.boardWallpaper
              :board="board"
            />

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
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import WallpapersList from '@/components/WallpapersList';
import VSwatches from 'vue-swatches'
import MiniBoard from '@/components/Board/MiniBoard';
import orderby from 'lodash.orderby';

export default {
  components: {
    WallpapersList,
    VSwatches,
    MiniBoard,
  },

  data() {
    return {
      board: {},
      loading: false,
      saving: false,
    };
  },

  computed: {
    ...mapState(['user']),

    boardId() {
      return this.$route?.params?.id;
    },
  },

  mounted() {
    this.loadBoard();
  },

  methods: {
    async loadBoard() {
      this.loading = true;

      this.board = await this.$store.dispatch('LOAD_BOARD', this.boardId);


      this.loading = false;
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

    selectWallpaper(wallpaper) {
      this.board.backgroundUrl = wallpaper;
      this.$forceUpdate()
    },

    async saveBoard() {
      this.saving = true;

      // const { board } = this;
      //
      // const payload = {
      //   ...board,
      //   description: this.description,
      //   name: this.name,
      //   isPublic: this.isPublic,
      //   theme: this.theme,
      // };

      // this.$store.commit('SET_ACTIVE_BOARD', this.board);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an saving board settings', { variant: 'danger' });
        });

      this.saving = false;
      this.$router.push({ name: 'board', params: { id: this.board.id } });
    },
  },
};
</script>
