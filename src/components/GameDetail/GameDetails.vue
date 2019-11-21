<template lang="html">
  <div v-if="game" class="review-box">
    <div class="info">
      <section v-if="playerPerspectives">
        <strong>{{ $t('gameDetail.perspective') }}</strong>
        {{ playerPerspectives }}
      </section>

      <section v-if="timeToBeat">
        <strong>{{ $t('gameDetail.timeToBeat') }}</strong>
        {{ timeToBeat }}
      </section>

      <section v-if="gameModes">
        <strong>{{ $t('gameDetail.gameModes') }}</strong>
        {{ gameModes }}
      </section>

      <section v-if="genres">
        <strong>{{ $t('gameDetail.genres') }}</strong>
        {{ genres }}
      </section>

      <section v-if="developers">
        <strong>{{ $t('gameDetail.developers') }}</strong>
        {{ developers }}
      </section>

      <section v-if="publishers">
        <strong>{{ $t('gameDetail.publishers') }}</strong>
        {{ publishers }}
      </section>

      <section v-if="releaseDate">
        <strong>{{ $t('gameDetail.releaseDate') }}</strong>
        {{ moment.unix(releaseDate).format('ll') }}
      </section>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      moment,
    };
  },

  computed: {
    ...mapState(['game']),

    ...mapGetters([
      'playerPerspectives',
      'developers',
      'gameModes',
      'releaseDate',
      'genres',
      'publishers',
    ]),

    timeToBeat() {
      const momentDate = moment.unix(this.game.time_to_beat);

      return this.game && this.game.time_to_beat
        ? `${momentDate.format('h')}h ${momentDate.format('m')}m`
        : null;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "~styles/styles";

  .review-box {
    text-align: left;
    display: grid;
    margin: 0 auto;
    grid-gap: $gp;
    padding: $gp 0;
    align-items: center;

    strong {
      color: var(--accent-color);
    }

    section {
      margin-bottom: $gp / 3;
    }
  }
</style>
