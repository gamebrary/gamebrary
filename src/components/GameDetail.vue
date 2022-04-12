<!-- TODO: add speedruns -->
<!-- TODO: use v-observe-visibility -->
<template lang="html">
  <b-container fluid class="p-0">
    <b-form-row>
      <b-col cols="3">
        <div class="position-relative">
          <b-img
            :src="gameCoverUrl"
            :alt="game.name"
            class="cursor-pointer game-cover"
            fluid-grow
            rounded
            @click.stop="openGameCover"
          />

          <div class="game-info">
            <game-rating :game="game" />
          </div>
        </div>

        <b-skeleton-img
          v-if="loading"
          width="100px"
          height="100px"
        />

        <template v-else>
          <!-- <game-videos :videos="game.videos" v-if="game.videos" /> -->
        </template>

        <game-websites :game="game" class="d-none d-md-inline" />
        <game-notes />
        <!-- <pre>{{ game.genres.map(({ id }) => id) }}</pre> -->
        <!-- TODO: add bundles to game detail? -->
        <!-- {{ game.bundles ? `Found in ${game.bundles.length} compilations.` : null }} -->
        <!-- <timeline
          v-if="twitterHandle"
          :id="twitterHandle"
          sourceType="profile"
        >
          loading...
        </timeline> -->
      </b-col>

      <b-col cols="7">
        <!-- <pre class="text-dark small">{{ game.gog.price }}</pre> -->
        <h3 class="m-0">
          {{ game.name }}
          <b-badge variant="success" v-if="game && game.steam && game.steam.metacritic">{{ game.steam.metacritic.score }}</b-badge>
        </h3>

        <game-alternative-titles />

        <!-- TODO: use array map/filter -->
        <!-- <b-badge
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
        </b-badge> -->

        <!-- <small>
          <pre class="text-dark">{{ steamGame }}</pre>
        </small> -->
        <!-- TODO: get from {{game}} -->
        <!-- <small v-if="gog && gog.isPriceVisible">{{gog.price.symbol}}{{ gog.price.amount }}</small> -->
        <!-- <small><pre class="text-dark">{{ gog }}</pre></small> -->
        <!-- <pre class="small text-dark">{{ steamGame }}</pre> -->
        <b-progress
          v-if="progress"
          :value="progress"
          variant="success"
          height="8px"
          v-b-modal.progress
          class="my-1 w-25"
        />

        <!-- TODO: add icons for game modes:
        single-player
        multiplayer
        co-operative
        split-screen
        massively-multiplayer-online-mmo
        battle-royale -->

        <game-genres :game="game" />
        <game-description />

        <game-platforms />
        <!-- <game-news :game="game" /> -->
        <game-details />

        <game-websites
          :game="game"
          grid
          class="d-md-none"
        />

        <!-- <template v-if="!loading">
          <b-skeleton v-for="n in 3" :key="n" />
        </template> -->

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

      <b-col cols="12">
        <similar-games
          :loading="loading"
          class="mb-2"
        />
      </b-col>
    </b-form-row>
  </b-container>
</template>

<script>
import GameNotes from '@/components/Game/GameNotes';
import GameGenres from '@/components/Game/GameGenres';
// import GameNews from '@/components/Game/GameNews';
import GameDetails from '@/components/Game/GameDetails';
import GameAlternativeTitles from '@/components/Game/GameAlternativeTitles';
import GamePlatforms from '@/components/Game/GamePlatforms';
import GameRating from '@/components/Game/GameRating';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameWebsites from '@/components/Game/GameWebsites';
// import GameImages from '@/components/Game/GameImages';
// import GameVideos from '@/components/Game/GameVideos';
import { mapState } from 'vuex';
// import { Timeline } from 'vue-tweet-embed'

export default {
  components: {
    // Timeline,
    GameDescription,
    GameDetails,
    GameAlternativeTitles,
    GamePlatforms,
    GameRating,
    // GameImages,
    GameNotes,
    GameGenres,
    // GameNews,
    // GameVideos,
    GameWebsites,
    SimilarGames,
  },

  props: {
    // TODO: replace with game from state
    // game: {
    //   type: Object,
    //   required: true,
    // },
    // gog: Object,
    // steamGame: Object,
    loading: Boolean,
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags']),

    twitterHandle() {
      // TODO: put in constant
      const twitterCategory = 5;

      // TODO: use optional chaining
      const twitterUrl = this.game && this.game.websites
        ? this.game.websites.find(({ category }) => category === twitterCategory)
        : '';

      // TODO: use optional chaining
      return twitterUrl && twitterUrl.url
        ? twitterUrl.url.split('twitter.com/')[1]
        : null;
    },

    gameCoverUrl() {
      const imageId = this.game && this.game.cover && this.game.cover.image_id;

      return imageId
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
        : '/no-image.jpg';
    },

    progress() {
      const { gameId, progresses } = this;

      return progresses[gameId] || null;
    },
  },

  beforeDestroy() {
    if (!['game', 'board'].includes(this.$route.name)) {
      this.$store.commit('CLEAR_BOARD');
    }
  },

  methods: {
    openGameCover() {
      this.$router.push({
        name: 'game-media-page',
        params: {
          gameId: this.game.id,
          gameSlug: this.game.slug,
        },
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
// .game {
//   width: calc(100% - .5rem);
//   display: grid;
//   grid-template-columns: 360px 2fr;
//   grid-gap: 1rem;
//
//   @media(max-width: 1280px) {
//     grid-template-columns: 360px 1fr;
//   }
//
//   @media(max-width: 1024px) {
//     grid-template-columns: 320px 1fr;
//   }
//
//   @media(max-width: 768px) {
//     width: 100%;
//     grid-template-columns: 100%;
//   }
// }
//
// .game-cover {
//   max-width: 100%;
//   // position: relative;
//   height: auto;
// }
//
// .game-info {
//   position: absolute;
//   bottom: 1rem;
//   right: 1rem;
// }
//
// footer {
//   grid-column: 1 / -1;
// }
</style>
