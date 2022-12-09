<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'secondary' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    class="cursor-pointer"
  >
    <b-row no-gutters v-if="game && game.name">
      <b-card-body body-class="pt-0 pb-1 px-2">
        <small :class="`${highlightCompletedGame ? 'text-success' : ''}`">
          {{ game.name }}
        </small>

        <b-badge variant="warning" v-if="gameNotes">
          <i class="far fa-sticky-note fa-fw" />
        </b-badge>

        <b-progress
          v-if="gameProgress > 0"
          v-b-tooltip.hover
          :title="`${gameProgress}% Completed`"
          :value="gameProgress"
          :variant="gameProgress == 100 ? 'success' : 'primary'"
          class="float-right mt-2"
          style="width: 100px"
          height="8px"
        />

        <div v-if="tagsApplied.length">
          <b-button
            v-for="({ bgColor, textColor, name }) in tagsApplied"
            :key="name"
            rounded
            class="mr-1 mb-1 py-0 px-1"
            size="sm"
            variant="transparent"
            :style="`background-color: ${bgColor}; color: ${textColor}`"
          >
            <small>{{ name }}</small>
          </b-button>
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
