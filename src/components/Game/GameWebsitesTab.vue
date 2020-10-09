<template lang="html">
  <div v-if="game.websites">
    <dl class="row mb-0" v-for="link in game.websites" :key="link.id">
      <!-- TODO: research which links can be leveraged to get API data,
       e.g. wikipedia article, wikia, etc -->
      <dt class="col-sm-3">{{ linkTypes[link.category]}}</dt>
      <dd class="col-sm-9"><a :href="link.url" target="_blank">{{ link.url }}</a></dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  data() {
    return {
      // TODO: GET THIS FROM https://api-v3.igdb.com/igdbapi.proto?
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
