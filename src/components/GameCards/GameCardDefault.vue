<template lang="html">
  <b-card
    no-body
    class="card clickable"
    :bg-variant="darkTheme ? 'dark' : ''"
    :text-variant="darkTheme ? 'white' : ''"
  >
    <b-row
      no-gutters
      v-if="game && game.name"
    >
      <b-col cols="4">
        <!-- TODO: handle rtl -->
        <b-img
          fluid
          blank-color="#ccc"
          rounded="left"
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="8">
        <b-card-body body-class="p-2">
          <b-card-title
            :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
            title-tag="h6"
          >
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <i class="far fa-sticky-note fa-fw" />
            </b-badge>
          </b-card-title>

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

          <b-progress
            v-if="showGameProgress"
            :value="gameProgress"
            class="my-2"
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
import GameCardUtils from '@/components/GameCards/GameCard';

export default {
  mixins: [GameCardUtils],
};
</script>
