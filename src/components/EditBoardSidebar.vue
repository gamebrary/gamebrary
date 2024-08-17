<!-- TODO: fix old board sticking around, use mutation to set value that toggles sidebar -->
<template lang="html">
  <b-sidebar
    scrollable
    right
    width="380px"
    shadow
    visible
    no-header
    backdrop
    body-class="p-3"
    id="edit-board-sidebar"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'" 
  >
    <template #default="{ hide }">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h3>Edit board</h3>
        
        <b-button @click="hide">
          <i class="fa-solid fa-xmark" />
        </b-button>
      </div>

      <form @submit.stop.prevent="saveBoard">
        <b-sidebar
          scrollable
          right
          width="380px"
          shadow
          no-header
          backdrop
          id="select-board-wallpaper"
          body-class="p-3"
          :bg-variant="darkTheme ? 'dark' : 'light'"
          :text-variant="darkTheme ? 'light' : 'dark'" 
        >
          <template #default="{ hide }">
            <div class="d-flex align-items-center justify-content-between mb-2">
              <h3>Select board background</h3>
              
              <b-button @click="hide">
                <i class="fa-solid fa-xmark" />
              </b-button>
            </div>

            <upload-wallpaper-button />

            <WallpapersList selectable :selected="board.backgroundUrl" @select="selectWallpaper" />
          </template>
        </b-sidebar>
        <!-- <b-sidebar id="boardWallpaper" size="xl" scrollable hide-footer
          :header-bg-variant="darkTheme ? 'dark' : 'transparent'" :header-text-variant="darkTheme ? 'white' : 'dark'"
          :body-bg-variant="darkTheme ? 'dark' : 'transparent'" :body-text-variant="darkTheme ? 'white' : 'dark'"
        >
          <template v-slot:modal-header="{ close }">
            <modal-header title="Choose wallpaper" @close="close">
              <upload-wallpaper-button />
            </modal-header>
          </template>
        </b-sidebar> -->

        <b-form-group label="Board name" label-for="name">
          <b-form-input id="name" v-model="board.name" required />
        </b-form-group>

        <p>Board type:</p>

        <b-button-group class="mb-3">
          <b-button v-for="{ text, value } in $options.BOARD_TYPES" :key="value"
            :variant="value === board.type ? 'primary' : 'light'" @click="board.type = value">
            {{ text }}
          </b-button>
        </b-button-group>

        <b-alert v-if="needsFlattening" variant="warning" show>
          Changing this board to a standard list will merge all lists into one.
        </b-alert>

        <MiniBoard
          class="mb-3"
          :board="previewBoard"
        />

        <b-form-checkbox
          v-if="board.type === $options.BOARD_TYPE_STANDARD"
          v-model="board.ranked"
          class="mb-3"
          switch
        >
          Ranked
        </b-form-checkbox>

        <div class="d-flex justify-content-between mb-3">
          <b-form-checkbox v-model="board.isPublic" switch>
            Public
          </b-form-checkbox>

          <b-link
            v-if="board.isPublic"
            class="float-right"
            target="_blank"
            :href="`https://gamebrary.com/b/${board.id}`"
          >
            Open board
          </b-link>
        </div>

        <div class="d-flex align-items-start">
          <b-form-input
            v-model="board.backgroundColor"
            placeholder="Background color"
            class="mb-3"
            style="width: 44px"
            type="color"
          />

          <b-button v-if="board.backgroundColor" @click="board.backgroundColor = null" variant="white" class="ml-2">
            <i class="fas fa-close" aria-hidden />
          </b-button>

          <span class="mt-2 ml-2">Background color</span>
        </div>

        <div class="d-flex align-items-center mb-3">
          <b-button v-b-toggle.select-board-wallpaper class="mr-2">
            <i class="fa fa-image" aria-hidden="true"></i>
          </b-button>

          <b-button v-if="board.backgroundUrl" variant="white" class="mr-2" @click="board.backgroundUrl = null">
            <i class="fas fa-close" aria-hidden />
          </b-button>

          Background image
        </div>

        <b-button
          variant="primary"
          :disabled="saving"
          type="submit"
        >
          <b-spinner small v-if="saving" />
          <span v-else>{{ $t('global.save') }}</span>
        </b-button>

        <b-button
          variant="outline-danger"
          class="float-right border-0"
          @click="confirmDeleteBoard"
        >
          {{ $t('board.settings.deleteBoard') }}
        </b-button>
      </form>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { BOARD_TYPES, BOARD_TYPE_STANDARD, BOARD_TYPE_KANBAN, LIST_SORT_OPTIONS } from '@/constants';
import WallpapersList from '@/components/WallpapersList';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import MiniBoard from '@/components/Board/MiniBoard';

export default {
  BOARD_TYPES,
  BOARD_TYPE_STANDARD,
  LIST_SORT_OPTIONS,

  components: {
    WallpapersList,
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

    needsFlattening() {
      const listCount = this.board?.lists?.length || 0;

      return listCount > 1 && this.board.type === 'standard';
    },

    mergedGamesList() {
      return [...new Set(this.board?.lists?.map(({ games }) => games)?.flat())];
    },

    previewBoard() {
      return this.needsFlattening
        ? this.standardPreviewBoard
        : this.board;
    },

    standardPreviewBoard() {
      return {
        ...this.board,
        lists: [{ name: '', games: this.mergedGamesList }],
      }
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

    selectWallpaper(wallpaper) {
      this.board.backgroundUrl = wallpaper;
      this.$root.$emit('bv::toggle::collapse', 'select-board-wallpaper');
    },

    async saveBoard() {
      try {
        this.saving = true;

        const lists = this.needsFlattening
          ? [{ name: '', games: this.mergedGamesList }]
          : this.lists;

        const payload = {
          ...this.board,
          lastUpdated: Date.now(),
          lists,
        }

        this.$store.commit('SET_GAME_BOARD', payload);

        await this.$store.dispatch('SAVE_BOARD');
        this.$bus.$emit('LOAD_BOARD_WALLPAPER');

        if (payload.backgroundUrl === null) this.$bus.$emit('CLEAR_WALLPAPER')

        this.$bus.$emit('UPDATE_BACKGROUND_COLOR', this.board?.backgroundColor)
        this.$root.$emit('bv::toggle::collapse', 'edit-board-sidebar');
        this.saving = false;
      } catch (e) {
        //
      }
    },
  },
};
</script>
