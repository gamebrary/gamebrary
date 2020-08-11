<template lang="html">
  <b-dropdown size="sm" no-caret variant="light">
    <template v-slot:button-content>
      <b-icon icon="gear-fill" aria-hidden="true" />
    </template>

    <rename-list :list-index="listIndex" />

    <b-dropdown-item-button>Change view</b-dropdown-item-button>
    <b-dropdown-item-button>Move</b-dropdown-item-button>
    <b-dropdown-item-button>
      <b-form-checkbox switch>Hide game ratings</b-form-checkbox>
    </b-dropdown-item-button>
    <b-dropdown-item-button>
      <b-form-checkbox switch>Hide days until relase</b-form-checkbox>
    </b-dropdown-item-button>
    <b-dropdown-divider></b-dropdown-divider>
    <b-dropdown-item-button
      variant="danger"
      @click="promptDeleteList"
    >
      Delete list
    </b-dropdown-item-button>
  </b-dropdown>
</template>

<script>
import RenameList from '@/components/Lists/RenameList';
import Modal from '@/components/Modal';
import { mapState } from 'vuex';

export default {
  components: {
    Modal,
    RenameList,
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
      listViews: [
        { text: 'Single', value: 'single' },
        { text: 'Masonry', value: 'masonry' },
        { text: 'Grid', value: 'grid' },
        { text: 'Compact', value: 'compact' },
        { text: 'Text', value: 'text' },
      ],
      sortingOptions: [
        { text: 'Custom', value: 'sortByCustom' },
        { text: 'Name', value: 'sortByName' },
        { text: 'Rating', value: 'sortByRating' },
        { text: 'Release date', value: 'sortByReleaseDate' },
        { text: 'Progress', value: 'sortByProgress' },
      ],
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

    hasMultipleGames() {
      return this.activeList.games.length > 1;
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
      this.$store.commit('REMOVE_LIST', this.listIndex);

      await this.$store.dispatch('SAVE_LIST', this.gameLists)
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bvToast.toast('List deleted', {
        variant: 'warning',
      });
    },

    async moveList(from, to) {
      this.$store.commit('MOVE_LIST', { from, to });

      await this.$store.dispatch('SAVE_LIST', this.gameLists)
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });

      this.$bus.$emit('TOAST', { message: 'List saved' });
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
  // @import "~styles/styles";

  section {
    margin-bottom: 2rem;

    &.disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  h4 {
    margin-bottom: .5rem;
  }

  footer {
    border-top: 1px solid var(--modal-text-color);
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
  }
</style>
