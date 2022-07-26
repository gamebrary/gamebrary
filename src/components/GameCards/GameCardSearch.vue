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
            v-if="activeList"
            @click="$emit('addToActiveList', game.id)"
          >
            Add
          </b-button>

          <b-button
            v-else
            @click="handleGameClick"
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
import { mapState } from 'vuex';

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
    activeList: Boolean,
  },

  computed: {
    ...mapState(['user']),

    coverUrl() {
      return getGameCoverUrl(this.game);
    },
  },

  methods: {
    handleGameClick() {
      console.log(this.user);

      // this.$bus.$emit('ADD_GAME', this.game.id);
    },
  },
};
</script>
