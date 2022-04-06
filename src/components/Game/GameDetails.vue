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

      {{ $t('board.gameModal.releaseDate') }}

      <!-- <ul class="timeline">
        <li
          class="event pb-2"
          :data-date="releaseDate.date"
          :key="releaseDate.id"
          v-for="releaseDate in timeline"
        >
          {{ releaseDate.platform }}
          <pre>{{ releaseDate.date }}</pre>
        </li>
      </ul> -->
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

    // TODO: fix infinite loop
    // timeline() {
    //   const releaseDates = this.game && this.game.release_dates;
    //
    //   const sortedActivities = releaseDates
    //     ? releaseDates.sort((a, b) => b.date - a.date)
    //     : [];
    //
    //   console.log(sortedActivities);
    //
    //   return sortedActivities.length ? sortedActivities.map(releaseDate => ({
    //     ...releaseDate,
    //     platform: releaseDate.platform && this.platformNames[releaseDate.platform] ? this.platformNames[releaseDate.platform].name : null,
    //     date: releaseDate && releaseDate.date ? this.$dayjs.unix(releaseDate.date).format('MMMM D, YYYY') : 'N/A',
    //   }))
    //     : null;
    // },

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
