<!-- TODO: add speedruns -->
<!-- TODO: add pricecharting info -->
<!-- TODO: use v-observe-visibility -->
<!-- TODO: show GOG buy button -->

<template lang="html">
  <b-container fluid class="p-2">
    <b-skeleton v-if="loading" />

    <b-row v-else-if="game">
      <b-col
        cols="10"
        offset="1"
        offset-sm="0"
        sm="5"
        md="4"
        lg="3"
      >
        <div class="position-relative">
          <b-img
            :src="gameCoverUrl"
            :alt="game.name"
            class="cursor-pointer game-cover"
            fluid-grow
            rounded
            @click.stop="openGameCover"
          />

          <amazon-links class="mt-2" />

          <div class="game-info">
            <game-rating :game="game" />
          </div>
        </div>

        <!-- <b-skeleton-img
          v-if="loading"
          width="100px"
          height="100px"
        /> -->

        <!-- <template v-else>
          <game-videos :videos="game.videos" v-if="game.videos" />
        </template> -->

        <game-websites :game="game" class="d-none d-md-inline" />
        <game-notes />
        <b-button variant="info" @click="openGameNews">
          <b-badge>3</b-badge>
          News about {{ game.name }}
        </b-button>
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

      <b-col
        cols="10"
        sm="6"
        md="7"
        offset="1"
        offset-sm="0"
        lg="8"
      >
        <!-- <pre class="text-dark small">{{ game.gog.price }}</pre> -->

        <game-titles />
        <b-badge variant="success" v-if="game && game.steam && game.steam.metacritic">{{ game.steam.metacritic.score }}</b-badge>

        <b-badge
          v-for="({ hex, tagTextColor }, name) in gameTags"
          :key="name"
          pill
          tag="small"
          class="mr-1 mb-2"
          :style="`background-color: ${hex}; color: ${tagTextColor}`"
          @click="$router.push({ name: 'game.tags', params: { id: game.id, slug: game.slug } })"
          v-b-modal.tags
        >
          {{ name }}
        </b-badge>

        <!-- <small>
          <pre class="text-dark">{{ steamGame }}</pre>
        </small> -->
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
          @click.native="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })"
        />
        <!-- TODO: use percentage instead? -->

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
    </b-row>

    <!-- <div class="game-backdrop" :style="`background-image: url(${backdropUrl})`" /> -->
  </b-container>
</template>

<script>

import { mapState } from 'vuex';
import { WEBSITE_CATEGORIES } from '@/constants';
import AmazonLinks from '@/components/Game/AmazonLinks';
import GameNotes from '@/components/Game/GameNotes';
import GameGenres from '@/components/Game/GameGenres';
import GameDetails from '@/components/Game/GameDetails';
import GameTitles from '@/components/Game/GameTitles';
import GamePlatforms from '@/components/Game/GamePlatforms';
import GameRating from '@/components/Game/GameRating';
import GameDescription from '@/components/Game/GameDescription';
import SimilarGames from '@/components/Game/SimilarGames';
import GameWebsites from '@/components/Game/GameWebsites';

export default {
  components: {
    // Timeline,
    AmazonLinks,
    GameDescription,
    GameDetails,
    GameTitles,
    GamePlatforms,
    GameRating,
    GameNotes,
    GameGenres,
    GameWebsites,
    SimilarGames,
  },

  data() {
    return {
      gog: null,
      steamGame: null,
      loading: false,
    };
  },

  beforeDestroy() {
    // TODO: only clear board if game being viewed is not in current board
    // if (!['game', 'board'].includes(this.$route.name)) {
      // this.$store.commit('CLEAR_BOARD');
    // }
  },

  computed: {
    ...mapState(['game', 'progresses', 'tags']),

    gameTags() {
      // TODO: refactor architecture, don't use tag name as key
      // TODO: fix other instances
      const tagsArray = Object.entries(this.tags);
      const filteredTags = tagsArray.filter(([key, value]) => {
        return value.games.includes(this.game.id);
      });

      const filteredTagsObject = Object.fromEntries(filteredTags);

      return filteredTagsObject;
    },

    twitterHandle() {
      // TODO: put in constant
      const twitterCategory = 5;

      const twitterUrl = this.game?.websites
        ? this.game.websites.find(({ category }) => category === twitterCategory)
        : '';

      return twitterUrl?.url
        ? twitterUrl.url.split('twitter.com/')[1]
        : null;
    },

    gameCoverUrl() {
      const imageId = this.game?.cover?.image_id;

      return imageId
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${imageId}.jpg`
        : '/no-image.jpg';
    },

    progress() {
      const { gameId, progresses } = this;

      return progresses[gameId] || null;
    },

    gameId() {
      return this.$route.params.id;
    },

    // backdropUrl() {
    //   const screenshots = this.game?.screenshots;
    //
    //   return screenshots.length > 0
    //     ? `https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/${screenshots[0].image_id}.jpg`
    //     : '';
    // },

    wikipediaData() {
      return this.game?.websites?.find(({ url, category }) => url && category === WEBSITE_CATEGORIES.WIKIPEDIA);
    },
  },

  watch: {
    gameId(gameId) {
      document.getElementsByTagName('main')[0].scrollTop = 0;

      if (gameId) this.loadGame();
      // TODO: handle missing id, redirect? 404? search?
    },
  },

  mounted() {
    // TODO: wait for access token
    this.loadGame();

    this.$store.dispatch('IGDB', { path: 'game_modes', data: 'fields *;' });
  },

  methods: {
    openGameCover() {
      this.$router.push({
        name: 'game.media',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    openGameNews() {
      this.$router.push({
        name: 'game.news',
        params: {
          id: this.game.id,
          slug: this.game.slug,
        },
      });
    },

    async loadGame() {
      const gameCached = this.game?.id === this.gameId;

      if (!this.gameId || gameCached) return;

      this.$store.commit('CLEAR_GAME');

      this.loading = true;

      await this.$store.dispatch('LOAD_GAME', this.gameId)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Error loading game', { variant: 'error' });
        });

      this.loading = false;
      this.loadSupplementalData();
    },

    async loadSupplementalData() {
      // TODO: put in constants
      const gogCategoryId = 17;
      const steamCategoryId = 13;

      const steamPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === steamCategoryId)
        : null;

      // TODO: use regex or more elegant way to get id from url
      const steamGameId = steamPage
        ? steamPage.url.split('app/')[1].split('/')[0]
        : null;

      const gogPage = this.game?.websites
        ? this.game.websites.find(({ category }) => category === gogCategoryId)
        : null;

      const wikipediaSlug = this.wikipediaData?.url?.split('/wiki/')[1];

      if (wikipediaSlug) await this.$store.dispatch('LOAD_WIKIPEDIA_ARTICLE', wikipediaSlug).catch((e) => {});
      if (steamGameId) await this.$store.dispatch('LOAD_STEAM_GAME', steamGameId);
      if (gogPage) await this.$store.dispatch('LOAD_GOG_GAME', this.game.name);
      // await this.$store.dispatch('LOAD_GAME_SPEEDRUNS', this.game.name);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-backdrop {
  width: 100%;
  height: 100vw;
  // position: fixed;
  // top: 0;
  backdrop-filter: grayscale(0.5) opacity(0.8) /* ...and on and on... */;
  background-repeat: no-repeat;
  background-size: contain;
  // opacity: 0.1;
  z-index: 0;
}
</style>
