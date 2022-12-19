<template lang="html">
  <div :class="['position-relative cursor-pointer rounded align-self-end card overflow-hidden mb-2', gameCompleted ? 'border-success completed' : 'border-0']">
    <b-img
      fluid
      :src="$options.getImageUrl(game)"
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

    <template v-if="gameNotes">
      <i
        class="fas fa-book note-indicator text-warning"
        v-b-tooltip.hover
        @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
        title="See game notes"
      />
    </template>

    <i
      v-if="tagsApplied.length"
      class="fas fa-tags position-absolute text-dark tag-icon"
      v-b-tooltip.hover
      :title="`${tagsApplied.length} Tag${tagsApplied.length > 1 ? 's' : ''} applied`"
      aria-hidden
    />
  </div>
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
  top: 5px;
  left: 5px;
  z-index: 1;
}

.completed {
  border-width: 3px;
}
</style>
