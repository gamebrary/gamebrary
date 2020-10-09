<template lang="html">
  <div>
    <dl class="row">
      <!-- TODO: plural vs singular translations? -->
      <dt class="col-sm-3">{{ $t('board.gameModal.platforms') }}</dt>
      <dd class="col-sm-9">{{ platforms }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.genres') }}</dt>
      <dd class="col-sm-9">{{ genres }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.gameModes') }}</dt>
      <dd class="col-sm-9">{{ gameModes }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.developers') }}</dt>
      <dd class="col-sm-9">{{ gameDevelopers }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.publishers') }}</dt>
      <dd class="col-sm-9">{{ gamePublishers }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.perspective') }}</dt>
      <dd class="col-sm-9">{{ playerPerspectives }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.timeToBeat') }}</dt>
      <dd class="col-sm-9">{{ timeToBeat }}</dd>

      <dt class="col-sm-3">{{ $t('board.gameModal.ageRatings') }}</dt>
      <dd class="col-sm-9">{{ ageRatings }}</dd>

      <!-- TODO: add release dates -->
      <!-- {{ $t('board.gameModal.releaseDate') }} -->
      <!-- <pre>{{ game.release_dates }}</pre> -->
    </dl>
  </div>
</template>

<script>
import moment from 'moment';

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
    genres() {
      return this.game && this.game.genres
        ? this.game.genres.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    timeToBeat() {
      return this.game && this.game.time_to_beat
        ? moment.unix(this.game.time_to_beat).format('h[h] m[m]')
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
  },
};
</script>
