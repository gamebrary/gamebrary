<template lang="html">
  <b-card no-body class="mb-2">
    <b-row no-gutters>
      <b-col cols="2">
        <b-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}">
          <b-card-img
            :src="coverUrl"
            alt="Image"
          />
        </b-link>
      </b-col>

      <b-col cols="10">
        <b-card-body :title="game.name" title-tag="h4">
          <b-button
            @click="addGameToList"
            variant="primary"
          >
            <i class="fa fa-plus fa-fw" aria-hidden="true" />
            Add to list
          </b-button>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { getGameCoverUrl } from '@/utils';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },

  computed: {
    coverUrl() {
      return getGameCoverUrl(this.game);
    }
  },

  methods: {
    addGameToList() {
      this.$bus.$emit('ADD_GAME', this.game.id);
    },
  },
};
</script>
