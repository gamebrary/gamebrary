<template lang="html">
  <b-card
    no-body
    class="cursor-pointer text-center"
    img-top
  >
    <div class="m-1">
      <b-card-img
        :src="coverUrl"
        alt="Image"
        class="rounded"
      />
    </div>

    <b-card-body body-class="p-2" v-if="game && game.name">
      <b-card-title
        :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
        title-tag="h4"
      >
        {{ game.name }}
      </b-card-title>

      <b-progress
        v-if="gameProgress > 0"
        :value="gameProgress"
        class="my-2"
        variant="success"
        height="6px"
      />

      <template v-if="tagsApplied.length">
        <b-badge
          v-for="({ bgColor, textColor, name }) in tagsApplied"
          :key="name"
          rounded
          class="mr-1"
          variant="transparent"
          :style="`background-color: ${bgColor}; color: ${textColor}`"
        >
          <small>{{ name }}</small>
        </b-badge>
      </template>

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
