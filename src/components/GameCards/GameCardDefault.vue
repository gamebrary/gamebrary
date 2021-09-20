<template lang="html">
  <b-card
    no-body
    bg-variant="light"
    class="card clickable"
  >
    <b-row
      no-gutters
      v-if="game && game.name"
    >
      <b-col cols="4">
        <b-img
          fluid
          blank-color="#ccc"
          :rounded="isRTL ? 'left' : 'right'"
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
          </b-card-title>

          <!-- <div class="game-info bg-dark">
            <small class="text-muted" v-if="gameProgress > 0">
              <i v-if="gameProgress == 100" class="fas fa-check fa-fw" aria-hidden />
              <span v-else>{{ gameProgress }}%</span>
            </small>
          </div> -->

          <b-badge variant="warning" v-if="gameNotes">
            <i class="far fa-sticky-note fa-fw" />
          </b-badge>

          <!-- <b-progress
            v-if="gameProgress > 0"
            :value="gameProgress"
            class="my-2"
            variant="success"
            height="6px"
          /> -->

          <b-badge variant="primary" v-if="showGameTags">
            <i class="fas fa-tags fa-fw" aria-hidden />
          </b-badge>

          <!-- TODO: use array filter instead of mixing v-for and v-if -->
          <!-- <div v-if="showGameTags">
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
          </div> -->
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>
