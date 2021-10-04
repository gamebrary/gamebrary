<template lang="html">
  <b-container v-if="game.name" fluid>
    <b-row>
      <b-col cols="12" md="4" lg="4">
        <b-img
          :src="gameCoverUrl"
          :alt="game.name"
          class="game-cover cursor-pointer"
          rounded
          @click="$bvModal.show('game-images')"
        />

        <b-skeleton-img
          v-if="loading"
          width="100px"
          height="100px"
        />

        <template v-else>
          <game-rating :game="game" />
          <game-images :game="game" />
          <game-videos :videos="game.videos" v-if="game.videos" />
        </template>

        <game-websites :game="game" class="d-none d-md-inline" />
        <!-- <pre>{{ game.genres.map(({ id }) => id) }}</pre> -->
        <!-- TODO: add bundles to game detail? -->
        <!-- {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }} -->
      </b-col>

      <!-- cols="12"
      md="7"  -->
      <b-col
        cols="12"
        md="7"
        lg="8"
      >
        <h3 class="mb-2">{{ game.name }}</h3>
        <b-progress
          v-if="progress"
          :value="progress"
          variant="success"
          height="8px"
          v-b-modal.progress
          class="my-1 w-25"
        />
        <game-description :game="game" />
        <game-news :game="game" />
        <game-details :game="game" />

        <similar-games
          :game="game"
          :loading="loading"
          class="mb-2"
        />

        <game-websites
          :game="game"
          grid
          class="d-md-none"
        />

        <b-badge
          v-for="({ games, hex, tagTextColor }, name) in tags"
          v-if="games.includes(game.id)"
          :key="name"
          pill
          tag="small"
          class="mr-1 mb-2"
          :style="`background-color: ${hex}; color: ${tagTextColor}`"
          v-b-modal.tags
        >
          {{ name }}
        </b-badge>

        <!-- <template v-if="!loading">
          <b-skeleton v-for="n in 3" :key="n" />
        </template> -->

        <game-notes :game="game" />
        <!-- <b-form-rating
          v-if="rating"
          :value="rating"
          inline
          readonly
          variant="warning"
          size="lg"
          no-border
        />

        <br /> -->
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import GameNotes from '@/components/Game/GameNotes';
import GameNews from '@/components/Game/GameNews';
import GameDetails from '@/components/Game/GameDetails';
import GameRating from '@/components/Game/GameRating';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameWebsites from '@/components/Game/GameWebsites';
import GameImages from '@/components/Game/GameImages';
import GameVideos from '@/components/Game/GameVideos';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    GameDescription,
    GameDetails,
    GameRating,
    GameImages,
    GameNotes,
    GameNews,
    GameVideos,
    GameWebsites,
    SimilarGames,
  },

  props: {
    game: {
      type: Object,
      required: true,
    },
    loading: Boolean,
  },

  computed: {
    ...mapGetters(['activeGameCoverUrl']),
    ...mapState(['progresses', 'tags']),

    gameCoverUrl() {
      const imageId = this.game && this.game.cover && this.game.cover.image_id;

      return imageId
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
        : '/static/no-image.jpg';
    },

    progress() {
      const { gameId, progresses } = this;

      return progresses[gameId] || null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-cover {
  width: 100%;
  height: auto;
}
</style>
