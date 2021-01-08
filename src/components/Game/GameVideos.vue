<template lang="html">
  <div class="videos">
    <b-embed
      v-for="{ video_id } in videos"
      class="rounded mb-2"
      :key="video_id"
      type="iframe"
      aspect="16by9"
      :src="`https://www.youtube.com/embed/${video_id}`"
      allowfullscreen
    />
  </div>
</template>

<script>
export default {
  props: {
    videos: Array,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.videos {
  display: grid;
  grid-gap: 1rem;
}
</style>
