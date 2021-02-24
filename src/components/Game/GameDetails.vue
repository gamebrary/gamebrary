<template lang="html">
  <b-alert show variant="secondary" class="game-details">
    <div v-if="platforms">
      <strong>{{ $t('board.gameModal.platforms') }}:</strong>
      <span class="text-wrap">{{ platforms }}</span>
    </div>

    <div v-if="genres">
      <strong>{{ $t('board.gameModal.genres') }}:</strong>
      <span class="text-wrap">{{ genres }}</span>
    </div>

    <div v-if="gameModes">
      <strong>{{ $t('board.gameModal.gameModes') }}:</strong>
      <span class="text-wrap">{{ gameModes }}</span>
    </div>

    <div v-if="gameDevelopers">
      <strong>{{ $t('board.gameModal.developers') }}:</strong>
      <span class="text-wrap">{{ gameDevelopers }}</span>
    </div>

    <div v-if="gamePublishers">
      <strong>{{ $t('board.gameModal.publishers') }}:</strong>
      <span class="text-wrap">{{ gamePublishers }}</span>
    </div>

    <div v-if="playerPerspectives">
      <strong>{{ $t('board.gameModal.perspective') }}:</strong>
      <span class="text-wrap">{{ playerPerspectives }}</span>
    </div>

    <div v-if="ageRatings">
      <strong>{{ $t('board.gameModal.ageRatings') }}:</strong>
      <span class="text-wrap">{{ ageRatings }}</span>
    </div>

    <div v-if="game.alternative_names">
      <strong>Also known as:</strong>
      <ul>
        <li
          v-for="alternativeName in game.alternative_names"
          :key="alternativeName.id"
        >
          {{ alternativeName.name }}
          {{ alternativeName.comment ? `(${alternativeName.comment})` : null }}
        </li>
      </ul>
    </div>

    <strong>{{ $t('board.gameModal.releaseDate') }}:</strong>
    <span class="text-wrap">
      <div v-for="releaseDate in releaseDates" :key="releaseDate">
        {{ releaseDate }}
      </div>
    </span>
  </b-alert>
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
        : null;
    },

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

    ageRatings() {
      return this.game && this.game.age_ratings
        ? this.game.age_ratings.map(({ category, rating }) => `${this.ageRating.categories[category]}: ${this.ageRating.values[rating]}`).join(', ')
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
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.game-details {
  font-size: small;
}
</style>

