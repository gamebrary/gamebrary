<template lang="html">
  <div v-if="game.videos" class="game-videos">
    <h3>Videos</h3>

    <div class="video">
      <iframe
        :src="`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&autohide=1`"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
      />
    </div>

    <div class="video-thumbnails">
      <a
        v-for="{ video_id } in game.videos"
        :key="video_id"
        class="thumbnail"
        @click="selectedVideo = video_id"
      >
        <img :src="`https://img.youtube.com/vi/${video_id}/default.jpg`" >
        <i v-if="youtubeVideoId !== video_id" class="fab fa-youtube fa-2x" />
      </a>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      selectedVideo: null,
    };
  },

  computed: {
    ...mapState(['game']),

    youtubeVideoId() {
      return this.selectedVideo || this.game.videos[0].video_id;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.game-videos {
  .video {
    position: relative;
    padding-bottom: 56.25%;
    margin: $gp 0;
    height: 56.25%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100% !important;
    }
  }

  .video-thumbnails {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    padding: 0;
    grid-gap: $gp;

    @media($small) {
      grid-template-columns: repeat(auto-fill, 70px);
    }

    .thumbnail {
      cursor: pointer;
      position: relative;

      img {
        width: 100%;
        height: auto;
      }

      i {
        position: absolute;
        color: #fff;
        opacity: 0.7;
        left: 34px;
        top: 23px;

        @media($small) {
          display: none;
        }
      }
    }
  }
}
</style>
