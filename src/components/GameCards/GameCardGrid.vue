<template lang="html">
  <b-card
    no-body
    class="cursor-pointer text-center"
    :bg-variant="darkTheme ? 'secondary' : 'white'"
    :text-variant="darkTheme ? 'white' : 'dark'"
    img-top
  >
    <div class="position-relative cursor-pointer rounded align-self-end card overflow-hidden border-0 m-1">
      <b-img
        fluid
        :src="$options.getImageUrl(game)"
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

      <i
        v-if="tagsApplied.length"
        class="fas fa-tags position-absolute text-white tag-icon"
        v-b-tooltip.hover
        :title="`${tagsApplied.length} tags applied.`"
        aria-hidden
      />
    </div>

    <b-card-body body-class="p-2" v-if="game && game.name">
      <b-card-title
        :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
        title-tag="h5"
      >
        {{ game.name }}
      </b-card-title>

      <b-badge variant="warning" v-if="gameNotes">
        <i class="far fa-sticky-note fa-fw" />
      </b-badge>
    </b-card-body>
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag-icon {
  top: .5rem;
  right: .5rem;
}

.game-progress {
  position: absolute;
  bottom: 10px;
  left: 15px;
  width: calc(100% - 22px);
}
</style>
