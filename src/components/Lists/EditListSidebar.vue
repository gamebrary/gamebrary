<template>
  <AppSidebar
    id="edit-list-modal"
    :visible="activeBoardListIndex !== null"
    :placement="sidebarRightProps?.placement || 'end'"
    :bg-variant="sidebarRightProps?.bgVariant"
    :text-variant="sidebarRightProps?.textVariant"
    @update:visible="handleVisibilityChange"
    @shown="openEditListSidebar"
    @hidden="closeSidebar"
  >
    <template #header>
      <SidebarHeader @hide="hideSidebar" title="Edit list" />
    </template>

    <form
      class="px-3"
      @submit.prevent="saveList"
    >
      <div
        v-if="board.type === 'tier'"
        class="d-flex justify-content-between align-items-start"
      >
        <input
          type="color"
          v-model="list.backgroundColor"
          class="form-control form-control-color"
          style="width: 40px; height: 40px; cursor: pointer;"
          title="Background color"
        />

        <input
          id="name"
          type="text"
          class="form-control ms-3"
          v-model.trim="list.name"
        />
      </div>

      <template v-else>
        <h4>List name</h4>

        <input
          id="name"
          type="text"
          class="form-control"
          v-model.trim="list.name"
        />

        <section class="mt-3">
          <h4>Sort by</h4>

          <select
            v-model="list.sortBy"
            class="form-select"
            :class="{ 'mb-3': list.sortBy }"
          >
            <option v-for="option in $options.LIST_SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>

          <small class="text-secondary" v-if="!list.sortBy">
            <i class="far fa-hand-paper" aria-hidden="true"></i>
            Drag and drop
          </small>
        </section>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.vertical"
            id="verticalSwitch"
          />
          <label class="form-check-label" for="verticalSwitch">Vertical layout</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.smallCover"
            id="smallCoverSwitch"
          />
          <label class="form-check-label" for="smallCoverSwitch">Small covers</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideCover"
            id="hideCoverSwitch"
          />
          <label class="form-check-label" for="hideCoverSwitch">Hide covers</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.showGameCount"
            id="showGameCountSwitch"
          />
          <label class="form-check-label" for="showGameCountSwitch">Show game count</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideTitle"
            id="hideTitleSwitch"
          />
          <label class="form-check-label" for="hideTitleSwitch">Hide game title</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideTags"
            id="hideTagsSwitch"
          />
          <label class="form-check-label" for="hideTagsSwitch">Hide game tags</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideRibbon"
            id="hideRibbonSwitch"
          />
          <label class="form-check-label" for="hideRibbonSwitch">Hide game ribbon</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideNotes"
            id="hideNotesSwitch"
          />
          <label class="form-check-label" for="hideNotesSwitch">Hide game notes</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hidePlatforms"
            id="hidePlatformsSwitch"
          />
          <label class="form-check-label" for="hidePlatformsSwitch">Hide game platforms</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.hideProgress"
            id="hideProgressSwitch"
          />
          <label class="form-check-label" for="hideProgressSwitch">Hide progress</label>
        </div>

        <div class="form-check form-switch mb-2">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="list.ranked"
            id="rankedSwitch"
          />
          <label class="form-check-label" for="rankedSwitch">Ranked</label>
        </div>
      </template>

      <footer class="py-3 d-flex align-items-center">
        <button
          type="submit"
          class="btn btn-dark"
          :disabled="saving"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <span v-else>{{ $t('global.save') }}</span>
        </button>

        <button
          type="button"
          class="btn btn-outline-danger ms-auto"
          @click="confirmDeleteList"
        >
          Delete
        </button>
      </footer>
    </form>
  </AppSidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LIST_SORT_OPTIONS } from '@/constants';
import SidebarHeader from '@/components/SidebarHeader';
import AppSidebar from '@/components/Sidebar';

export default {
  LIST_SORT_OPTIONS,

  components: {
    AppSidebar,
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
    ...mapGetters(['darkTheme', 'sidebarRightProps']),
  },

  mounted() {
    // Listen for sidebar toggle events
    if (this.$bus) {
      this.$bus.$on('bv::toggle::collapse', (id) => {
        if (id === 'edit-list-modal') {
          // Toggle handled by visible prop
        }
      });
    }
  },

  beforeUnmount() {
    if (this.$bus) {
      this.$bus.$off('bv::toggle::collapse');
    }
  },

  methods: {
    handleVisibilityChange(visible) {
      if (!visible) {
        this.closeSidebar();
      }
    },

    hideSidebar() {
      this.$store.commit('CLEAR_ACTIVE_BOARD_LIST_INDEX');
    },

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
      const confirmed = window.confirm('Are you sure you want to delete this list?');
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
          this.showToast('There was an error deleting list', 'danger');
        });

      this.saving = false;
      this.showToast('List deleted', 'success');
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
          this.showToast('There was an error saving list settings', 'danger');
        });

      this.saving = false;
      this.closeSidebar();
    },

    showToast(message, variant = 'info') {
      const toastElement = document.createElement('div');
      toastElement.className = `toast align-items-center text-white bg-${variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'info'} border-0`;
      toastElement.setAttribute('role', 'alert');
      toastElement.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      `;
      document.body.appendChild(toastElement);
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
    },
  },
}
</script>

<style scoped>

</style>
