<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'info' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    class="cursor-pointer"
  >
    <b-form-row v-if="game && game.name">
      <b-col cols="3">
        <b-img
          fluid
          blank-color="#ccc"
          :src="$options.getGameCoverUrl(game.cover.image_id)"
          :alt="game.name"
          class="rounded m-1"
        />
      </b-col>

      <b-col cols="9">
        <b-card-body body-class="p-2">
          <b-card-title
            :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
            title-tag="h5"
          >
            {{ game.name }}

            <b-badge variant="warning" v-if="gameNotes">
              <i class="far fa-sticky-note fa-fw" />
            </b-badge>
          </b-card-title>

          <br />

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
