<template>
  <div>
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
        size="20"
      />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
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
