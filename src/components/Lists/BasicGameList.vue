<template lang="html">
  <draggable
    class="games centered"
    handle=".card"
    ghost-class="card-placeholder"
    drag-class="border-selected"
    chosen-class="border-primary"
    filter=".drag-filter"
    delay="50"
    animation="500"
    :list="list.games"
    :move="validateMove"
    :disabled="draggingDisabled"
    :group="{ name: 'games' }"
    @end="dragEnd"
    @start="dragStart"
  >
    <b-card
      no-body
      class="mb-2 flex-row align-items-center cursor-pointer"
      v-for="gameId in sortedGames"
      :key="gameId"
      @click="openGame(gameId, list)"
    >
      <b-img
        :src="$options.getThumbnailUrl(games[gameId])"
        alt="Image"
        class="m-2"
        rounded
        fluid
        width="160"
      />

      <h2 class="d-flex w-100 justify-content-center mr-2">{{ games[gameId].name }}</h2>
    </b-card>

    <div v-if="isEmpty && isBoardOwner">
      <b-button
        variant="light"
        block
        class="mb-2"
        :disabled="!isBoardOwner"
        :to="{ name: 'search', query: { boardId: board.id, listIndex: 0 } }"
      >
        <template v-if="isBoardOwner">Add games</template>
        <template v-else>Empty list</template>
      </b-button>
    </div>

    <b-button
      v-else-if="isBoardOwner"
      title="Add games"
      block
      :to="{ name: 'search', query: { boardId: board.id, listIndex: 0 } }"
    >
      <i class="fa-solid fa-plus fa-fw" /> Add games
    </b-button>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import slugify from 'slugify'
import orderby from 'lodash.orderby';
import { DEFAULT_LIST_VIEW } from '@/constants';
import { mapState, mapGetters } from 'vuex';
import { getThumbnailUrl } from '@/utils';

export default {
  getThumbnailUrl,

  components: {
    draggable,
  },

  props: {
    list: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      draggingId: null,
      editing: false,
    };
  },

  computed: {
    ...mapState(['games', 'dragging', 'progresses', 'board', 'user', 'settings']),
    ...mapGetters(['isBoardOwner']),

    draggingDisabled() {
      return !this.user || !this.isBoardOwner;
    },

    autoSortEnabled() {
      return ['sortByName', 'sortByRating', 'sortByReleaseDate', 'sortByProgress'].includes(this.list?.settings?.sortOrder);
    },

    sortedGames() {
      const { settings, games } = this.list;
      const sortOrder = settings.sortOrder || 'sortByCustom';

      switch (sortOrder) {
      case 'sortByCustom': return this.list.games;
      case 'sortByProgress': return orderby(games, [game => this.progresses[game] || 0], ['desc']);
      case 'sortByRating': return orderby(games, [game => this.games[game].rating || 0], ['desc']);
      case 'sortByName': return orderby(games, [game => this.games[game].name]);
      default:
        return this.list.games;
      }
    },

    isEmpty() {
      return this.list.games.length === 0;
    },

    singleList() {
      return this.board.lists.length === 1;
    },
  },

  methods: {
    openGame(id, list) {
      const slug = slugify(this.games[id].slug, { lower: true });

      this.$router.push({
        name: 'game',
        params: {
          id,
          slug,
          boardId: this.board.id,
        },
      });
    },

    validateMove({ from, to }) {
      const sameList = from.id === to.id;
      const notInList = !this.board?.lists?.[to.id]?.games?.includes(Number(this.draggingId));

      return sameList || notInList && !sameList;
    },

    dragStart({ item }) {
      this.$store.commit('SET_DRAGGING_STATUS', true);
      this.draggingId = item.id;
    },

    dragEnd() {
      this.$store.commit('SET_DRAGGING_STATUS', false);
      this.saveBoard();
    },

    async saveBoard() {
      await this.$store.dispatch('SAVE_BOARD')
        .catch(() => {
          this.$store.commit('SET_SESSION_EXPIRED', true);
        });
    },
  },
};
</script>
