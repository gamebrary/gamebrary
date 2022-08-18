<template lang="html">
  <b-card
    no-body
    :title="game.name"
    class="mb-3 cursor-pointer"
    :footer-class="['p-1 text-center \ font-weight-bold bold strong', selected ? 'bg-success' : 'text-muted']"
    @click="handleClick"
  >
    <!-- :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" -->

    <b-card-img
      :src="coverUrl"
      :img-alt="game.name"
      :alt="game.name"
    />

    <template #footer>
      <small :class="[selected ? 'text-white' : 'text-muted']">
        <strong>{{ game.name }}</strong>
      </small>
    </template>
  </b-card>
</template>

<script>
import { getGameCoverUrl } from '@/utils';
import { mapState } from 'vuex';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(['user', 'boards']),

    coverUrl() {
      return getGameCoverUrl(this.game);
    },

    selectedBoard() {
      const { boardId } = this.$route.query;

      return this.boards.find(({ id }) => id === boardId);
    },

    selected() {
      return this.selectedList?.games?.includes(this.game.id)
    },

    selectedList() {
      const { listIndex } = this.$route.query;

      return this.selectedBoard?.lists?.[listIndex];
    },
  },

  methods: {
    handleClick() {
      const { boardId, listIndex } = this.$route?.query;
      const hasActiveBoard = boardId && listIndex >= 0;

      if (hasActiveBoard) {
        this.addGameToList();
      } else {
        const { id, slug } = this.game;

        this.$router.push({ name: 'game', params: { id, slug }});
      }
    },

    addGameToList() {
      return this.selected
        ? this.removeGame()
        : this.addGame();
    },

    async addGame() {
      const { boardId, listIndex } = this.$route?.query;
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];

      board?.lists?.[listIndex]?.games.push(this.game.id);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
      } catch (e) {
        // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },

    async removeGame() {
      const { boardId, listIndex } = this.$route?.query;
      const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      const board = this.boards[boardIndex];

      board.lists[listIndex].games.splice(gameIndex, 1);

      try {
        await this.$store.dispatch('SAVE_GAME_BOARD', board);
      } catch (e) {
        // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      }
    },
  },
};
</script>
