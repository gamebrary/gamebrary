<template lang="html">
  <dl>
    <dt class="w-100">{{ $t('board.gameModal.platforms') }}</dt>
    <dd class="text-wrap">{{ platforms }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.genres') }}</dt>
    <dd class="text-wrap">{{ genres }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.gameModes') }}</dt>
    <dd class="text-wrap">{{ gameModes }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.developers') }}</dt>
    <dd class="text-wrap">{{ gameDevelopers }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.publishers') }}</dt>
    <dd class="text-wrap">{{ gamePublishers }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.perspective') }}</dt>
    <dd class="text-wrap">{{ playerPerspectives }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.ageRatings') }}</dt>
    <dd class="text-wrap">{{ ageRatings }}</dd>

    <dt class="w-100">{{ $t('board.gameModal.releaseDate') }}</dt>
    <dd class="text-wrap">
      <div v-for="releaseDate in releaseDates" :key="releaseDate">
        {{ releaseDate }}
      </div>
    </dd>
  </dl>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  data() {
    return {
      ageRating: {
        categories: {
          1: 'ESRB',
          2: 'PEGI',
        },
        values: {
          1: '3',
          2: '7',
          3: '12',
          4: '16',
          5: '18',
          6: 'RP',
          7: 'EC',
          8: 'E',
          9: 'E10',
          10: 'T',
          11: 'M',
          12: 'AO',
        },
      },
    };
  },

  computed: {
    ...mapGetters(['platformNames']),

    genres() {
      return this.game && this.game.genres
        ? this.game.genres.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    platforms() {
      return this.game && this.game.platforms
        ? this.game.platforms.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    gameDevelopers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company.name).join(', ')
        : 'N/A';
    },

    gamePublishers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company.name).join(', ')
        : 'N/A';
    },

    gameModes() {
      return this.game && this.game.game_modes
        ? this.game.game_modes.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    playerPerspectives() {
      return this.game && this.game.player_perspectives
        ? this.game.player_perspectives.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    ageRatings() {
      return this.game && this.game.age_ratings
        ? this.game.age_ratings.map(({ category, rating }) => `${this.ageRating.categories[category]}: ${this.ageRating.values[rating]}`).join(', ')
        : 'N/A';
    },

    releaseDates() {
      const hasReleaseDates = this.game && this.game.release_dates;

      if (!hasReleaseDates) {
        return 'N/A';
      }

      const formattedReleaseDates = this.game.release_dates.map(({ platform, date }) => {
        const formattedDate = new Date(date).toLocaleDateString('en-US');

        return `${this.platformNames[platform].name}: ${formattedDate}`;
      });

      return [...new Set(formattedReleaseDates)];
    },
  },
};
</script>
