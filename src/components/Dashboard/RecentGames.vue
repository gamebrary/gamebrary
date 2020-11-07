<template lang="html">
  <div class="tags-widget" v-if="Object.keys(tags).length > 0 && !noGames">
    <h5>Tags</h5>

    <div
      v-for="(tag, tagName) in tags"
      :key="tagName"
    >
      <!-- <b-badge :style="`background-color: ${tag.hex}; color: ${tag.tagTextColor}`">
        {{ tagName }}
      </b-badge> -->

      <small>{{ tagName }}</small>

      <div class="thumbnails" v-if="loaded">
        <b-img
          v-for="game in tag.games.slice(0, 5)"
          :key="game"
          href="#"
          thumbnail
          class="thumbnail"
          :title="games[game].name"
          :src="getCoverUrl(game)"
          @click="openGame(game)"
        />

        <b-avatar
          v-if="tag.games.length > 5"
          class="more-indicator border"
          variant="light"
          :to="{ name: 'tags' }"
        >
          <small>+{{ tag.games.length - 5 }}</small>
        </b-avatar>
      </div>
      <b-skeleton v-else />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      loaded: false,
      noGames: false,
    };
  },

  computed: {
    ...mapState(['tags', 'games']),
  },

  mounted() {
    this.loadGames();
  },

  methods: {
    openGame(gameId) {
      this.$store.commit('SET_GAME_MODAL_DATA', { gameId });
      this.$bvModal.show('game-modal');
    },

    async loadGames() {
      const gamesList = Object.values(this.tags).length
        ? [...new Set(Object.values(this.tags).map(({ games }) => games).flat())]
        : null;

      if (!gamesList) return;

      if (gamesList.length === 0) {
        this.noGames = true;
        return;
      }

      // TODO: get list of games that aren't currently cached?
      await this.$store.dispatch('LOAD_GAMES', gamesList)
        .catch(() => {
          this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
          this.loaded = true;
        });

      this.loaded = true;
    },

    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tags-widget {
  .thumbnails {
    display: flex;
    align-items: center;
    overflow-x: hidden;
  }
  .thumbnail {
    height: 80px;
    width: auto;

    &:not(:first-child){
      margin-left: -30px;
    }
  }

  .more-indicator {
    margin-left: -10px;
  }
}
</style>
