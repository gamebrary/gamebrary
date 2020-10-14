<template lang="html">
  <b-card
    no-body
    class="clickable mb-2"
    :img-src="coverUrl"
    :bg-variant="nightMode ? 'dark' : ''"
    :text-variant="nightMode ? 'white' : ''"
    img-top
    @click="openDetails"
  >
    <b-card-body body-class="p-2" v-if="game && game.name">
      <b-card-title class="mb-0" title-tag="h6">
        <icon
          name="verified"
          class="rounded bg-success p-1"
          white
          v-if="showCompletedBadge"
        />

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
        class="p-0 border-0 shadow-none"
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
        <icon name="note" />
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
