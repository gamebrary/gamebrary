<template lang="html">
  <div class="game-list-settings">
    <add-game-modal :list="list" />

    <!-- <sort-list :list="list" :list-index="listIndex" /> -->
    <b-form-radio-group
      v-model="sortOrder"
      variant="primary"
      :options="sortingOptions"
    />

    <b-alert
      class="mb-0 mt-2"
      show
      :variant="sortOrder !== 'sortByCustom' ? 'warning' : 'info'"
    >
      <span v-if="sortOrder === 'sortByCustom'">
        Games will be added to end of list, drag games to re-order.
      </span>

      <span v-else-if="sortOrder">
        Games will be sorted by

        <span class="text-lowercase">
          {{ $t(`board.list.${sortOrder}`)}}
        </span>
      </span>
    </b-alert>
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
    <b-button>Save</b-button>
    <b-button @click="$emit('close')">Cancel</b-button>
    boom boom boom
  </div>
</template>

<script>
import ChangeListView from '@/components/Lists/ChangeListView';
import RenameList from '@/components/Lists/RenameList';
// import ListPreferences from '@/components/Lists/ListPreferences';
// import SortList from '@/components/Lists/SortList';
import AddGameModal from '@/components/Lists/AddGameModal';
import { mapState } from 'vuex';

export default {
  components: {
    ChangeListView,
    RenameList,
    // ListPreferences,
    AddGameModal,
    // SortList,
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

<style lang="scss" rel="stylesheet/scss" scoped>
.game-list-settings {
  min-height: 50vh;
}
</style>
