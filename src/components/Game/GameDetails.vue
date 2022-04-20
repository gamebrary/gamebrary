<template lang="html">
  <div>
    <b-alert show variant="secondary" class="game-details">
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


      <ul class="timeline" v-if="releaseDates">
        {{ $t('board.gameModal.releaseDate') }}
        <li
          v-for="{ id, platform, date } in releaseDates"
          :key="id"
          class="event pb-2"
        >
          {{ date }} - {{ platform || 'N/A' }}
        </li>
      </ul>
    </b-alert>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters(['platformNames']),
    ...mapState(['game']),

    gameDevelopers() {
      return this.game?.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gamePublishers() {
      return this.game?.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company.name).join(', ')
        : null;
    },

    gameModes() {
      return this.game?.game_modes
        ? this.game.game_modes.map(({ name }) => name).join(', ')
        : null;
    },

    playerPerspectives() {
      return this.game?.player_perspectives
        ? this.game.player_perspectives.map(({ name }) => name).join(', ')
        : null;
    },

    releaseDates() {
      const releaseDates = this.game?.release_dates?.slice();

      const sortedActivities = releaseDates?.sort((a, b) => a.date - b.date);

      return sortedActivities?.map(({ platform, date, id }) => {
        return {
          id,
          platform: this.platformNames[platform].name,
          date: this.$dayjs.unix(date).format('MMMM D, YYYY'),
        };
      });
    },
  },
};
</script>
