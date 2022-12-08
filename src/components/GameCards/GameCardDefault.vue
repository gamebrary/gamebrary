<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'secondary' : 'white'"
    :text-variant="darkTheme ? 'white' : 'dark'"
    class="cursor-pointer"
  >
    <b-form-row
      v-if="game && game.name"
    >
      <b-col cols="4">
        <b-img
          fluid
          blank-color="#ccc"
          class="m-1"
          rounded
          :src="$options.getImageUrl(game)"
          :alt="game.name"
        />

        <b-progress
          v-if="gameProgress > 0"
          v-b-tooltip.hover
          :title="`${gameProgress}% Completed`"
          :value="gameProgress"
          :variant="gameProgress == 100 ? 'success' : 'primary'"
          class="game-progress"
          height="8px"
        />
      </b-col>

      <b-col cols="8">
        <b-card-body body-class="p-2">
          <b-card-title
            :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
            title-tag="p"
          >
            {{ game.name }}
          </b-card-title>

          <b-badge variant="warning" v-if="gameNotes" class="mr-1">
            <i class="far fa-sticky-note fa-fw" />
          </b-badge>

          <template v-if="tagsApplied.length">
            <b-button
              v-for="({ bgColor, textColor, name }) in tagsApplied"
              :key="name"
              rounded
              class="mr-2 mb-2 p-0 px-2"
              size="sm"
              variant="transparent"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
            >
              <small>{{ name }}</small>
            </b-button>
          </template>
        </b-card-body>
      </b-col>
    </b-form-row>
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>

<style scoped>
.game-progress {
  position: absolute;
  bottom: 10px;
  left: 15px;
  width: calc(100% - 22px);
}
</style>