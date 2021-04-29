<template lang="html">
  <div v-if="game.websites" class="my-4">
    External links:

    <div :class="['links', { grid }]">
      <b-button
        v-for="{ url, id, icon, svg } in links"
        :href="url"
        :key="id"
        target="_blank"
        class="text-left p-1 m-0"
      >
        <i
          v-if="icon"
          :class="`${icon} fa-fw`"
          aria-hidden
        />

        <b-img
          v-else-if="svg"
          width="24"
          class="mr-1"
          :src="`/static/logos/companies/${id}.svg`"
        />

        <small>{{ $t(`board.gameModal.links.${id}`) }}</small>
      </b-button>
    </div>
  </div>
</template>

<script>
import { LINKS_CATEGORIES } from '@/constants';

export default {
  props: {
    game: Object,
    grid: Boolean,
  },

  computed: {
    links() {
      return this.game.websites.map(({ url, category }) => {
        const link = {
          url,
          ...LINKS_CATEGORIES[category],
        };

        return link;
      });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.links {
  display: grid;
  // grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5px;

  &.grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  // @media(max-width: 780px) {
  // }
}
</style>
