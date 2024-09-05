<template>
  <div>
    <pre>{{ currentGameId || 'not game page' }}</pre>
    <div
      class="d-flex mx-2"
      v-for="tier in board.lists"
      style="margin-bottom: 4px;"
      :key="tier.id"
    >
      <b-avatar
        :style="`background-color: ${tier.backgroundColor}; border-radius: 4px !important;`"
        text=" "
        size="20"
      />

      <b-avatar
        v-for="(game, index) in tier.games"
        :key="index"
        :variant="getGameVariant(game)"
        v-b-tooltip.hover
        :title="game.name"
        text=" "
        square
        :src="showGameThumbnails ? game.src : null"
        style="margin-left: 4px; border-radius: 4px !important;"
        :class="currentGameId === game.id ? 'border border-danger' : null"
        size="20"
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

  computed: {
    ...mapGetters(['darkTheme', 'showGameThumbnails']),
    ...mapState(['routeName', 'game']),

    currentGameId() {
      return this.routeName === 'game'
        ? this.game?.id
        : null;
    },
  },

  methods: {
    getGameVariant(game) {
      const defaultVariant = this.darkTheme ? 'black' : 'secondary';

      if (!game?.id) return defaultVariant;
      if (this.game?.id === this.gameId) return this.darkTheme ? 'success' : 'danger'

      return defaultVariant;
    },
  },
}
</script>

<style scoped>
/* Your component styles here */
</style>
