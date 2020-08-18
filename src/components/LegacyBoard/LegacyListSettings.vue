<template lang="html">
  <div>
    <b-dropdown
      no-caret
      variant="light"
    >
      <template v-slot:button-content>
        <b-icon icon="three-dots" aria-hidden="true" />
      </template>

      <sort-list :list-index="listIndex" />
      <rename-list :list-index="listIndex" />
      <change-list-view :list-index="listIndex" />
      <list-tweaks :list-index="listIndex" />

      <b-dropdown-divider />

      <b-dropdown-item>
        <b-button-group size="sm">
          <b-button
            :title="$t('list.moveLeft')"
            :disabled="isFirst"
            @click="moveList(listIndex, listIndex - 1)"
          >
            <b-icon-arrow-left-short />

            {{ $t('list.moveLeft') }}
          </b-button>

          <b-button
            :title="$t('list.moveRight')"
            :disabled="isLast"
            @click="moveList(listIndex, listIndex + 1)"
          >
            {{ $t('list.moveRight') }}
            <b-icon-arrow-right-short />
          </b-button>
        </b-button-group>
      </b-dropdown-item>

      <b-dropdown-divider />

      <b-dropdown-item
        variant="danger"
        @click="promptDeleteList"
      >
        Delete list
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import ChangeListView from '@/components/LegacyBoard/LegacyChangeListView';
import RenameList from '@/components/LegacyBoard/LegacyRenameList';
import ListTweaks from '@/components/LegacyBoard/LegacyListTweaks';
import SortList from '@/components/LegacyBoard/LegacySortList';
import { mapState } from 'vuex';

export default {
  components: {
    ChangeListView,
    RenameList,
    ListTweaks,
    SortList,
  },

  props: {
    listIndex: {
      type: [Number, String, Boolean],
      required: true,
      default: 0,
    },
  },

  data() {
    return {
      localList: null,
    };
  },

  computed: {
    ...mapState(['user', 'gameLists', 'platform']),

    isFirst() {
      return this.listIndex === 0;
    },

    activeList() {
      return this.gameLists[this.platform.code][this.listIndex];
    },

    isLast() {
      const lastListIndex = Object.keys(this.gameLists[this.platform.code]).length - 1;

      return this.listIndex === lastListIndex;
    },

    disableSave() {
      return this.localList.name === this.activeList.name;
    },

    warningMessage() {
      const gameCount = this.activeList.games.length;

      return `This list contains ${gameCount} games, all games will be deleted as well.`;
    },
  },

  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.activeList));
  },

  methods: {
    promptDeleteList() {
      this.$bvModal.msgBoxConfirm('This action cannot be undone', {
        title: 'Are you sure you want to delete this list?',
        okVariant: 'danger',
        okTitle: 'Yes, delete list',
      })
        .then((value) => {
          if (value) {
            this.deleteList();
          }
        });
    },

    async deleteList() {
      this.$store.commit('REMOVE_LIST_LEGACY', this.listIndex);

      await this.$store.dispatch('SAVE_LIST_LEGACY', this.gameLists)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('List deleted', {
        variant: 'warning',
      });
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST_LEGACY', { from, to });

      await this.$store.dispatch('SAVE_LIST_LEGACY', this.gameLists)
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('List saved', { title: 'success', variant: 'success' });
    },

    focusInput() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 100);
    },
  },
};
</script>
