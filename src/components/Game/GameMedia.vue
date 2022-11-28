<template lang="html">
  <div class="mt-3">
    <b-row no-gutters>
      <div
        v-for="({ imageUrl, isVideo, isCover }, index) in gameMedia"
        :key="index"
      >
        <div
          class="mr-2 align-items-center text-center mb-2 rounded cursor-pointer position-relative"
        >
          <i
            v-if="isVideo"
            class="fa-solid fa-play video-indicator position-absolute text-white"
          />

          <div v-if="isCover" class="position-absolute cover-indicator text-light small w-100 bg-dark rounded-bottom">
            Cover
          </div>

          <b-img
            :src="imageUrl"
            rounded
            style="height: 180px"
            @click="viewMedia(index)"
          />
        </div>
      </div>
    </b-row>

    <b-modal
      id="mediaModal"
      centered
      hide-footer
      size="xl"
      :visible="visible"
      @show="open"
      @hidden="close"
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Screenshots and videos"
          @close="close"
        >
          <!-- TODO: restore set as wallpaper -->
          <!-- <b-button
            v-if="isBoardOwner"
            class="d-none d-sm-inline"
            variant="light"
            @click="setAsWallpaper"
          >
            <i
              v-if="saving"
              class="d-sm-fas fa-sync fa-spin fa-fw"
              aria-hidden
            />
            <span v-else>Set as wallpaper</span>
          </b-button> -->
        </modal-header>
      </template>

      <div v-if="selectedMedia && gameMedia.length" class="game-media">
        <b-embed
          v-if="isSelectedMediaVideo"
          type="iframe"
          aspect="16by9"
          :src="selectedMedia.videoUrl"
          allowfullscreen
        />

        <b-img
          v-else
          rounded
          class="selected-image align-center align-self-center mw-100 mh-100"
          :src="selectedMedia.imageUrl"
        />

        <footer class="mt-2 d-flex overflow-auto pb-2">
          <div
            v-for="({ imageUrl, isVideo, isCover }, index) in gameMedia"
            :key="index"
          >
            <div
              class="mr-2 align-items-center text-center mb-2 rounded cursor-pointer position-relative"
            >
              <i
                v-if="isVideo"
                class="fa-solid fa-play video-indicator position-absolute text-white"
              />

              <div v-if="isCover" class="position-absolute cover-indicator text-light small w-100 bg-dark rounded-bottom">
                Cover
              </div>

              <b-img
                :src="imageUrl"
                rounded
                style="height: 80px"
                @click="viewMedia(index)"
              />
            </div>
          </div>
          <!-- <b-img
            v-for="(media, index) in gameMedia"
            :key="media.imageUrl"
            :src="media.imageUrl"
            rounded
            style="height: 80px"
            :class="['cursor-pointer mr-2 align-self-start', { 'border-selected': activeIndex === index}]"
            @click="viewMedia(index)"
          /> -->
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  getGameCoverUrl,

  data() {
    return {
      activeIndex: null,
      saving: false,
    };
  },

  computed: {
    ...mapGetters(['isBoardOwner', 'gameMedia']),
    ...mapState(['board', 'game']),

    isSelectedMediaVideo() {
      return this.selectedMedia?.isVideo;
    },

    selectedMedia() {
      return this.gameMedia?.[this.activeIndex];
    },

    totalMedia() {
      return this.gameMedia?.length || 0;
    },

    visible() {
      return this.activeIndex !== null;
    },
  },

  methods: {
    open() {
      if (this.activeIndex === null) this.activeIndex = 0;
    },

    close() {
      this.activeIndex = null;
    },

    viewMedia(index) {
      this.activeIndex = index;
      this.$bvModal.show('mediaModal');
    },

    async setAsWallpaper() {
      // TODO: refactor and restore
      // this.saving = true;
      //
      // const payload = {
      //   ...this.board,
      //   backgroundUrl: this.slides[this.activeIndex - 1],
      // };
      //
      // this.$store.commit('SET_ACTIVE_BOARD', payload);
      //
      // await this.$store.dispatch('SAVE_BOARD')
      //   .catch(() => {
      //     this.saving = false;
      //
      //     this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
      //   });
      //
      // this.saving = false;
      // this.$bvToast.toast('Wallpaper set');
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-media {
  display: grid;
  grid-gap: 1rem;
  grid-template-rows: 1fr auto;
}

.selected-image {
  justify-self: center;
}

.video-indicator {
  left: calc(50% - 6px);
  top: calc(50% - 8px);
}

.cover-indicator {
  bottom: 0;
}

.media-button {
  padding: 21px 16px;
  height: 100%;
}
</style>
