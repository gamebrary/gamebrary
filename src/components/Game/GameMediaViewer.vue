<!-- TODO: only show two rows, then show total count -->
<template lang="html">
  <div class="mt-3">
    <img
      v-for="({ imageUrl }, index) in gameMedia"
      v-show="index > 0"
      :key="index"
      :src="imageUrl"
      rounded
      height="80"
      class="mr-2 align-self-start mb-2 rounded cursor-pointer"
      @click="viewMedia(index)"
    />

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
          v-if="selectedMedia && selectedMedia.video"
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
          <pre class="bg-success">{{ activeIndex }}</pre>
          <b-img
            v-for="(media, index) in gameMedia"
            :key="media.imageUrl"
            :src="media.imageUrl"
            rounded
            style="height: 80px"
            :class="['cursor-pointer mr-2 align-self-start', { 'border-selected': activeIndex === index}]"
            @click="viewMedia(index)"
          />
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
      maxThumbnails: 3,
      saving: false,
    };
  },

  computed: {
    ...mapGetters(['isBoardOwner', 'gameMedia']),
    ...mapState(['board', 'game']),

    selectedMedia() {
      return this.gameMedia?.[this.activeIndex];
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
  grid-template-rows: 50vh auto;
}

.selected-image {
  justify-self: center;
}
</style>
