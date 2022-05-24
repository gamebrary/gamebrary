<template lang="html">
  <!-- TODO: finish this -->
  <!-- TODO: move move arrows to next to list preview -->
  <!-- TODO: show list preview in full page view -->
  <!-- TODO: show search inline, allow to go full screen (search page) -->
  <b-container fluid class="p-0">
    <b-row v-if="list" no-gutters>
      <b-col sm="12" md="6">
        <div :style="boardStyles" class="p-3 list-preview d-flex justify-content-center">
          <game-list :list="list" preview />
        </div>
      </b-col>

      <b-col>
        <b-card>
          <header class="p-1 mb-3 pl-2 d-flex justify-content-between align-items-center">
            <h1 class="mb-0">Edit list</h1>

            <b-button variant="success">
              Add games
            </b-button>
          </header>

          <form ref="renameListForm" @submit.stop.prevent="saveChanges">
            <b-form-input
              autofocus
              v-model.trim="list.name"
              :placeholder="$t('board.list.renameListPlaceholder')"
              required
            />

            <b-alert
              v-if="isDuplicate"
              class="mt-3 mb-0"
              show
              variant="warning"
            >
              {{ $t('board.list.duplicateWarning') }}
            </b-alert>

            <b-form-group
              id="list-sorting"
              label="Sort list by:"
              label-for="sortField"
            >
              <!-- description="We'll never share your email with anyone else." -->
              <b-form-select
                id="sortField"
                :options="sortOptions"
                v-model="list.settings.sortOrder"
                required
              />
            </b-form-group>

            <!-- TODO: limit field width -->
            <!-- TODO: move to computed, use help text -->
            <b-alert
              class="mb-0 mt-2 small"
              show
              :variant="list.settings.sortOrder !== 'sortByCustom' ? 'warning' : 'info'"
            >
              <span v-if="list.settings.sortOrder === 'sortByCustom'">
                Games will be added to end of list, drag games to re-order.
              </span>

              <span v-else-if="list.settings.sortOrder">
                Games will be sorted by

                <span class="text-lowercase">
                  {{ $t(`board.list.${list.settings.sortOrder}`)}}
                </span>
              </span>
            </b-alert>

            <!-- TODO: add another view that uses avatar for game cover (tiny) -->
            <b-form-group
              id="list-view"
              label="List view:"
              label-for="viewField"
            >
              <!-- description="We'll never share your email with anyone else." -->
              <b-form-select
                id="viewField"
                :options="viewOptions"
                v-model="list.settings.view"
                required
              />
            </b-form-group>

            <b-form-checkbox
              v-model="list.settings.showReleaseDates"
              name="check-button"
              class="mb-2"
              switch
            >
              {{ $t('board.list.showReleaseDates') }}
            </b-form-checkbox>

            <!-- TODO: add release date styles: countdown/simple date -->

            <b-form-checkbox
              v-model="list.settings.showGameProgress"
              name="check-button"
              class="mb-2"
              switch
            >
              {{ $t('board.list.showGameProgress') }}
            </b-form-checkbox>

            <b-form-checkbox
              v-model="list.settings.highlightCompletedGames"
              name="check-button"
              class="mb-2"
              switch
            >
              Highlight completed games
            </b-form-checkbox>

            <b-form-checkbox
              v-model="list.settings.showGameNotes"
              name="check-button"
              class="mb-2"
              switch
            >
              {{ $t('board.list.showGameNotes') }}
            </b-form-checkbox>

            <b-form-checkbox
              v-model="list.settings.showGameTags"
              name="check-button"
              class="mb-2"
              switch
            >
              {{ $t('board.list.showGameTags') }}
            </b-form-checkbox>

            <b-form-checkbox
              v-model="list.settings.showGameCount"
              name="check-button"
              switch
            >
              {{ $t('board.list.showGameCount') }}
            </b-form-checkbox>

            <b-list-group class="p-2">
              <!-- TODO: Clone list -->
              <!-- TODO: Move within board -->
              <!-- TODO: Move list to different board -->
              <!-- TODO: edit lists order goes in board settings -->
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
            </b-list-group>

            <footer class="mt-2 d-flex justify-content-between align-items-center">
              <b-button
                variant="primary"
                type="submit"
                :disabled="saving || isDuplicate"
              >
                <b-spinner small v-if="saving" />
                <span v-else>{{ $t('global.save') }}</span>
              </b-button>

              <b-button
                variant="link"
                class="text-danger"
                @click="promptDeleteList"
              >
                <i class="fas fa-trash-alt fa-fw" aria-hidden />
                {{ $t('board.list.delete') }}
              </b-button>
            </footer>
          </form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import ListPreferences from '@/components/Lists/ListPreferences';
