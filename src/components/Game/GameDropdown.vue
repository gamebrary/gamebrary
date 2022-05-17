<template lang="html">
  <b-dropdown
    v-if="game.id"
    split
    :split-to="{ name: 'game', params: { id: game.id, slug: game.slug }}"
    split-class="p-0"
    right
    variant="dark"
  >
    <template #button-content>
      <b-avatar variant="transparent" :src="gameCoverUrl" rounded />

      <small class="text-white px-2 text-decoration-none">{{ game.name }}</small>
    </template>

    <!-- <b-button-group class="mx-1">
      <b-button variant="info">
        <i class="fa-solid fa-plus-minus" />
      </b-button>

      <b-button
        size="small"
        variant="info"
        :to="{ name: 'game.progress', params: { id: game.id } }"
      >
        <i class="fa-solid fa-bars-progress" />
      </b-button>
    </b-button-group> -->

    <b-dropdown-item :to="{ name: 'game.tags', params: { id: game.id, slug: game.slug } }">
      <i class="fa-solid fa-tags fa-fw" />
      Tags
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'game.progress', params: { id: game.id, slug: game.slug } }">
      <i class="fa-solid fa-bars-progress fa-fw" />
      Track progress
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }">
      <i class="fa-solid fa-note-sticky fa-fw" />
      Notes
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }">
      <i class="fa-solid fa-newspaper fa-fw" />
      News
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'game.media', params: { id: game.id, slug: game.slug } }">
      <i class="fa-solid fa-photo-film fa-fw" />
      Images / Videos
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState(['game']),
    ...mapGetters(['gameCoverUrl']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
