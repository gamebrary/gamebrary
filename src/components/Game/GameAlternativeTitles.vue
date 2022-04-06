<template lang="html">
  <div v-if="game.alternative_names">
    <strong class="small link" v-b-toggle.altTitles variant="light">{{ game.alternative_names.length }} Alternative titles</strong>

    <b-collapse id="altTitles">
      <div
        class="mb-1 small"
        rounded
        variant="light"
        v-for="alternativeName in game.alternative_names"
        :key="alternativeName.id"
      >
        <b-avatar
          v-b-tooltip.hover
          :title="alternativeName.comment || null"
          size="sm"
          :src="`/static/img/country-flags/${getCountryCode(alternativeName.comment)}.svg`"
        />

        {{ alternativeName.name }}
      </div>
    </b-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['game']),
  },

  methods: {
    getCountryCode(alternateTitleDescription) {
      if (!alternateTitleDescription) return 'un';

      const description = alternateTitleDescription.toLowerCase();

      if (description.includes('japanese')) return 'jp';
      if (description.includes('korean')) return 'kr';
      if (description.includes('portuguese')) return 'pt';
      if (description.includes('brazilian')) return 'br';
      if (description.includes('spanish')) return 'es';
      if (description.includes('french')) return 'fr';
      if (description.includes('italian')) return 'it';
      if (description.includes('arabic')) return 'sa';
      if (description.includes('polish')) return 'pl';
      if (description.includes('russian')) return 'ru';
      if (description.includes('chinese')) return 'cn';
      if (description.includes('german')) return 'de';
      if (description.includes('dutch')) return 'nl';
      if (description.includes('european')) return 'eu';

      return 'un';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
