<template lang="html">
  <b-card
    no-body
    class="clickable"
    :img-src="coverUrl"
    :bg-variant="darkTheme ? 'dark' : ''"
    :text-variant="darkTheme ? 'white' : ''"
    img-top
  >
    <b-card-body body-class="p-2" v-if="game && game.name">
      <b-card-title
        :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
        title-tag="h6"
      >
        {{ game.name }}
      </b-card-title>

      <b-progress
        v-if="showGameProgress"
        :value="gameProgress"
        class="my-2"
        variant="success"
        height="6px"
      />

      <!-- <b-badge
        v-if="releaseDate"
        variant="secondary"
        class="mb-2"
      >
        Releases in
        {{ releaseDate }}
      </b-badge> -->

      <b-form-rating
        v-if="gameRating"
        :class="['p-0', { 'bg-dark': darkTheme }]"
        inline
        :value="gameRating"
        readonly
        variant="warning"
        size="sm"
        no-border
      />

      <template v-if="showGameTags">
        <b-badge
          v-for="({ games, hex, tagTextColor }, name) in tags"
          v-if="games.includes(game.id)"
          :key="name"
          pill
          variant="primary"
          tag="small"
          :style="`background-color: ${hex}; color: ${tagTextColor}`"
        >
          {{ name }}
        </b-badge>
      </template>

      <b-badge variant="warning" v-if="gameNotes">
        <i class="far fa-sticky-note fa-fw" />
      </b-badge>
    </b-card-body>
  </b-card>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
