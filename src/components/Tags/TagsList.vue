<template lang="html">
  <div class="tags-list">
    <b-card
      v-for="({ games, hex, tagTextColor }, name) in tags"
      :key="name"
      class="mb-3 mx-0 p-0 word-wrap d-flex position-relative d-flex align-items-start justify-content-between"
      body-class="w-100"
    >
      <div>
        <b-dropdown class="float-right" right>
          <template v-slot:button-content>
            <i class="fas fa-ellipsis-h fa-fw" aria-hidden />
          </template>

          <b-dropdown-item @click="$emit('selected', name)">
            Edit
          </b-dropdown-item>
        </b-dropdown>

        <b-badge
          pill
          tag="small"
          :style="`background-color: ${hex}; color: ${tagTextColor}`"
        >
          {{ name }}
        </b-badge>

        <p class="small text-muted">
          {{ games.length }} Games
        </p>
      </div>

      <div class="d-flex align-items-center overflow-auto">
        <b-img
          v-for="gameId in games"
          :key="gameId"
          :src="getCoverUrl(gameId)"
          width="80"
          class="rounded cursor-pointer mr-2"
          @click.stop="openGame(gameId)"
        />
      </div>
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

    openGame(gameId) {
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
      this.$bvModal.show('game-modal');
    },
  },
};
</script>
