<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'dark' : 'white'"
    :text-variant="darkTheme ? 'white' : 'dark'"
    class="cursor-pointer"
  >
    <b-row no-gutters v-if="game && game.name">
      <b-card-body body-class="py-1 px-2">
        <h5 :class="{ 'text-success' : gameCompleted}">
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

          <b-link
            :class="['small', { 'text-warning': darkTheme }]"
            :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug }}"
            v-if="gameNotes"
          >
            Note
          </b-link>

          <b-link
            v-if="tagsApplied.length"
            :id="`${gameId}-${listIndex}`"
            :class="['small', { 'text-info': darkTheme }]"
          >
            {{ tagsApplied.length }} tags
          </b-link>

          <b-popover :target="`${gameId}-${listIndex}`" triggers="hover" placement="viewport">
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
          </b-popover>
        </div>
        <!-- <div class="d-flex mb-2" v-if="gamePlatformsText">
          <small>{{ gamePlatformsText }}</small>
        </div> -->
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
