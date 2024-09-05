<template>
  <div v-if="isGrid" class="grid">
    <b-avatar
      v-for="(game, index) in firstList.games"
      v-b-tooltip.hover
      :key="index"
      :style="`border-radius: 4px !important;`"
      :variant="darkTheme ? 'black' : 'light'"
      :title="game.name"
      :src="showGameThumbnails ? game.src : null"
      text=" "
    />
  </div>

  <div
    v-else
    class="board d-flex rounded overflow-hidden justify-content-center"
  >
    <b-card
      body-class="p-0"
      :bg-variant="darkTheme ? 'black' : 'transparent'"
      :text-variant="darkTheme ? 'light' : 'dark'"
      style="width: 80px"
      class="overflow-hidden align-self-start"
    >
      <template v-if="firstList.games.length">
        <div
          v-for="(game, index) in firstList.games"
          :key="index"
          :class="[
            currentGameId === game.id
              ? 'border bg-danger border-danger'
              : darkTheme
                ? 'border-black bg-dark'
                : 'border-light bg-white',
            { 'border-bottom': index !== firstList.games.length - 1 },
          ]"
          class=""
        >
          <b-avatar
            :style="`border-radius: 4px !important;`"
            text=" "
            :variant="darkTheme ? 'black' : 'light'"
            class="m-1"
            v-b-tooltip.hover
            :title="game.name"
            :src="showGameThumbnails ? game.src : null"
            size="20"
          />

          <small v-if="board.ranked">{{ index + 1 }}</small>
        </div>
      </template>

      <div
        v-else
        class="rounded overflow-hidden"
        style="height: 22px; width: 60px;"
      />
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters(['darkTheme', 'showGameThumbnails']),
    ...mapState(['routeName', 'game']),

    currentGameId() {
      return this.routeName === 'game'
        ? this.game?.id
        : null;
    },

    isGrid() {
      return this.board?.grid;
    },

    firstList() {
      return this.board?.lists?.[0] || {};
    },
  },
};
</script>

<style scoped>
.grid {
  grid-gap: .5rem;
  display: grid;
  max-width: 296px;
  padding: .5rem;
  margin: 0 auto;
  grid-template-columns: repeat(6, 1fr);

  @media(max-width: 768px) {
    justify-content: start;
    grid-template-columns: repeat(3, 1fr);
    width: 152px;
    margin: 0;
  }
}
</style>
