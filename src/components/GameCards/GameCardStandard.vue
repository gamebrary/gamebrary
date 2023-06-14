<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'dark' : 'white'"
    :text-variant="darkTheme ? 'white' : 'dark'"
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
          :src="$options.getImageUrl(game, $options.IMAGE_SIZE_COVER_SMALL)"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="8">
        <b-card-body body-class="p-2">
          <b-card-title
            :class="`mb-2 ${gameCompleted ? 'text-success' : ''}`"
            title-tag="h3"
          >
            <b-avatar
              v-if="ranked"
              variant="light"
              class="mr-2"
              >
              {{ rank }}
            </b-avatar>

            {{ game.name }}
          </b-card-title>

          <!-- <div class="d-flex mb-2" v-if="gamePlatformsText">
            <small>{{ gamePlatformsText }}</small>
          </div> -->

          <b-badge variant="warning" v-if="gameNotes" class="mr-1">
            <i class="far fa-sticky-note fa-fw" />
          </b-badge>

          <b-badge
            v-if="gameProgress > 0"
            rounded
            variant="success"
            class="mr-1"
            size="sm"
          >
            <i v-if="gameProgress == 100" class="fas fa-check fa-fw" aria-hidden />
            <small v-else>{{ gameProgress }}%</small>
          </b-badge>

          <template v-if="tagsApplied.length">
            <b-button
              v-for="({ bgColor, textColor, name, index }) in tagsApplied"
              :key="index"
              rounded
              size="sm"
              variant="transparent"
              class="mr-2 mb-2"
              :style="`background-color: ${bgColor}; color: ${textColor}`"
              v-b-modal.gameTagsModal
            >
              {{ name }}
            </b-button>
          </template>
        </b-card-body>
      </b-col>
    </b-form-row>
  </b-card>
</template>

<script>
import gameCardMixin from '@/mixins/gameCardMixin';

export default {
  props: {
    ranked: Boolean,
    rank: Number,
  },

  mixins: [gameCardMixin],
};
</script>
