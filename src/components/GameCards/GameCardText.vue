<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'info' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    class="cursor-pointer"
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
          v-if="gameProgress > 0"
          :value="gameProgress"
          class="my-1"
          variant="success"
          height="6px"
        />

        <template v-if="tagsApplied.length">
          <b-badge
            v-for="({ bgColor, textColor, name }) in tagsApplied"
            :key="name"
            rounded
            class="mr-1"
            variant="transparent"
            :style="`background-color: ${bgColor}; color: ${textColor}`"
          >
            <small>{{ name }}</small>
          </b-badge>
        </template>
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
