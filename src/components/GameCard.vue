<template lang="html">
  <div
    v-if="game"
    class="game-card position-relative rounded cursor-pointer"
    :class="[{ vertical, small, slim }, darkTheme ? 'dark text-light' : 'light' ]"
    @click="handleClick"
  >
    <div v-if="!hideCover || hideTitle">
      <div class="position-relative">
        <b-button
          v-if="user"
          class="like-button m-1"
          :class="{ 'liked': isLiked }"
          size="sm"
          variant="transparent"
          @click.stop.prevent="$bus.$emit('LIKE_UNLIKE_GAME', game.id)"
        >
          <i
            :class="[isLiked ? 'fa-solid': 'fa-regular' , 'fa-heart text-danger']"
            class="fa-fw"
          /> 
        </b-button>

        <b-img
          blank-color="#ccc"
          rounded
          class="mw-100"
          :width="small ? '96' : null"
          :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
          :alt="game.name"
        />

        <GameRibbon v-if="!hideRibbon" :game="game" />
      </div>
    </div>

    <aside>
      <b-avatar
        v-if="ranked"
        variant="light"
        class="mr-2"
      >
        {{ rank }}
      </b-avatar>

      <b-progress
        v-if="showGameProgress"
        v-b-tooltip.hover
        :title="`${gameProgress}% Completed`"
        :value="gameProgress"
        :variant="gameProgress == 100 ? 'success' : 'primary'"
        class="game-progress"
        height="8px"
      />

      <b-badge
        v-if="!hideProgress && gameProgress > 0"
        rounded
        variant="success"
        class="mr-1"
        size="sm"
      >
        <i v-if="gameProgress == 100" class="fas fa-check fa-fw" aria-hidden />
        <small v-else>{{ gameProgress }}%</small>
      </b-badge>

      <h2 v-if="!hideTitle || hideCover" :class="['mb-1', { 'text-success' : gameCompleted }]">
        {{ game.name }}
      </h2>

      <template v-if="!hideTags && tagsApplied.length">
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

      <template v-if="!hideNotes && gameNotes">
        <i
          class="fas fa-book note-indicator text-warning"
          v-b-tooltip.hover
          @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
          title="See game notes"
        />
      </template>

      <div v-if="!hidePlatforms && gamePlatformsText" class="d-flex mb-2">
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
      hideCover: Boolean,
      hideTitle: Boolean,
      hideTags: Boolean,
      hideRibbon: Boolean,
      hideNotes: Boolean,
      slim: Boolean,
      hidePlatforms: Boolean,
      hideProgress: Boolean,
      selectable: Boolean,
      ranked: Boolean,
      rank: Number,
  },

  components: {
    GameRibbon,
  },

  computed: {
    ...mapState(['settings', 'cachedGames', 'tags', 'notes', 'progresses', 'board', 'games', 'user']),
    ...mapGetters(['isRTL', 'darkTheme']),

    game() {
      return this.cachedGames?.[this.gameId];
    },

    gamePlatforms() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]);
    },

    gamePlatformsText() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },

    gameCompleted() {
      return Number(this.gameProgress) === 100;
    },

    showGameProgress() {
      return !this.hideProgress && this.gameProgress > 0 && !this.gameCompleted;
    },

    isLiked() {
      return this.games?.[this.game?.id];
    },

    // showReleaseDates() {
    //   return this.list?.showReleaseDates;
    // },

    gameProgress() {
      const { gameId, progresses } = this;

      return gameId && progresses?.[gameId]
        ? progresses[gameId]
        : 0;
    },

    tagsApplied() {
      const tags = this.tags?.tags || this.tags;

      return tags?.filter((tag) => tag?.games?.includes(this.game?.id)) || [];
    },

    gameNotes() {
      return this.notes?.[this.gameId];
    },
  },

  methods: {
    handleClick() {
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
  grid-template-columns: 140px auto;
  grid-gap: 1rem;
  transition: background-color 300ms linear;
  padding: 0.5rem;

  &.slim {
    padding: 0;
    grid-gap: 0;
  }

  &.light {
    background-color: var(--white);
    
    &:hover {
      background-color: var(--white);
    }
  }

  &.dark {
    background-color: var(--dark);
    
    &:hover {
      background-color: var(--dark);
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

.like-button {
  position: absolute;
  color: var(--danger);
}
</style>

<!-- TODO: reuse anything from mixin>? -->
<!-- import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, PLATFORMS } from '@/constants';

export default {
  IMAGE_SIZE_COVER_SMALL,
  getImageUrl,

  props: {
    listIndex: Number,
    list: {
      type: Object,
      default: () => {},
    },
    gameId: [String, Number],
  },

  computed: {
    ...mapState(['settings', 'cachedGames', 'tags', 'notes', 'progresses', 'board']),
    ...mapGetters(['isRTL', 'darkTheme']),

    gamePlatforms() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]);
    },

    gamePlatformsText() {
      return this.game?.platforms?.map((id) => PLATFORMS?.[id]?.name)?.join(', ');
    },

    showGameProgress() {
      return this.list?.showGameProgress && this.gameProgress > 0;
    },

    showReleaseDates() {
      return this.list?.showReleaseDates;
    },

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

    game() {
      return this.cachedGames[this.gameId];
    },
  },
}; -->
