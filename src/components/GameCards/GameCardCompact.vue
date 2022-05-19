<template lang="html">
  <b-card
    no-body
    class="cursor-pointer"
  >
    <b-row no-gutters v-if="game && game.name">
      <b-col cols="3">
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
            :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
            title-tag="small"
          >
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <i class="far fa-sticky-note fa-fw" />
            </b-badge>
          </b-card-title>

          <br />

          <b-progress
            v-if="gameProgress > 0"
            :value="gameProgress"
            class="my-2"
            variant="success"
            height="6px"
          />

          <template v-if="showGameTags">
            <b-badge
              v-for="({ hex, tagTextColor }, name) in gameTags"
              :key="name"
              pill
              class="mr-1"
              variant="primary"
              tag="small"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
            >
              <small>{{ name }}</small>
            </b-badge>
          </template>
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
