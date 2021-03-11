<template lang="html">
  <div class="tags-list">
    <b-card
      v-for="({ games, hex, tagTextColor }, name) in tags"
      class="border rounded p-2 overflow-hidden text-center cursor-pointer"
      @click="$emit('selected', name)"
      :key="name"
    >
      <!-- <pre>{{ games }}</pre> -->
      <div class="rounded d-flex justify-content-center overflow-auto no-scrollbar clickable">
        <b-img
          v-for="gameId in games"
          :key="gameId"
          :src="getCoverUrl(gameId)"
          class="rounded ml-n4"
          width="60"
        />
        <!-- @click.stop="openGame(gameId)" -->
      </div>

      <b-badge
        pill
        tag="small"
        :style="`background-color: ${hex}; color: ${tagTextColor}`"
      >
        {{ name }}
      </b-badge>

      <br>

      <small>{{ games.length }} Games</small>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['tags', 'games']),
  },

  methods: {
    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },

    // openGame(gameId) {
    //   this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
    //   this.$bvModal.show('game-modal');
    // },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tags-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: .5rem;

  @media(max-width: 780px) {
    grid-template-columns: 1fr;
  }
}
</style>
