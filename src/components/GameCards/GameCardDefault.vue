<template lang="html">
  <b-card no-body class="mb-2">
    <b-row no-gutters class="game-card" v-if="game && game.name">
      <b-col md="4">
        <b-card-img
          :src="coverUrl"
          :alt="game.name"
          @click="openDetails"
        />
      </b-col>

      <b-col md="8">
        <b-card-body body-class="p-2">
          <b-card-title class="mb-0" title-tag="h6" @click="openDetails">
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <b-icon-file-earmark-text />
            </b-badge>
          </b-card-title>

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
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
