<template lang="html">
  <div class="position-relative cursor-pointer rounded align-self-end card overflow-hidden border-0 mb-2">
    <b-img
      fluid
      :src="$options.getImageUrl(game.cover.image_id)"
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
</style>
