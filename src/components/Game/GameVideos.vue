<template lang="html">
  <b-tab v-if="game.videos">
    <template v-slot:title>
      Videos
      <b-badge>{{ game.videos.length }}</b-badge>
    </template>

    <b-embed
      v-for="{ video_id } in game.videos"
      :key="video_id"
      type="iframe"
      aspect="16by9"
      :src="`https://www.youtube.com/embed/${video_id}`"
      allowfullscreen
    />
  </b-tab>
</template>

<script>
export default {
  props: {
    game: Object,
  },
};
</script>
