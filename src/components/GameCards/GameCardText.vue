<template lang="html">
  <b-card no-body class="clickable mb-2" @click="openDetails">
    <b-row no-gutters v-if="game && game.name">
        <b-card-body body-class="pt-0 pb-1 px-2">
          <small>
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <b-icon-file-earmark-text />
            </b-badge>
          </small>

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
            >
              {{ name }}
            </b-badge>
          </div>
        </b-card-body>
    </b-row>
  </b-card>
</template>

<script>
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
