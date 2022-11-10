<!-- TODO: add background options (position, repeat, etc...) -->
<!-- TODO: move move arrows to next to list preview -->
<!-- TODO: show list preview in full page view -->
<!-- TODO: show search inline, allow to go full screen (search page) -->
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

      <b-modal id="boardWallpaper" size="xl" scrollable hide-footer>
        <template v-slot:modal-header="{ close }">
          <modal-header
            title="Choose wallpaper"
            @close="close"
          >
            <upload-wallpaper-button />
          </modal-header>
        </template>

        <wallpapers-list
          selectable
          :selected="board.backgroundUrl"
          @select="selectWallpaper"
        />
      </b-modal>

      <b-row>
        <b-col>
          <form
            ref="boardSettingsForm"
            class="field centered mb-5"
            @submit.stop.prevent="saveBoard"
          >
            <b-form-group
              label="Board name"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="board.name"
                required
              />
            </b-form-group>

            <b-form-group
              label="Board type"
              label-for="boardType"
            >
              <b-form-select
                id="boardType"
                v-model="board.type"
                :options="$options.BOARD_TYPES"
              />
            </b-form-group>

            <b-form-checkbox
              v-if="board.type === $options.BOARD_TYPE_STANDARD"
              v-model="board.ranked"
              name="check-button"
              class="mb-3"
              switch
            >
              Ranked
            </b-form-checkbox>

            <div class="d-flex">
              <b-form-checkbox v-model="board.isPublic" switch class="mb-2">
                Public
              </b-form-checkbox>

              <b-link
                v-if="board.isPublic"
                class="ml-2"
                target="_blank"
                :href="`https://gamebrary.com/b/${board.id}`"
              >
                Open board
              </b-link>
            </div>

            <hr class="my-3">

            <b-form-group
              label="Board background"
              class="m-0"
            />

            <div class="d-flex">
              <div class="d-flex align-items-start">
                <v-swatches
                  v-model="board.backgroundColor"
                  show-fallback
                  :trigger-style="{ height: '38px' }"
                  popover-x="left"
                />

                <b-button
                  v-if="board.backgroundColor"
                  @click="board.backgroundColor = null"
                  variant="link"
                  class="ml-2"
                >
                  <i class="fas fa-times" aria-hidden />
                </b-button>
              </div>

              <div class="ml-2 d-flex align-items-start">
                <b-button
                  v-b-modal.boardWallpaper
                  variant="light"
                >
                  <i class="fa fa-image" aria-hidden="true"></i>
                </b-button>

                <b-button
                  v-if="board.backgroundUrl"
                  variant="link"
                  @click="board.backgroundUrl = null"
                >
                  <i class="fas fa-times fa-fw" aria-hidden />
                </b-button>
              </div>
            </div>

            <mini-board
              v-if="board.backgroundUrl || board.backgroundColor"
              class="mb-3"
              v-b-modal.boardWallpaper
              :board="board"
            />

            <div class="accordion" role="tablist">
              <b-card
                v-for="(list, index) in board.lists"
                :key="index"
                no-body
                class="mb-1"
              >
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    block
                    v-b-toggle="`list-${index}`"
                  >
                    {{ list.name || '(Unnamed list)' }}
                  </b-button>
                </b-card-header>

                <!-- TODO: UPDATE settings, look at default board constants for reference -->

                <b-collapse :id="`list-${index}`" role="tabpanel">
                  <b-card-body>
                    <b-form-group
                      label="List name"
                      label-for="name"
                    >
                      <b-form-input
                        id="name"
                        autofocus
                        v-model.trim="board.lists[index].name"
                      />
                    </b-form-group>

                    <template v-if="board.type === 'tier'">
                      <v-swatches
                        v-model="board.lists[index].backgroundColor"
                        show-fallback
                        :trigger-style="{ height: '38px' }"
                        popover-x="left"
                      />
                    </template>

                    <template v-if="board.type === 'kanban' || !board.type">
                      <b-form-group
                        id="list-sorting"
                        label="Sort list by:"
                        label-for="sortField"
                      >
                        <b-form-select
                          id="sortField"
                          :options="sortOptions"
                          v-model="board.lists[index].sortOrder"
                          required
                        />
                      </b-form-group>

                      <!-- TODO: Move within board -->
                      <!-- TODO: Move list to different board -->
                      <!-- TODO: edit lists order goes in board settings -->
                      <!-- TODO: restore move list -->
                      <!-- <b-list-group class="p-2">
                        <b-list-group-item>
                          <small class="text-muted d-flex justify-content-center">Move list</small>
                          <b-button-group size="sm" class="w-100">
                            <b-button
                              v-b-tooltip.hover
                              :title="$t('board.list.moveLeft')"
                              :disabled="isFirst"
                              @click="moveList(listIndex, listIndex - 1)"
                            >
                              <i class="fas fa-angle-left fa-fw" aria-hidden />
                            </b-button>

                            <b-button
                              v-b-tooltip.hover
                              :title="$t('board.list.moveRight')"
                              :disabled="isLast"
                              @click="moveList(listIndex, listIndex + 1)"
                            >
                              <i class="fas fa-angle-right fa-fw" aria-hidden />
                            </b-button>
                          </b-button-group>
                        </b-list-group-item>
                      </b-list-group> -->

                      <b-alert
                        class="my-2"
                        show
                        :variant="board.lists[index].sortOrder !== 'sortByCustom' ? 'warning' : 'info'"
                      >
                        <span v-if="board.lists[index].sortOrder === 'sortByCustom'">
                          Games will be added to end of list, drag games to re-order.
                        </span>

                        <span v-else-if="board.lists[index].sortOrder">
                          Games will be sorted by

                          <span class="text-lowercase">
                            {{ $t(`board.list.${board.lists[index].sortOrder}`)}}
                          </span>
                        </span>
                      </b-alert>

                      <b-form-group
                        id="list-view"
                        label="List view:"
                        label-for="viewField"
                      >
                        <b-form-select
                          id="viewField"
                          :options="viewOptions"
                          v-model="board.lists[index].view"
                          required
                        />
                      </b-form-group>

                      <b-form-checkbox
                        v-model="board.lists[index].showReleaseDates"
                        name="check-button"
                        class="mb-2"
                        switch
                      >
                        {{ $t('board.list.showReleaseDates') }}
                      </b-form-checkbox>

                      <b-form-checkbox
                        v-model="board.lists[index].showGameProgress"
                        name="check-button"
                        class="mb-2"
                        switch
                      >
                        {{ $t('board.list.showGameProgress') }}
                      </b-form-checkbox>

                      <b-form-checkbox
                        v-model="board.lists[index].highlightCompletedGames"
                        name="check-button"
                        class="mb-2"
                        switch
                      >
                        Highlight completed games
                      </b-form-checkbox>

                      <b-form-checkbox
                        v-model="board.lists[index].showGameNotes"
                        name="check-button"
                        class="mb-2"
                        switch
                      >
                        {{ $t('board.list.showGameNotes') }}
                      </b-form-checkbox>

                      <b-form-checkbox
                        v-model="board.lists[index].showGameTags"
                        name="check-button"
                        class="mb-2"
                        switch
                      >
                        {{ $t('board.list.showGameTags') }}
                      </b-form-checkbox>

                      <b-form-checkbox
                        v-model="board.lists[index].showGameCount"
                        name="check-button"
                        switch
                      >
                        {{ $t('board.list.showGameCount') }}
                      </b-form-checkbox>
                    </template>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>

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
import { BOARD_TYPES, BOARD_TYPE_STANDARD } from '@/constants';
import WallpapersList from '@/components/WallpapersList';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import VSwatches from 'vue-swatches'
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  BOARD_TYPES,
  BOARD_TYPE_STANDARD,

  components: {
    WallpapersList,
    VSwatches,
    UploadWallpaperButton,
    MiniBoard,
  },

  data() {
    return {
      board: {},
      loading: false,
      saving: false,
      // TODO: put in constants
      sortOptions: [
        { text: 'Custom', value: null },
        { text: 'Alphabetically', value: 'alphabetically' },
        { text: 'Rating', value: 'rating' },
        { text: 'Progress', value: 'progress' },
      ],
      viewOptions: [
        { text: this.$t('board.list.views.single'), value: 'single' },
        { text: this.$t('board.list.views.covers'), value: 'covers' },
        { text: this.$t('board.list.views.grid'), value: 'grid' },
        { text: this.$t('board.list.views.compact'), value: 'compact' },
        { text: this.$t('board.list.views.text'), value: 'text' },
      ],
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
        hideHeader: true,
        size: 'sm',
        cancelTitle: 'No',
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
      this.$router.push({ name: 'boards' });
    },

    selectWallpaper(wallpaper) {
      this.board.backgroundUrl = wallpaper;
      this.saveBoard();
      this.$forceUpdate();
    },

    async saveBoard() {
      this.saving = true;

      this.board.lastUpdated = Date.now();

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