import GameList from '@/components/Lists/GameList';

import { mapState } from 'vuex';

export default {
  components: {
    GameList,
    // ListPreferences,
  },

  data() {
    return {
      list: null,
      loading: false,
      backgroundUrl: null,
      saving: false,
      sortOptions: [
        { text: this.$t('board.list.sortByCustom'), value: 'sortByCustom' },
        { text: this.$t('board.list.sortByName'), value: 'sortByName' },
        { text: this.$t('board.list.sortByRating'), value: 'sortByRating' },
        { text: this.$t('board.list.sortByProgress'), value: 'sortByProgress' },
        // { text: 'Release date', value: 'sortByReleaseDate' },
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
    ...mapState(['user', 'platform', 'board']),

    isFirst() {
      return this.listIndex === 0;
    },

    isLast() {
      const lastListIndex = this.board.lists.length - 1;

      return this.listIndex === lastListIndex;
    },

    listIndex() {
      return Number(this.$route?.params?.listIndex);
    },

    existingListNames() {
      const originalListName = this.board?.lists[this.listIndex]?.name;

      return this.board?.lists.map(({ name }) => name?.toLowerCase())
        .filter(name => originalListName?.toLowerCase() !== name);
    },

    isDuplicate() {
      return this.list.name.length > 0 && this.existingListNames.includes(this.list.name.toLowerCase());
    },

    boardStyles() {
      const backgroundImage = this.backgroundUrl
        ? `background-image: url('${this.backgroundUrl}');`
        : null;

      const backgroundColor = this.board?.backgroundColor
        ? `background-color: ${this.board.backgroundColor};`
        : null;

      return [backgroundImage, backgroundColor].join('');
    },
  },

  mounted() {
    this.loadBoard();
  },

  methods: {
    async loadBoard() {
      this.loading = true;

      await this.$store.dispatch('LOAD_BOARD', this.$route.params.id)

      // TODO: set default values
      this.list = JSON.parse(JSON.stringify(this.board.lists[this.$route.params.listIndex]));

      const hasGames = this.list?.games?.length > 0;

      if (hasGames) {
        await this.$store.dispatch('LOAD_GAMES', this.list?.games.join());
      }

      const { backgroundUrl } = this.board;

      if (backgroundUrl) {
        this.backgroundUrl = backgroundUrl.includes('igdb')
          ? backgroundUrl
          : await this.$store.dispatch('LOAD_WALLPAPER', backgroundUrl);
      } else {
        this.backgroundUrl = null;
      }
    },

    promptDeleteList() {
      this.$bvModal.msgBoxConfirm(this.$t('board.list.deleteWarning.message'), {
        title: this.$t('board.list.deleteWarning.title'),
        okVariant: 'danger',
        okTitle: this.$t('board.list.deleteWarning.buttonLabel'),
        cancelTitle: this.$t('global.cancel'),
        headerClass: 'pb-0 border-0',
        footerClass: 'pt-0 border-0',
      })
        .then((value) => {
          if (value) {
            this.deleteList();
          }
        });
    },

    async deleteList() {
      const board = { ...this.board };

      board.lists.splice(this.listIndex, 1);

      await this.$store.dispatch('SAVE_GAME_BOARD', board);

      this.$router.push({ name: 'board', params: { id: this.board.id } });
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST', { from, to });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.$bvToast.toast('List saved');
    },

    async saveChanges() {
      const board = { ...this.board };
      board.lists[this.listIndex] = this.list;

      this.saving = true;

      await this.$store.dispatch('SAVE_GAME_BOARD', board);

      this.saving = false;

      this.$router.push({ name: 'board', params: { id: board.id }});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .list-preview {
    background-size: cover;
    height: calc(100vh - 54px);

    @media(max-width: 780px) {
      height: 40vh;
    }
  }
</style>
