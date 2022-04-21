<template lang="html">
  <div class="game-list-settings">
    <header class="p-1 pl-2 d-flex justify-content-between align-items-center">
      <h6 class="p-0 m-0">
        List settings
      </h6>

      <add-game-modal :list="list" />

      <b-button
        variant="transparent"
        @click="$emit('close')"
      >
        <i class="fas fa-times fa-fw" aria-hidden />

      </b-button>
    </header>

    <b-list-group class="p-2">
      <b-list-group-item>
        <rename-list :list="list" :list-index="listIndex" />
      </b-list-group-item>

      <b-list-group-item>
        <sort-list :list="list" :list-index="listIndex" />
      </b-list-group-item>

      <b-list-group-item>
        <change-list-view :list="list" :list-index="listIndex" />
      </b-list-group-item>

      <list-preferences :list="list" :list-index="listIndex" />

      <b-list-group-item>
        <b-button>Save</b-button>
      </b-list-group-item>

      <b-list-group-item>
        <b-button
          variant="warning"
          @click="promptDeleteList"
        >
          <i class="fas fa-trash-alt fa-fw" aria-hidden />
          {{ $t('board.list.delete') }}
        </b-button>
      </b-list-group-item>

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
  </div>
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

  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.list));
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
