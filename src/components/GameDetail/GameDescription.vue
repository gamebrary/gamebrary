
<template lang="html">
  <div class="game-description" @click="expand">
    <h3>Game description</h3>
    <p :class="{ collapsed }">
      {{ game.summary }}
    </p>

    <a class="read-more" v-if="collapsed">Read more</a>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      expanded: false,
      characterLimit: 500,
    };
  },

  computed: {
    ...mapState(['game']),

    collapsed() {
      return !this.expanded && this.game.summary && this.game.summary.length > this.characterLimit;
    },
  },

  methods: {
    expand() {
      if (this.collapsed) {
        this.expanded = true;
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~styles/styles";

.game-description {
  margin: $gp 0;
}

p {
  line-height: 1.4rem;
  font-size: 16px;
  letter-spacing: .01em;

  &.collapsed {
    margin-bottom: $gp / 2;

    @media($small) {
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 6;
      -webkit-box-orient: vertical;
    }
  }
}

.read-more {
  display: none;

  @media($small) {
    display: inline;
  }
}
</style>

