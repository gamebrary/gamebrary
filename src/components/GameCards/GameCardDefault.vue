<!-- TODO: abstract styles, only add card specific styles in each component -->
<template lang="html">
  <b-card no-body class="mb-2">
    <b-row no-gutters class="game-card">
      <b-col md="4">
        <b-card-img
          :src="coverUrl"
          :alt="game.name"
          @click="openDetails"
        />
      </b-col>

      <b-col md="8">
        <b-card-body :title="game.name" title-tag="h6">
          <b-form-rating
            inline
            :value="Math.round((game.rating / 20) * 2) / 2"
            readonly
            variant="warning"
            size="sm"
            no-border
          />
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>

  <!-- <div v-if="gameId && games[gameId]" :class="gameCardClass">
    <div class="game-info">
      <span
        v-if="showReleaseDates && releaseDate"
        v-text="releaseDateText"
        class="release-date drag-filter"
      >
      </span>

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

      <div v-if="hasTags" class="game-tags drag-filter">
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
import GameProgress from '@/components/GameDetail/GameProgress';
import GameCardUtils from '@/components/GameCards/GameCard';
import Tag from '@/components/Tag';

export default {
  components: {
    GameProgress,
    Tag,
  },

  mixins: [GameCardUtils],
};
</script>
