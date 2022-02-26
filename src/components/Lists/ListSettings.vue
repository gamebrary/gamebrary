<template lang="html">
  <b-dropdown
    right
    variant="transparent"
    toggle-class="m-0"
  >
    <template v-slot:button-content>
      <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
    </template>

    <add-game-modal :list="list" />

    <sort-list :list="list" :list-index="listIndex" />
    <rename-list :list="list" :list-index="listIndex" />
    <change-list-view :list="list" :list-index="listIndex" />
    <!-- <list-preferences :list="list" :list-index="listIndex" /> -->
    <b-dropdown-item
      variant="danger"
      @click="promptDeleteList"
    >
      <i class="fas fa-trash-alt fa-fw" aria-hidden />
      {{ $t('board.list.delete') }}
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-text>
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
    </b-dropdown-text>
  </b-dropdown>
</template>

<script>
import ChangeListView from '@/components/Lists/ChangeListView';
import RenameList from '@/components/Lists/RenameList';
// import ListPreferences from '@/components/Lists/ListPreferences';
import SortList from '@/components/Lists/SortList';
import AddGameModal from '@/components/Lists/AddGameModal';
import { mapState } from 'vuex';

export default {
  components: {
    ChangeListView,
    RenameList,
    // ListPreferences,
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

      this.$bvToast.toast('List saved');
    },

    focusInput() {
      setTimeout(() => {
        this.$refs.input.focus();
      }, 100);
    },
  },
};
</script>
