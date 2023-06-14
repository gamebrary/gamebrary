<template lang="html">
  <b-card
    no-body
    class="cursor-pointer text-center"
    :bg-variant="darkTheme ? 'dark' : 'white'"
    :text-variant="darkTheme ? 'white' : 'dark'"
    img-top
  >
    <div class="position-relative cursor-pointer rounded align-self-end card overflow-hidden border-0 m-1">
      <b-img
        fluid
        :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
      />

      <b-progress
        v-if="showGameProgress && !gameCompleted"
        v-b-tooltip.hover
        :title="`${gameProgress}% Completed`"
        :value="gameProgress"
        :variant="gameProgress == 100 ? 'success' : 'primary'"
        class="game-progress"
        height="8px"
      />

      <i
        v-if="tagsApplied.length"
        class="fas fa-tags position-absolute text-info tag-icon"
        v-b-tooltip.hover
        :title="`${tagsApplied.length} Tag${tagsApplied.length > 1 ? 's' : ''} applied`"
        aria-hidden
      />
    </div>

    <b-card-body body-class="px-2 pt-0 pb-1" v-if="game && game.name">
      <b-card-title
        title-tag="h5"
        class="mb-0"
      >
        {{ game.name }}
      </b-card-title>

      <template v-if="gameNotes">
        <i
          class="fas fa-book note-indicator text-warning"
          v-b-tooltip.hover
          @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
          title="See game notes"
        />
      </template>
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
  top: 5px;
  right: 5px;
}

.game-progress {
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: calc(100% - 10px);
}

.note-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}
</style>
