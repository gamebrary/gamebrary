<template lang="html">
  <b-card
    no-body
    :bg-variant="cardBackgroundVariant"
    :text-variant="cardTextVariant"
    class="cursor-pointer"
  >
    <b-row no-gutters v-if="game && game.name">
      <b-card-body body-class="py-1 px-2">
        <h5>
          {{ game.name }}
        </h5>

        <div class="d-flex align-items-center">
          <b-badge
            v-if="showGameProgress && !gameCompleted"
            v-b-tooltip.hover
            variant="primary"
            class="mr-1"
          >
            {{ `${gameProgress}%` }}
          </b-badge>

          <template v-if="gameNotes">
            <i
              class="fas fa-book text-warning mr-1"
              v-b-tooltip.hover
              @click.stop.prevent="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug }})"
              title="See game notes"
            />
          </template>

          <template v-if="tagsApplied.length">
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
          </template>
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
