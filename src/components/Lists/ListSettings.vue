<template lang="html">
  <div>
    <b-dropdown
      no-caret
      variant="light"
    >
      <template v-slot:button-content>
        <b-icon icon="three-dots" aria-hidden="true" />
      </template>

      <sort-list :list="list" :list-index="listIndex" />
      <rename-list :list="list" :list-index="listIndex" />
      <change-list-view :list="list" :list-index="listIndex" />
      <list-tweaks :list="list" :list-index="listIndex" />

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
import ChangeListView from '@/components/Lists/ChangeListView';
import RenameList from '@/components/Lists/RenameList';
import ListTweaks from '@/components/Lists/ListTweaks';
import SortList from '@/components/Lists/SortList';
import { mapState } from 'vuex';

export default {
  components: {
    ChangeListView,
    RenameList,
    ListTweaks,
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
    ...mapState(['user', 'gameLists', 'platform', 'board']),

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
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
        });

      this.$bvToast.toast('List deleted', {
        variant: 'warning',
      });
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST', { from, to });

      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
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
