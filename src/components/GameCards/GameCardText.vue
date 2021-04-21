<template lang="html">
  <b-card
    no-body
    bg-variant="dark"
    class="clickable"
  >
    <b-row no-gutters v-if="game && game.name">
        <b-card-body body-class="pt-0 pb-1 px-2">
          <small :class="`${highlightCompletedGame ? 'text-success' : ''}`">
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <i class="far fa-sticky-note fa-fw" />
            </b-badge>
          </small>

          <br />

          <b-progress
            v-if="showGameProgress"
            :value="gameProgress"
            class="my-1"
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
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>
