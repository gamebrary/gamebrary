<template lang="html">
  <div>
    <div
      v-for="({ games, hex, tagTextColor }, name) in tags"
      :key="name"
      class="border-bottom border-light pb-4 mb-4"
    >
      <b-badge
        pill
        tag="small"
        :style="`background-color: ${hex}; color: ${tagTextColor}`"
      >
        {{ name }}
      </b-badge>

      <br />

      <small class="text-muted">{{ games.length }} Games</small>

      <br />

      <b-button @click="$emit('selected', name)">
        Edit
      </b-button>

      <div class="d-flex overflow-auto no-scrollbar clickable">
        <b-img
          v-for="gameId in games"
          :key="gameId"
          :src="getCoverUrl(gameId)"
          class="rounded ml-n4"
          @click.stop="openGame(gameId)"
          width="60"
        />
      </div>
    </div>
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

    openGame(gameId) {
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
      this.$bvModal.show('game-modal');
    },
  },
};
</script>
