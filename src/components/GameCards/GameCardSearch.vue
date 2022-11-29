<template lang="html">
  <b-card
    v-if="game"
    :img-src="$options.getImageUrl(coverId)"
    :img-alt="game.name"
    :class="['mb-3 cursor-pointer', { 'border-selected': selected }]"
    overlay
    @click="handleClick"
  >
    <div v-if="selected" class="selected-indicator rounded bg-success text-white">
      <i class="fa fa-check" />
    </div>
  </b-card>
</template>

<script>
import { getImageUrl } from '@/utils';
import { mapState } from 'vuex';
import slugify from 'slugify'

export default {
  getImageUrl,

  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(['user', 'boards']),

    coverId() {
      return this.game?.cover?.image_id;
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
        const { id } = this.game;
        const slug = slugify(this.game.slug, { lower: true });

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
      const gameIndex = board?.lists?.[listIndex]?.games?.indexOf(this.gameId);

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

<style lang="scss" rel="stylesheet/scss" scoped>
.selected-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
