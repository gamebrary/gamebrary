<template lang="html">
  <b-dropdown size="sm" class="m-1" right>
    <add-game-modal :list="list" />
    <b-dd-divider />
    <sort-list :list="list" :list-index="listIndex" />
    <rename-list :list="list" :list-index="listIndex" />
    <change-list-view :list="list" :list-index="listIndex" />
    <list-preferences :list="list" :list-index="listIndex" />
    <b-dropdown-divider />
    <b-dropdown-item>
      <b-button-group size="sm">
        <b-button
          v-b-tooltip.hover
          :title="$t('list.moveLeft')"
          :disabled="isFirst"
          @click="moveList(listIndex, listIndex - 1)"
        >
          <b-icon-arrow-left-short />
        </b-button>

        <b-button
          v-b-tooltip.hover
          :title="$t('list.moveRight')"
          :disabled="isLast"
          @click="moveList(listIndex, listIndex + 1)"
        >
          <b-icon-arrow-right-short />
        </b-button>
      </b-button-group>
    </b-dropdown-item>
    <b-dropdown-divider />

    <b-dropdown-item
      variant="outline-danger"
      @click="promptDeleteList"
    >
      <b-icon-trash class="mr-1" />
      Delete list
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import ChangeListView from '@/components/Lists/ChangeListView';
import RenameList from '@/components/Lists/RenameList';
import ListPreferences from '@/components/Lists/ListPreferences';
import SortList from '@/components/Lists/SortList';
import AddGameModal from '@/components/Lists/AddGameModal';
import { mapState } from 'vuex';

export default {
  components: {
    ChangeListView,
    RenameList,
    ListPreferences,
    AddGameModal,
    SortList,
  },

  props: {
    listIndex: Number,
    list: Object,
  },

  data() {
    return {
      localList: null,
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
      this.$store.commit('REMOVE_LIST', this.listIndex);

      await this.$store.dispatch('SAVE_BOARD', true)
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });

      this.$bvToast.toast('List deleted', {
        variant: 'warning',
      });
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST', { from, to });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
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
