<template lang="html">
  <div v-if="game" class="mt-4 d-block">
    <b-button
      v-for="{ url, id, icon, svg } in links"
      :href="url"
      :key="id"
      :title="$t(`board.gameModal.links.${id}`)"
      v-b-tooltip.hover
      variant="transparent"
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
        :src="`/logos/companies/${id}.svg`"
      />

      <!-- <small>{{ $t(`board.gameModal.links.${id}`) }}</small> -->
    </b-button>
  </div>
</template>

<script>
import { LINKS_CATEGORIES } from '@/constants';

export default {
  props: {
    game: Object,
  },

  computed: {
    links() {
      return this.game?.websites?.map(({ url, category }) => {
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
