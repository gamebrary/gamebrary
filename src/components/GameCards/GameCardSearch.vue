<template lang="html">
  <b-card
    no-body
    :title="game.name"
    :img-src="coverUrl"
    :img-alt="game.name"
    img-top
    class="mb-2"
    footer-class="p-0 text-center font-weight-bold bold strong"
    @click="$router.push({ name: 'game', params: { id: game.id, slug: game.slug }})"
  >
  <!-- :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" -->

    <template #footer>
      <small class="text-muted">
        <!-- <pre>{{ selectedBoard }}</pre> -->
        <!-- <pre>{{ selectedList }}</pre> -->
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

    selectedList() {
      const { listIndex } = this.$route.query;

      return this.selectedBoard.lists[listIndex];
    },
  },

  methods: {
    // handleClick() {
    //   const { listIndex, boardId } = this.$route.query;
    //
    //   if (listIndex && boardId) return this.addGameToList();
    //
    //   return this.user
    //     ? this.$bus.$emit('ADD_GAME', this.game.id)
    //     : this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug }});
    // },

    addGameToList() {
      return this.selectedList.games.includes(this.game.id)
        ? this.removeGame()
        : this.addGame();
    },

    async addGame() {
      const boardIndex = this.boards.findIndex(({ id }) => id === this.selectedBoard.id);
      const board = this.boards[boardIndex];
      console.log(board);

      // board.lists[listIndex].games.push(this.game.id);

      // try {
      //   await this.$store.dispatch('SAVE_GAME_BOARD', board);
      // } catch (e) {
      //   // this.$bvToast.toast(`There was an error adding "${this.game.name}"`, { title: list.name, variant: 'danger' });
      // }
    },

    async removeGame({ listIndex, boardId }) {
      // const boardIndex = this.boards.findIndex(({ id }) => id === boardId);
      // const board = this.boards[boardIndex];
      // const gameIndex = board.lists[listIndex].games.indexOf(this.gameId);
      //
      // board.lists[listIndex].games.splice(gameIndex, 1);
      //
      // try {
      //   await this.$store.dispatch('SAVE_GAME_BOARD', board);
      // } catch (e) {
      //   // this.$bvToast.toast(`There was an error removing "${this.game.name}"`, { title: list.name, variant: 'danger' });
      // }
    },
  },
};
</script>
