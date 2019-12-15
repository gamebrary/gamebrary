<template lang="html">
  <modal
    class="listAddButton"
    ref="listAddModal"
    :title="title"
    @open="open"
  >
    <button
      :title="$t('list.add')"
      class="small primary add-list-button"
      ref="addList"
    >
      <i class="fas fa-plus" />
    </button>

    <div slot="content">
      <!-- <div v-if="isEmptyBoard">
        <h3>Get started with a preset</h3>

        <button class="secondary">Minimalist (Owned / Wishlist)</button>
        <button class="secondary">Completionist (Owned / Wishlist / Completed)</button>

        <h3>Or create your first list</h3>
      </div> -->

      <form @submit.prevent="addList">
        <input
          ref="listNameInput"
          v-model.trim="listName"
          :placeholder="$t('list.placeholder')"
          type="text"
          autofocus
          required
        >

        <button
          :disabled="disabled"
          class="primary"
          type="submit"
        >
          {{ buttonLabel }}
        </button>

        <small v-if="isDuplicate">{{ $t('list.duplicateWarning') }}</small>
      </form>
    </div>
  </modal>
</template>

<script>
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
  },

  data() {
    return {
      listName: '',
    };
  },

  computed: {
    ...mapState(['gameLists', 'platform']),

    lists() {
      return this.gameLists[this.platform.code];
    },

    title() {
      return this.isEmptyBoard
        ? this.$t('list.addFirstTime')
        : this.$t('list.add');
    },

    buttonLabel() {
      return this.isEmptyBoard
        ? this.$t('list.getStarted')
        : this.$t('global.save');
    },

    existingListNames() {
      return this.lists
        ? this.lists.map(({ name }) => name.toLowerCase())
        : [];
    },

    isDuplicate() {
      return this.existingListNames.includes(this.listName.toLowerCase());
    },

    isEmptyBoard() {
      const newList = this.gameLists && this.platform && !this.gameLists[this.platform.code];
      const emptyList = this.gameLists[this.platform.code]
      && this.gameLists[this.platform.code].length === 0;

      return newList || emptyList;
    },

    disabled() {
      return this.isDuplicate || !this.listName;
    },
  },

  methods: {
    open() {
      this.listName = '';
      this.focusInput();
    },

    focusInput() {
      setTimeout(() => {
        this.$refs.listNameInput.focus();
      }, 100);
    },

    addList() {
      if (this.disabled) {
        return;
      }

      const list = {
        games: [],
        name: this.listName,
      };

      this.$store.commit('ADD_LIST', list);

      this.$store.dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', { message: 'List added' });
          this.$refs.listAddModal.close();
          this.scroll();
        });
    },

    scroll() {
      this.$nextTick(() => {
        const gameBoard = document.querySelector('.game-board');

        gameBoard.scrollLeft = gameBoard.scrollWidth;
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "src/styles/styles.scss";

  .listAddButton {
    scroll-snap-align: center;
  }

  .add-list-button {
    margin-right: $gp;
  }

  small {
    color: var(--warning-color);
    margin: 0 $gp;
  }
</style>
