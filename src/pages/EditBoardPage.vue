<template lang="html">
  <form
    @submit.stop.prevent="saveBoard(true)"
    class="pb-3 d-flex flex-column h-100"
  >
    <PageTitle title="Edit board" />
    
    <b-modal id="boardWallpaper" size="xl" scrollable hide-footer
      :header-bg-variant="darkTheme ? 'dark' : 'transparent'" :header-text-variant="darkTheme ? 'white' : 'dark'"
      :body-bg-variant="darkTheme ? 'dark' : 'transparent'" :body-text-variant="darkTheme ? 'white' : 'dark'">
      <template v-slot:modal-header="{ close }">
        <modal-header title="Choose wallpaper" @close="close">
          <upload-wallpaper-button />
        </modal-header>
      </template>

      <wallpapers-list selectable :selected="board.backgroundUrl" @select="selectWallpaper" />
    </b-modal>

    <b-form-group label="Board name" label-for="name">
      <b-form-input id="name" v-model="board.name" required />
    </b-form-group>

    <p>Board type:</p>

    <b-button-group class="mb-2">
      <b-button v-for="{ text, value } in $options.BOARD_TYPES" :key="value"
        :variant="value === board.type ? 'primary' : 'light'" @click="board.type = value">
        {{ text }}
      </b-button>
    </b-button-group>

    <MiniBoard
      class="mb-2"
      :board="board"
      />

    <b-form-checkbox
      v-if="board.type === $options.BOARD_TYPE_STANDARD"
      v-model="board.ranked"
      class="mb-2"
      switch
    >
      Ranked
    </b-form-checkbox>

    <div class="d-flex">
      <b-form-checkbox v-model="board.isPublic" switch class="mb-2">
        Public
      </b-form-checkbox>

      <b-link v-if="board.isPublic" class="ml-2" target="_blank" :href="`https://gamebrary.com/b/${board.id}`">
        Open board
      </b-link>
    </div>

    <div class="d-flex align-items-start">
      <v-swatches
        v-model="board.backgroundColor"
        show-fallback
        :trigger-style="{ height: '40px', width: '44px' }"
        popover-x="left"
      />

      <b-button v-if="board.backgroundColor" @click="board.backgroundColor = null" variant="white" class="ml-2">
        <i class="fas fa-close" aria-hidden />
      </b-button>

      <span class="mt-2 ml-2">Background color</span>
    </div>

    <div class="d-flex align-items-center mb-2">
      <b-button v-b-modal.boardWallpaper class="mr-2">
        <i class="fa fa-image" aria-hidden="true"></i>
      </b-button>

      <b-button v-if="board.backgroundUrl" variant="white" class="mr-2" @click="board.backgroundUrl = null">
        <i class="fas fa-close" aria-hidden />
      </b-button>

      Background image
    </div>

    <div v-if="board.type !== $options.BOARD_TYPE_STANDARD">
      <hr />

      <template v-if="board.type === 'tier'">
        <h4>Tiers</h4>

        <div v-for="(list, index) in lists" :key="index" class="d-flex justify-content-between align-items-start">
          <v-swatches
            v-model="list.backgroundColor"
            show-fallback
            popover-x="left"
            :trigger-style="{ height: '40px', width: '44px' }"
          />

          <b-form-input id="name" class="ml-2" v-model.trim="list.name" />

          <b-button variant="danger" class="ml-2" @click="confirmDeleteList(index)">
            <i class="fa fa-trash" aria-hidden="true" />
          </b-button>
        </div>
      </template>

      <!-- <template v-else>
          <div class="mt-2 d-flex justify-content-between align-items-center">
            Lists

            <b-button
              v-if="lists.length > 1"
              v-b-modal.editListsOrder
            >
              Edit list order
            </b-button>
          </div>

          <div
            v-for="(list, index) in lists"
            class="mb-2 list"
            :key="index"
          >
            <b-input-group class="mt-3">
              <b-form-input
                id="name"
                v-model.trim="list.name"
              />

              <b-input-group-append>
                <b-dropdown
                  id="list-settings"
                  no-caret
                  :variant="list.sortOrder ? 'primary' : 'light'"
                >
                  <template #button-content>
                    <i class="fa-solid fa-sort fa-fw" />
                  </template>

                  <b-dropdown-group id="dropdown-group-1" header="Sort">
                    <b-dropdown-item-button
                      v-for="option in $options.LIST_SORT_OPTIONS"
                      :key="option.value"
                      :variant="option.value == list.sortOrder ? 'primary' : 'success'"
                      @click="setListSorting(index, option.value)"
                    >
                      <div>{{ option.text }}</div>
                      <small class="text-secondary" v-if="!option.value" show>
                        <i class="far fa-hand-paper" aria-hidden="true"></i>
                        Drag and drop
                      </small>
                    </b-dropdown-item-button>
                  </b-dropdown-group>
                </b-dropdown>

                <b-dropdown
                  id="list-settings"
                  no-caret
                  :variant="darkTheme ? 'secondary' : 'light'"
                >
                  <template #button-content>
                    <i class="fa-solid fa-ellipsis-vertical fa-fw" />
                  </template>

                  <b-dropdown-group id="dropdown-group-2" header="List view">
                    <b-dropdown-item-button
                      v-for="option in $options.LIST_VIEW_OPTIONS"
                      :key="option.value"
                      :bg-variant="option.value === list.view ? 'success' : ''"
                      @click="setListView(index, option.value)"
                    >
                      {{ option.text }}
                    </b-dropdown-item-button>
                  </b-dropdown-group>

                  <b-dropdown-divider />

                  <div class="p-2">
                    <b-form-checkbox
                      v-model="list.showReleaseDates"
                      class="mb-2"
                      switch
                    >
                      {{ $t('board.list.showReleaseDates') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="list.showGameProgress"
                      class="mb-2"
                      switch
                    >
                      {{ $t('board.list.showGameProgress') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="list.highlightCompletedGames"
                      class="mb-2"
                      switch
                    >
                      Highlight completed games
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="list.showGameNotes"
                      class="mb-2"
                      switch
                    >
                      {{ $t('board.list.showGameNotes') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="list.showGameTags"
                      class="mb-2"
                      switch
                    >
                      {{ $t('board.list.showGameTags') }}
                    </b-form-checkbox>

                    <b-form-checkbox
                      v-model="list.showGameCount"
                      name="check-button"
                      switch
                    >
                      {{ $t('board.list.showGameCount') }}
                    </b-form-checkbox>
                  </div>

                  <b-dropdown-divider />

                  <b-dropdown-item-button @click="confirmDeleteList(index)">
                    Delete list
                  </b-dropdown-item-button>
                </b-dropdown>
              </b-input-group-append>
            </b-input-group>
          </div>
        </template> -->

      <b-modal id="editListsOrder" title="BootstrapVue" hide-footer
        :header-bg-variant="darkTheme ? 'dark' : 'transparent'"
        :header-text-variant="darkTheme ? 'light' : 'dark'" :body-bg-variant="darkTheme ? 'dark' : 'transparent'"
        :body-text-variant="darkTheme ? 'light' : 'dark'">
        <template v-slot:modal-header="{ close }">
          <modal-header title="Change list order" subtitle="" @close="close" />
        </template>

        <b-list-group>
          <draggable :list="lists" animation="500">
            <b-list-group-item v-for="(list, index) in lists" :key="index">
              <i class="fa-solid fa-grip-vertical fa-fw" />
              {{ list.name }}
            </b-list-group-item>
          </draggable>
        </b-list-group>
      </b-modal>
    </div>

    <div class="mt-3">
        <b-button variant="primary" :disabled="saving" type="submit">
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>

        <b-button variant="outline-danger" class="mx-2" @click="confirmDeleteBoard">
          {{ $t('board.settings.deleteBoard') }}
        </b-button>
      </div>
  </form>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BOARD_TYPES, BOARD_TYPE_STANDARD, BOARD_TYPE_KANBAN, LIST_SORT_OPTIONS, LIST_VIEW_OPTIONS } from '@/constants';
import WallpapersList from '@/components/WallpapersList';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import VSwatches from 'vue-swatches'
import MiniBoard from '@/components/Board/MiniBoard';
import draggable from 'vuedraggable';

export default {
  BOARD_TYPES,
  BOARD_TYPE_STANDARD,
  LIST_SORT_OPTIONS,
  LIST_VIEW_OPTIONS,

  components: {
    draggable,
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
      lists: [],
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme']),

    boardId() {
      return this.$route?.params?.id;
    },
  },

  mounted() {
    this.loadBoard();
    this.$store.dispatch('LOAD_WALLPAPERS');
  },

  methods: {
    async loadBoard() {
      this.loading = true;

      const board = await this.$store.dispatch('LOAD_BOARD', this.boardId);

      this.board = {
        type: BOARD_TYPE_KANBAN,
        ...board,
      };

      this.lists = JSON.parse(JSON.stringify(this.board.lists));

      this.loading = false;
    },

    setListSorting(index, value) {
      this.lists[index].sortOrder = value;
      this.$forceUpdate();
    },

    setListView(index, value) {
      this.lists[index].view = value;
      this.$forceUpdate();
    },

    async confirmDeleteBoard() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to delete this board?', {
        title: 'Delete board',
        okVariant: 'danger',
        hideHeader: true,
        size: 'sm',
        cancelTitle: 'No',
        okTitle: 'Yes, delete board',
      })

      if (confirmed) this.deleteBoard();
    },

    async confirmDeleteList(index) {
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to delete this list?', {
        title: 'Delete list',
        okVariant: 'danger',
        hideHeader: true,
        size: 'sm',
        cancelTitle: 'No',
        okTitle: 'Yes, delete list',
      });

      if (confirmed) this.deleteList(index);
    },

    deleteList(index) {
      this.lists.splice(index, 1);
      this.saveBoard();
    },

    async deleteBoard() {
      try {
        this.loading = true;
        console.log(this.board.id);
        await this.$store.dispatch('DELETE_BOARD', this.board.id);

        console.log('delete');

        this.$router.replace({ name: 'home' });
      } catch (e) {
        //
      }

      this.loading = false;
    },

    // TODO: fix wallpaper not updating after selecting
    selectWallpaper(wallpaper) {
      this.board.backgroundUrl = wallpaper;
    },

    async saveBoard(close = false) {
      try {
        this.saving = true;

        const { board, lists } = this;

        const payload = {
          ...board,
          lastUpdated: Date.now(),
          lists,
        }

        this.$store.commit('SET_GAME_BOARD', payload);

        await this.$store.dispatch('SAVE_BOARD');

        this.$bvToast.toast('Board saved');

        if (close) this.$router.push({ name: 'board', params: { id: this.board.id } });

        this.saving = false;
      } catch (e) {
        // TODO: show error alert
      }
    },
  },
};
</script>
