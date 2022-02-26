<template lang="html">
  <div>
    <!-- <pre>{{ game.platforms }}</pre> -->
    <!-- <b-card>
      <b-img
        src="/static/logos/platforms-test/switch.png"
        width="200"
      />
    </b-card> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    ...mapGetters(['platformNames']),

    platforms() {
      return this.game && this.game.platforms
        ? this.game.platforms.map(({ name }) => name).join(', ')
        : null;
    },

    gameDevelopers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gamePublishers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gameModes() {
      return this.game && this.game.game_modes
        ? this.game.game_modes.map(({ name }) => name).join(', ')
        : null;
    },

    playerPerspectives() {
      return this.game && this.game.player_perspectives
        ? this.game.player_perspectives.map(({ name }) => name).join(', ')
        : null;
    },

    timeline() {
      const releaseDates = this.game && this.game.release_dates;
      const sortedActivities = releaseDates
        ? releaseDates.sort((a, b) => b.date - a.date)
        : [];

      return sortedActivities.length ? sortedActivities.map(releaseDate => ({
        ...releaseDate,
        platform: this.platformNames[releaseDate.platform] ? this.platformNames[releaseDate.platform].name : null,
        date: releaseDate.date ? this.$dayjs.unix(releaseDate.date).format('MMMM D, YYYY') : 'N/A',
      }))
        : null;
    },

    releaseDates() {
      const hasReleaseDates = this.game && this.game.release_dates;

      if (!hasReleaseDates) {
        return 'N/A';
      }

      const formattedReleaseDates = this.game.release_dates.map(({ platform, date }) => {
        const formattedDate = date
          ? this.$dayjs.unix(date).format('MMMM D, YYYY')
          : 'N/A';

        return this.platformNames[platform]
          ? `${this.platformNames[platform].name}: ${formattedDate}`
          : null;
      });

      return [...new Set(formattedReleaseDates)];
    },
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
