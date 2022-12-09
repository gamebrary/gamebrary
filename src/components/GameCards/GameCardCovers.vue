<template lang="html">
  <div class="position-relative cursor-pointer rounded align-self-end card overflow-hidden border-0 mb-2">
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
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  mixins: [gameCardMixin],
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.tag-icon {
  bottom: .25rem;
  right: .25rem;
}

.game-progress {
  position: absolute;
  bottom: 10px;
  left: 15px;
  width: calc(100% - 22px);
}
</style>
