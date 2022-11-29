<template lang="html">
  <b-card
    no-body
    :bg-variant="darkTheme ? 'info' : 'white'"
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
          :src="$options.getImageUrl(game.cover.image_id)"
          :alt="game.name"
        />
      </b-col>

      <b-col cols="8">
        <b-card-body body-class="p-2">
          <b-card-title
            :class="`mb-0 ${highlightCompletedGame ? 'text-success' : ''}`"
            title-tag="p"
          >
            {{ game.name }}
          </b-card-title>

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

          <!-- TODO: show release dates -->
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
