
<template lang="html">
  <div>
    <portal v-if="user" to="headerActions">
      <b-button-group class="mr-2">
        <b-button variant="light" @click="$bus.$emit('ADD_GAME', game.id)">
          <i class="fa-solid fa-plus fa-fw" />
          <span class="d-none d-lg-inline">Add to list</span>
        </b-button>

        <b-button variant="light" :to="{ name: 'game.tags', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-tags fa-fw" />
          <span class="d-none d-lg-inline">Tags</span>
        </b-button>

        <b-button variant="light" :to="{ name: 'game.progress', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-bars-progress fa-fw" />
          <span class="d-none d-lg-inline">Track progress</span>
        </b-button>

        <b-button variant="light" :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-note-sticky fa-fw" />
          <span class="d-none d-lg-inline">Notes</span>
        </b-button>

        <b-button variant="light" :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-newspaper fa-fw" />
          <span class="d-none d-lg-inline">News</span>
        </b-button>

        <b-button variant="light" :to="{ name: 'game.media', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-photo-film fa-fw" />
          <span class="d-none d-lg-inline">Images / Videos</span>
        </b-button>
      </b-button-group>
    </portal>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['game', 'user']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
