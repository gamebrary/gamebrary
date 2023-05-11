<template lang="html">
  <b-card
    v-if="game"
    :img-src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
    :img-alt="game.name"
    :class="['mb-3 cursor-pointer', { 'border-success': selected }]"
    overlay
    @click="handleClick"
  >
    <!-- TODO: allow to like/unlike games -->
    <strong
      v-if="noImage"
      class="text-center pb-5 d-flex justify-content-center"
    >
      {{ game.name }}
    </strong>

    <div v-if="selected" class="selected-indicator rounded bg-success text-white">
      <i class="fa fa-check" />
    </div>

    <!-- {{ gamePlatformsText }} -->
  </b-card>
</template>

<script>
import { getImageUrl } from '@/utils';
import { mapState } from 'vuex';
import { NO_IMAGE_PATH, IMAGE_SIZE_COVER_SMALL, PLATFORMS } from '@/constants';
import slugify from 'slugify'

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState(['user', 'boards']),

    gamePlatforms() {
      return this.game?.platforms.map((id) => PLATFORMS?.[id]);
    },

    gamePlatformsText() {
      return this.game?.platforms.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },

    selectedBoard() {
      const { boardId } = this.$route.query;

      return this.boards.find(({ id }) => id === boardId);
    },

    selected() {
      return this.selectedList?.games?.includes(this.game.id)
    },

    noImage() {
      return NO_IMAGE_PATH === this.gameCoverUrl;
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
