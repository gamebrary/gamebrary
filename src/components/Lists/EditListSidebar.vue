<template>
  <b-sidebar
    id="edit-list-modal"
    v-bind="sidebarRightProps"
    :visible="activeBoardListIndex !== null"
    @shown="openEditListSidebar"
    @hidden="closeSidebar"
  >
    <template #default="{ hide }">
      <SidebarHeader @hide="hide" title="Edit list" />

      <form
        class="px-3"
        @submit.prevent="saveList"
      >
        <div
          v-if="board.type === 'tier'"
          class="d-flex justify-content-between align-items-start"
        >
          <v-swatches
            v-model="list.backgroundColor"
            v-b-tooltip.hover
            v-bind="swatchesProps"
            popoverX="right"
            title="Tag text color"
          />

          <b-form-input
            id="name"
            class="ml-3"
            v-model.trim="list.name"
          />
        </div>

        <template v-else>
          <h4>List name</h4>

          <b-form-input
            id="name"
            v-model.trim="list.name"
          />

          <section class="mt-3">
            <h4>Sort by</h4>

            <b-form-select
              v-model="list.sortBy"
              :class="{ 'mb-3': list.sortBy }"
              :options="$options.LIST_SORT_OPTIONS"
            />

            <small class="text-secondary" v-if="!list.sortBy" show>
              <i class="far fa-hand-paper" aria-hidden="true"></i>
              Drag and drop
            </small>
          </section>

          <b-form-checkbox
            v-model="list.vertical"
            size="lg"
            switch
          >
            Vertical layout
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.smallCover"
            size="lg"
            switch
          >
            Small covers
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideCover"
            size="lg"
            switch
          >
            Hide covers
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.showGameCount"
            size="lg"
            switch
          >
            Show game count
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideTitle"
            size="lg"
            switch
          >
            Hide game title
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideTags"
            size="lg"
            switch
          >
            Hide game tags
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideRibbon"
            size="lg"
            switch
          >
            Hide game ribbon
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideNotes"
            size="lg"
            switch
          >
            Hide game notes
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hidePlatforms"
            size="lg"
            switch
          >
            Hide game platforms
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.hideProgress"
            size="lg"
            switch
          >
            Hide progress
          </b-form-checkbox>

          <b-form-checkbox
            v-model="list.ranked"
            size="lg"
            switch
          >
            Ranked
          </b-form-checkbox>
        </template>

        <footer class="py-3 d-flex align-items-center">
          <b-button
            variant="dark"
            :disabled="saving"
            type="submit"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>

          <b-button
            variant=""
            class="ml-auto"
            @click="confirmDeleteList"
          >
            Delete
          </b-button>
        </footer>
      </form>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LIST_SORT_OPTIONS } from '@/constants';
import VSwatches from 'vue-swatches'
import SidebarHeader from '@/components/SidebarHeader';

export default {
  LIST_SORT_OPTIONS,

  components: {
    VSwatches,
    SidebarHeader,
  },

  data() {
    return {
      list: {},
      saving: false,
    }
  },

  computed: {
    ...mapState(['board', 'activeBoardListIndex']),
    ...mapGetters(['darkTheme', 'sidebarRightProps', 'swatchesProps']),
  },

  methods: {
    openEditListSidebar() {
      this.saving = false;
      this.list = {
        name: '',
        games: [],
        sortBy: null,
        vertical: false,
        showGameCount: false,
        smallCover: false,
        hideCover: false,
        hideTitle: false,
        hideTags: false,
        hideRibbon: false,
        hideNotes: false,
        hidePlatforms: false,
        hideProgress: false,
        ranked: false,
        ...this.board?.lists?.[this.activeBoardListIndex],
      };
    },

    closeSidebar() {
      this.$store.commit('CLEAR_ACTIVE_BOARD_LIST_INDEX');
    },

    async confirmDeleteList() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Are you sure you want to delete this list?', {
        title: 'Delete list',
        okVariant: 'danger',
        hideHeader: true,
        size: 'sm',
        cancelTitle: 'No',
        okTitle: 'Yes, delete list',
      });

      if (confirmed) this.deleteList();
    },

    async deleteList() {
      const { board } = this;

      board.lists.splice(this.activeBoardListIndex, 1);

      const payload = {
        ...board,
        lastUpdated: Date.now(),
      }

      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error deleting list', { variant: 'danger' });
        });

      this.saving = false;
      this.$bvToast.toast('List deleted');
      this.closeSidebar();
    },

    async saveList() {
      this.saving = true;

      const { board } = this;

      board.lists[this.activeBoardListIndex] = this.list

      const payload = {
        ...board,
        lastUpdated: Date.now(),
      }

      this.$store.commit('SET_GAME_BOARD', payload);

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.saving = false;

          this.$bvToast.toast('There was an error saving list settings', { variant: 'danger' });
        });

      this.saving = false;
      this.closeSidebar();
    },
  },
}
</script>

<style scoped>

</style>