<!-- DEPRECATED -->
<template lang="html">
  <div class="platforms">
    <div
      v-for="platform in platforms"
      :key="platform.name"
      :class="['platform', platform.code]"
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
  // @import "~styles/styles";
  .platform {
    padding: 1rem;
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    overflow: hidden;
    width: 180px;
    height: 100px;

    &.pc {
      img {
        width: 60px;
      }
    }

    &.clickable {
      cursor: pointer;
    }

    @media(max-width: 780px) {
      padding: .5rem;
      width: 100%;
      height: 60px;
    }

    img {
      width: 80%;
      height: auto;

      @media(max-width: 780px) {
        width: auto;
        height: 70px;
        max-height: 60%;
      }
    }

    .game-count {
      padding-top: .33rem;
      font-weight: bold;
      font-size: 12px;
      background: var(--primary-background);
      position: absolute;
      top: 0;
      right: 0;
      padding: 0 .25rem;
      color: var(--primary-text-color);
      font-size: 10px;
      border-bottom-left-radius: var(--border-radius);
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
