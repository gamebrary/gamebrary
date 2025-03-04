<template lang="html">
  <div
    v-if="game"
    class="game-card position-relative rounded cursor-pointer"
    :class="[
      {
        vertical,
        small,
        slim,
        highlighted: highlightedGame === gameId,
        'semi-transparent': transparencyEnabled,
      },
      darkTheme ? 'dark text-light' : 'light',
    ]"
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
          :class="vertical && fluid ? '' : 'mw-100'"
          :width="small ? '96' : null"
          :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
          :alt="game.name"
        />

        <GameRibbon v-if="!hideRibbon" :game="game" />
      </div>
    </div>

    <aside>
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


      <h4
        v-if="!hideTitle || hideCover"
        :class="['text-wrap',
          {
            'text-success' : gameCompleted, 'mb-1': board.type !== $options.BOARD_TYPE_GRID,
            'mt-2': vertical,
          }
        ]"
      >
        <b-avatar
          v-if="ranked"
          :variant="darkTheme ? 'warning' : 'success'"
          rounded
          size="sm"
          class="d-inline-block"
        >
          {{ rank }}
        </b-avatar>

        {{ game.name }}
      </h4>

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
    <b-img
      :alt="String(gameId)"
      blank-color="#ccc"
      rounded
      class="mw-100"
      src="/placeholder.gif"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import { IMAGE_SIZE_COVER_SMALL, PLATFORMS, BOARD_TYPE_GRID } from '@/constants';
import GameRibbon from '@/components/GameRibbon';
import slugify from 'slugify';

export default {
  IMAGE_SIZE_COVER_SMALL,
  BOARD_TYPE_GRID,
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
      fluid: Boolean,
  },

  components: {
    GameRibbon,
  },

  computed: {
    ...mapState(['settings', 'cachedGames', 'tags', 'notes', 'progresses', 'board', 'games', 'user', 'highlightedGame']),
    ...mapGetters(['isRTL', 'darkTheme', 'transparencyEnabled']),

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

      const id = this.gameId || this.game.id;
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
  transition: background-color 300ms linear, transform 0.3s ease, box-shadow 0.3s ease, opacity 0.2s ease;
  padding: 0.5rem;

  // TODO: add dragging effecty, tilt or similar
  // &.dragging {
  // }

  &.ghost {
    .like-button {
      display: none;
    }

    aside {
      opacity: 0.5;
    }

    img {
      opacity: 0.2;
      filter: grayscale(90%);
    }
  }

  &.slim {
    padding: 0;
    grid-gap: 0;
  }

  &.highlighted {
    background-color: var(--success) !important;
    color: var(--dark) !important;

    &.slim::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 4px solid var(--success);
      z-index: 2;
      pointer-events: none;
    }
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
