<template lang="html">
  <b-card no-body class="mb-2">
    <b-row no-gutters class="game-card" v-if="game && game.name">
        <b-card-body body-class="pt-0 pb-1 px-2">
          <small>
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <b-icon-file-earmark-text />
            </b-badge>
          </small>


          <b-badge
            v-if="releaseDate"
            variant="secondary"
            class="mb-2"
          >
            Releases in
            {{ releaseDate }}
          </b-badge>

          <b-form-rating
            v-if="gameRating"
            class="p-0"
            inline
            :value="gameRating"
            readonly
            variant="warning"
            size="sm"
            no-border
          />

          <b-progress
            v-if="gameProgress"
            :value="gameProgress"
            variant="success"
            height="6px"
          />


          <div v-if="showGameTags">
            <b-badge
              v-for="({ games, hex, tagTextColor }, name) in tags"
              v-if="games.includes(game.id)"
              :key="name"
              pill
              variant="primary"
              tag="small"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
              @click="openTags"
            >
              {{ name }}
            </b-badge>
          </div>
        </b-card-body>
    </b-row>
  </b-card>
  <!-- <div v-if="gameId && games[gameId]" :class="gameCardClass">
    <div class="game-info">
      <a v-text="game.name" class="drag-filter" @click="openDetails"/>
      <i class="fas fa-grip-vertical draggable-icon game-drag-handle" />

      <span
        v-if="showReleaseDates && releaseDate"
        v-text="releaseDateText"
        class="release-date drag-filter"
      >
      </span>

      <game-rating
        v-if="showGameRatings && list.view !== 'covers'"
        :rating="game.rating"
        small
        class="drag-filter"
        @click.native="openDetails"
      />

      <game-progress
        v-if="gameProgress"
        small
        :progress="gameProgress"
        class="drag-filter"
        @click.native="openDetails"
      />

      <i
        v-if="note"
        :title="note"
        class="fas fa-sticky-note note drag-filter"
        @click="openDetails"
      />

      <div
        v-if="gameTags"
        class="game-tags drag-filter"
>
        <div
          v-for="({ games, hex, tagTextColor }, name) in tags"
          v-if="games.includes(game.id)"
          :key="name"
        >
          <tag
            v-if="games.includes(game.id)"
            :label="name"
            :hex="hex"
            :text-hex="tagTextColor"
            readonly
            @action="openTags"
          />
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import GameRating from '@/components/GameDetail/GameRating';
import GameCardUtils from '@/components/GameCards/GameCard';
import Tag from '@/components/Tag';

export default {
  components: {
    GameRating,
    Tag,
  },

  mixins: [GameCardUtils],
};
</script>
