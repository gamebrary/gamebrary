<template lang="html">
  <b-card no-body class="game-card mb-2" @click="openDetails">
    <b-row no-gutters v-if="game && game.name">
      <b-col md="4">
        <b-img-lazy
          fluid
          blank-color="#ccc"
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col md="8">
        <b-card-body body-class="p-2">
          <b-card-title
            class="mb-0"
            title-tag="h6"
          >
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
              class="mr-1"
              variant="primary"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
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
import GameCardUtils from '@/components/LegacyBoard/LegacyGameCard';

export default {
  mixins: [GameCardUtils],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "LegacyGameCard";
</style>
