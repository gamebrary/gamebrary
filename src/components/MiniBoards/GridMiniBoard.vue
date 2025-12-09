<template>
  <div v-if="isGrid" class="grid">
    <img
      v-for="(game, index) in firstList.games"
      :key="index"
      :ref="el => { if (el) gameRefs[`game-${index}`] = el }"
      :style="`border-radius: 4px !important; width: 40px; height: 40px; object-fit: cover;`"
      :class="darkTheme ? 'bg-black' : 'bg-light'"
      :title="game.name"
      :src="showGameThumbnails && game.src ? game.src : null"
      :alt="game.name"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
    />
  </div>

  <div
    v-else
    class="board d-flex rounded overflow-hidden justify-content-center"
  >
    <div
      class="card overflow-hidden align-self-start p-0"
      :class="darkTheme ? 'bg-black text-light' : 'bg-transparent text-dark'"
      style="width: 80px"
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
        >
          <img
            :ref="el => { if (el) gameRefs[`game-${index}`] = el }"
            :style="`border-radius: 4px !important;`"
            :class="['m-1', darkTheme ? 'bg-black' : 'bg-light']"
            :title="game.name"
            :src="showGameThumbnails && game.src ? game.src : null"
            :alt="game.name"
            style="width: 20px; height: 20px; object-fit: cover;"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          />

          <small v-if="board.ranked">{{ index + 1 }}</small>
        </div>
      </template>

      <div
        v-else
        class="rounded overflow-hidden"
        style="height: 22px; width: 60px;"
      />
    </div>
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

  data() {
    return {
      gameRefs: {},
    };
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

  mounted() {
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  methods: {
    initTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
          }
        });
      });
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
