<template lang="html">
  <b-card
    no-body
    class="clickable mb-2"
    :bg-variant="nightMode ? 'dark' : ''"
    :text-variant="nightMode ? 'white' : ''"
  >
    <b-row no-gutters v-if="game && game.name">
      <b-col cols="3">
        <i
          v-if="showCompletedBadge"
          class="far fa-check-circle position-absolute text-white bg-success m-1 rounded"
          aria-hidden
        />

        <b-img
          fluid
          blank-color="#ccc"
          :src="coverUrl"
          :alt="game.name"
          class="rounded-0"
        />
      </b-col>

      <b-col cols="9">
        <b-card-body body-class="p-2">
          <b-card-title
            class="mb-0"
            title-tag="small"
          >
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <i class="far fa-sticky-note"></i>
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
            :class="['p-0', { 'bg-dark': nightMode }]"
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
              variant="primary"
              tag="small"
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
