<template lang="html">
  <div class="platforms">
    <div class="platform"
      v-for="platform in platforms"
      :key="platform.name"
      :style="`background-color: ${platform.hex || '#fff'}`"
      @click="changePlatform(platform)"
    >
      <img
        :src="`/static/img/platforms/logos/${platform.code}.svg`"
        :alt="platform.name"
      >

      <span v-if="hasLists(platform.code)" class="lists-indicator" />
    </div>
  </div>
</template>

<script>
import Masonry from 'masonry-layout';
import { mapState } from 'vuex';

let msnry = null;

export default {
  props: {
    platforms: Array,
  },

  computed: {
    ...mapState(['gameLists', 'settings']),
  },


  watch: {
    platforms() {
      this.$nextTick(() => {
        msnry.reloadItems();
        msnry.layout();
      });
    },
  },

  mounted() {
    this.initGrid();
  },

  methods: {
    hasLists(platform) {
      return Boolean(this.gameLists[platform] && this.gameLists[platform].length);
    },

    initGrid() {
      msnry = new Masonry('.platforms', {
        itemSelector: '.platform',
        gutter: 16,
      });
    },

    changePlatform(platform) {
      this.$store.commit('SET_PLATFORM', platform);
      this.$router.push({ name: 'game-board' });
    },

    showCount({ code }) {
      return this.gameCount && this.ownedPlatform(code) && this.getGameCount(code) > 0;
    },

    ownedPlatform(platformCode) {
      const isOwned = this.gameLists
      && this.gameLists[platformCode]
      && Object.keys(this.gameLists[platformCode]).length;

      return isOwned && this.clickable;
    },

    getGameCount(platform) {
      return this.gameLists[platform]
        .map(({ games }) => games.length)
        .reduce((totalCount, listCount) => totalCount + listCount);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";
  .platform {
    padding: $gp;
    display: flex;
    margin-bottom: $gp;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;
    overflow: hidden;
    width: 180px;
    height: 100px;

    &.clickable {
      cursor: pointer;
    }

    @media($small) {
      padding: $gp / 2;
      width: 100%;
      height: 60px;
    }

    img {
      width: 80%;
      height: auto;

      @media($small) {
        width: auto;
        height: 70px;
        max-height: 60%;
      }
    }

    .game-count {
      padding-top: $gp / 3;
      font-weight: bold;
      font-size: 12px;
      background: var(--primary-background);
      position: absolute;
      top: 0;
      right: 0;
      padding: 0 $gp / 4;
      color: var(--primary-text-color);
      font-size: 10px;
      border-bottom-left-radius: $border-radius;
    }
  }

  .lists-indicator {
    position: absolute;
    top: -15px;
    right: -20px;
    width: 40px;
    height: 30px;
    transform: rotate(45deg);
    background: red;
    border-bottom: 3px solid var(--body-background);
    background-color: #555;
  }
</style>
