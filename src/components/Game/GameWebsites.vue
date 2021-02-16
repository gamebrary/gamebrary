<template lang="html">
  <b-alert
    v-if="game.websites"
    show
    variant="primary"
  >
    <strong>External links</strong>

    <br>

    <b-button
      v-for="link in game.websites"
      :href="link.url"
      :key="link.id"
      variant="link"
      class="px-0 mr-2"
      target="_blank"
    >
      {{ linkTypes[link.category]}}
      <!-- TODO: research which links can be leveraged to get API data,
       e.g. wikipedia article, wikia, etc -->
    </b-button>
  </b-alert>
</template>

<script>
// TODO: use constants
// import { LINKS_CATEGORIES } from '@/constants';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      linkTypes: {
        1: 'Official site',
        2: 'Wikia',
        3: 'Wikipedia',
        4: 'Facebook',
        5: 'Twitter',
        6: 'Twitch',
        8: 'Instagram',
        9: 'YouTube',
        10: 'iPhone',
        11: 'iPad',
        12: 'Android',
        13: 'Steam',
        14: 'Reddit',
        15: 'Itch',
        16: 'Epic Games',
        17: 'GOG',
        18: 'Discord',
      },
    };
  },
};
</script>
