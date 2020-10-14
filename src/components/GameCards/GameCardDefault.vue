<template lang="html">
  <b-card
    no-body
    class="clickable mb-2"
    :bg-variant="nightMode ? 'dark' : ''"
    :text-variant="nightMode ? 'white' : ''"
    @click="openDetails"
  >
    <b-row
      no-gutters
      v-if="game && game.name"
    >
      <b-col cols="4">
        <icon
          name="verified"
          white
          class="position-absolute rounded bg-success p-1 m-1"
          v-if="showCompletedBadge"
        />

        <b-img
          fluid
          blank-color="#ccc"
          :src="coverUrl"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="8">
        <b-card-body body-class="p-2">
          <b-card-title
            class="mb-0"
            title-tag="h6"
          >
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <icon name="note" />
            </b-badge>
          </b-card-title>

          <br />

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
