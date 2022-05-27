<template lang="html">
  <b-card
    no-body
    bg-variant="transparent"
    class="card cursor-pointer"
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
            title-tag="h4"
          >
            {{ game.name }}
          </b-card-title>

          <b-badge variant="warning" v-if="gameNotes" class="mr-1">
            <i class="far fa-sticky-note fa-fw" />
          </b-badge>

          <b-badge
            v-if="gameProgress > 0"
            rounded
            variant="success"
            class="mr-1"
            size="sm"
          >
            <i v-if="gameProgress == 100" class="fas fa-check fa-fw" aria-hidden />
            <small v-else>{{ gameProgress }}%</small>
          </b-badge>

          <template v-if="showGameTags">
            <b-badge
              v-for="({ hex, tagTextColor }, name) in gameTags"
              :key="name"
              pill
              class="mr-1"
              variant="primary"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
            >
              <small>{{ name }}</small>
            </b-badge>
          </template>

          <!-- TODO: show release dates -->
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
