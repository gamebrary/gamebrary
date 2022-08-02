
<template lang="html">
  <div>
    <portal v-if="user" to="headerActions">
      <b-button-group class="mr-2">
        <b-button @click="$bus.$emit('ADD_GAME', game.id)">
          <i class="fa-solid fa-plus fa-fw" />
          Add to list
        </b-button>

        <b-button :to="{ name: 'game.tags', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-tags fa-fw" />
          Tags
        </b-button>

        <b-button :to="{ name: 'game.progress', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-bars-progress fa-fw" />
          Track progress
        </b-button>

        <b-button :to="{ name: 'game.notes', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-note-sticky fa-fw" />
          Notes
        </b-button>

        <b-button :to="{ name: 'game.news', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-newspaper fa-fw" />
          News
        </b-button>

        <b-button :to="{ name: 'game.media', params: { id: game.id, slug: game.slug } }">
          <i class="fa-solid fa-photo-film fa-fw" />
          Images / Videos
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
