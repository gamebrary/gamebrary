<template lang="html">
  <div class="platform-list">
    <div
      class="platform"
      v-for="platform in platforms"
      :key="platform.id"
    >
      <a
        class="thumbnail"
        :style="`background-color: ${platform.hex || '#fff'}`"
        @click="changePlatform(platform)"
      >
        <img
          :src="`/static/img/platforms/logos/${platform.code}.svg`"
          :alt="platform.name"
        />

        <span v-if="hasLists(platform.code)" class="lists-indicator" />
      </a>

      <div class="platform-info">
        <h4>{{ platform.name }}</h4>
        {{ platform.releaseYear }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    platforms: Array,
  },

  computed: {
    ...mapState(['gameLists']),
  },

  methods: {
    changePlatform(platform) {
      this.$store.commit('SET_PLATFORM', platform);
      this.$router.push({ name: 'game-board' });
    },

    hasLists(platform) {
      return Boolean(this.gameLists[platform] && this.gameLists[platform].length);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .platform-list {
    display: grid;
    grid-template-columns: auto auto;

    @media($small) {
      grid-template-columns: auto;
    }
  }

  .platform {
    margin-bottom: $gp;
    display: grid;
    grid-template-columns: 200px auto;
    grid-gap: $gp;
  }

  .thumbnail {
    padding: $gp;
    border-radius: $border-radius;
    justify-content: center;
    text-align: center;
    display: flex;
    position: relative;
    overflow: hidden;

    &.has-lists {
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-color: transparent;
        border-style: solid;
      }

      &::after {
        border-width: $gp / 2;
        border-right-color: #555;
        border-top-color: #555;
      }
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

  img {
      max-width: 100%;
      align-self: center;
      max-height: 50px;
      border-radius: $border-radius;
  }

  .has-lists-badge {
    position: absolute;
    top: -11px;
    right: -13.5px;
    transform: rotate(45deg);
    color: #555;
  }
</style>
