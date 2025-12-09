<template>
  <div>
    <div
      class="d-flex mx-2"
      v-for="tier in board.lists"
      style="margin-bottom: 4px;"
      :key="tier.id"
    >
      <div
        :style="`background-color: ${tier.backgroundColor}; border-radius: 4px !important; width: 20px; height: 20px;`"
      />

      <img
        v-for="(game, index) in tier.games"
        :key="index"
        :ref="el => { if (el) gameRefs[`tier-${tier.id}-game-${index}`] = el }"
        :class="[
          currentGameId === game.id ? 'border border-danger' : null,
          getGameVariant(game) === 'black' ? 'bg-black' : getGameVariant(game) === 'secondary' ? 'bg-secondary' : getGameVariant(game) === 'success' ? 'bg-success' : 'bg-danger'
        ]"
        :title="game.name"
        :src="showGameThumbnails && game.src ? game.src : null"
        :alt="game.name"
        style="margin-left: 4px; border-radius: 4px !important; width: 20px; height: 20px; object-fit: cover;"
        data-bs-toggle="tooltip"
        data-bs-placement="top"
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
    gameId: Number,
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
  },

  mounted() {
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  methods: {
    getGameVariant(game) {
      const defaultVariant = this.darkTheme ? 'black' : 'secondary';

      if (!game?.id) return defaultVariant;
      if (this.game?.id === this.gameId) return this.darkTheme ? 'success' : 'danger'

      return defaultVariant;
    },

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
}
</script>

<style scoped>
/* Your component styles here */
</style>
