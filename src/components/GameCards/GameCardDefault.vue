<template lang="html">
  <b-card
    no-body
    :bg-variant="cardBackgroundVariant"
    :text-variant="cardTextVariant"
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
          v-if="showGameProgress && !gameCompleted"
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
          <p class="mb-1">
            {{ game.name }}
          </p>

          <template v-if="tagsApplied.length">
            <b-button
              v-for="({ bgColor, textColor, name }) in tagsApplied"
              :key="name"
              rounded
              class="mr-2 mb-1 p-0 px-2"
              size="sm"
              variant="transparent"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
            >
              <small>{{ name }}</small>
            </b-button>
          </template>

          <template v-if="gameNotes">
            <i
              class="fas fa-book note-indicator text-warning"
              v-b-tooltip.hover
              @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
              title="See game notes"
            />
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

.note-indicator {
  position: absolute;
  bottom: 8px;
  right: 14px;
  z-index: 1;
}
</style>