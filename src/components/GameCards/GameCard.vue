<template lang="html">
  <div
    v-if="game"
    class="game-card position-relative rounded p-2 cursor-pointer"
    :class="[{ vertical, small }, darkTheme ? 'dark' : 'light']"
    @click="handleClick"
  >
    <div v-if="!noCover || noTitle">
      <!-- TODO: show heart/like -->
      <div class="position-relative">
        <b-button
          v-if="user"
          variant="transparent"
          squared
          class="ml-2 mt-1 p-0"
          @click.stop.prevent="$bus.$emit('SELECT_GAME', game.id)"
        >
          <i :class="[isLiked ? 'fa-solid': 'fa-regular' , 'fa-heart text-primary']" />
        </b-button>

        <b-img
          blank-color="#ccc"
          rounded
          fluid
          :width="small ? '96' : null"
          :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
          :alt="game.name"
        />

        <GameRibbon :game="game" />
      </div>
    </div>

    <aside>
      <b-progress
        v-if="showGameProgress && !gameCompleted"
        v-b-tooltip.hover
        :title="`${gameProgress}% Completed`"
        :value="gameProgress"
        :variant="gameProgress == 100 ? 'success' : 'primary'"
        class="game-progress"
        height="8px"
      />

      <h4 v-if="!noTitle || noCover" :class="['mb-1', { 'text-success' : gameCompleted }]">
        {{ game.name }}
      </h4>

      <template v-if="showTags && tagsApplied.length">
        <b-button
          v-for="({ bgColor, textColor, name }) in tagsApplied"
          :key="name"
          rounded
          class="mr-2 mb-1 p-0 px-2"
          size="sm"
          variant="transparent"
          :style="`background-color: ${bgColor}; color: ${textColor}`"
        >
          <small>{{ name }}</small>
        </b-button>
      </template>

      <template v-if="gameNotes">
        <i
          class="fas fa-book note-indicator text-warning"
          v-b-tooltip.hover
          @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
          title="See game notes"
        />
      </template>

      <div v-if="showPlatforms && gamePlatformsText" class="d-flex mb-2">
        <small>{{ gamePlatformsText }}</small>
      </div>
    </aside>
  </div>

  <div v-else>
    {{ gameId }}
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, PLATFORMS } from '@/constants';
import GameRibbon from '@/components/GameRibbon';
import slugify from 'slugify';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,
  
  props: {
      gameId: {
        type: [String, Number],
        required: true,
      },
      vertical: Boolean,
      small: Boolean,
      noCover: Boolean,
      noTitle: Boolean,
      showTags: Boolean,
      showRibbon: Boolean,
      showPlatforms: Boolean,
      showProgress: Boolean,
      selectable: Boolean,
  },

  components: {
    GameRibbon,
  },

  computed: {
    ...mapState(['settings', 'cachedGames', 'tags', 'notes', 'progresses', 'board', 'games', 'user']),
    ...mapGetters(['isRTL', 'darkTheme']),

    // TODO: load game if not cached??? could lead to misuses
    game() {
      return this.cachedGames[this.gameId];
    },

    gamePlatforms() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]);
    },

    gamePlatformsText() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },

    gameCompleted() {
      return this.list?.highlightCompletedGames && Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return this.showProgress && this.gameProgress > 0;
    },

    isLiked() {
      return this.games?.[this.game?.id];
    },

    // showReleaseDates() {
    //   return this.list?.showReleaseDates;
    // },

    gameProgress() {
      const { gameId, progresses } = this;

      return gameId && progresses[gameId]
        ? progresses[gameId]
        : 0;
    },

    tagsApplied() {
      const tags = this.tags?.tags || this.tags;

      return tags?.filter((tag) => tag?.games?.includes(this.game?.id)) || [];
    },

    gameNotes() {
      return this.list?.showGameNotes && this.notes?.[this.gameId];
    },
  },

  methods: {
    handleClick() {
      console.log('curruchi');

      if (this.selectable) return this.$emit('click');

      const { id } = this.game;
      const slug = slugify(this.game?.slug || '', { lower: true });

      this.$router.push({ name: 'game', params: { id, slug }});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-card {
  display: grid;
  grid-template-columns: 180px auto;
  grid-gap: 1rem;
  transition: background-color 300ms linear;

  &.light {
    &:hover {
      background-color: var(--secondary);
    }
  }

  
  &.small {
    grid-template-columns: 60px auto;
  }

  &.vertical {
    grid-template-columns: auto !important;
    text-align: center;
    justify-content: center;
  }
}
</style>
