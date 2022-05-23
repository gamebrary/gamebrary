<template lang="html">
  <b-list-group flush>
    <game-genres />

    <b-list-group-item v-if="gameModes" class="p-2 small">
      <strong>{{ $t('board.gameModal.gameModes') }}: </strong>
      <span class="text-wrap">{{ gameModes }}</span>
    </b-list-group-item>

    <b-list-group-item v-if="gameDevelopers" class="p-2 small">
      <strong>{{ $t('board.gameModal.developers') }}: </strong>
      <span class="text-wrap">{{ gameDevelopers }}</span>
    </b-list-group-item>

    <b-list-group-item v-if="gamePublishers" class="p-2 small">
      <strong>{{ $t('board.gameModal.publishers') }}: </strong>
      <span class="text-wrap">{{ gamePublishers }}</span>
    </b-list-group-item>

    <b-list-group-item v-if="playerPerspectives" class="p-2 small">
      <strong>{{ $t('board.gameModal.perspective') }}: </strong>
      <span class="text-wrap">{{ playerPerspectives }}</span>
    </b-list-group-item>

    <b-list-group-item class="p-2 small">
      <strong>Available for: </strong>

      <span class="text-wrap">{{ gamePlatforms || 'N/A' }}</span>
    </b-list-group-item>

    <b-list-group-item class="p-2 small">
      <strong>{{ $t('board.gameModal.releaseDate') }}</strong>
      <ol v-if="releaseDates" class="list-unstyled mb-0">
        <li
          v-for="{ id, platform, date } in releaseDates"
          :key="id"
        >
          {{ date }} <span class="text-muted">{{ platform || 'N/A' }}</span>
        </li>
      </ol>

      <div v-else>
        Not released yet
      </div>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import GameGenres from '@/components/Game/GameGenres';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    GameGenres,
  },

  computed: {
    ...mapGetters(['platformNames']),
    ...mapState(['game']),

    gamePlatforms() {
      return this.game?.platforms?.map(({ name }) => name).join(', ');
    },

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
