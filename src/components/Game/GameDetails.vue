<template lang="html">
  <b-card class="mt-3 small">
    <!-- TODO: merge release Dates and platofmrs -->
    <div v-if="gameGenres" class="pr-2 pb-2">
      <strong>Genres:</strong>

      {{ gameGenres }}
    </div>

    <div v-if="gameModes" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.gameModes') }}: </strong>
      <span class="text-wrap">{{ gameModes }}</span>
    </div>

    <div v-if="gameDevelopers" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.developers') }}: </strong>
      <span class="text-wrap">{{ gameDevelopers }}</span>
    </div>

    <div v-if="gamePublishers" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.publishers') }}: </strong>
      <span class="text-wrap">{{ gamePublishers }}</span>
    </div>

    <div v-if="playerPerspectives" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.perspective') }}: </strong>
      <span class="text-wrap">{{ playerPerspectives }}</span>
    </div>

    <div class="pr-2 pb-2">
      <strong class="text-muted">Available for: </strong>

      <span class="text-wrap">{{ gamePlatforms || 'N/A' }}</span>
    </div>

    <div class="pr-2 pb-2">
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
    </div>

    <b-button
      v-for="{ url, id, icon, svg } in gameLinks"
      :href="url"
      :key="id"
      :title="$t(`board.gameModal.links.${id}`)"
      v-b-tooltip.hover
      variant="transparent"
      target="_blank"
      class="text-left p-1 m-0"
    >
      <i
        v-if="icon"
        :class="`${icon} fa-fw`"
        aria-hidden
      />

      <b-img
        v-else-if="svg"
        width="24"
        class="mr-1"
        :src="`/logos/companies/${id}.svg`"
      />
    </b-button>
  </b-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapGetters(['platformNames', 'gameLinks']),
    ...mapState(['game']),

    gamePlatforms() {
      return this.game?.platforms?.map(({ name }) => name).join(', ');
    },

    gameDevelopers() {
      return this.game?.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company?.name).join(', ')
        : null;
    },

    gamePublishers() {
      return this.game?.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company?.name).join(', ')
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

    gameGenres() {
      const gameGenres = this.game?.genres || [];

      return gameGenres.map((genre) => genre.name).join(', ');
    },

    releaseDates() {
      const releaseDates = this.game?.release_dates?.slice();

      const sortedActivities = releaseDates?.sort((a, b) => a.date - b.date);

      return sortedActivities?.map(({ platform, date, id }) => {
        return {
          id,
          platform: this.platformNames?.[platform]?.name,
          date: new Date(date * 1000).toLocaleDateString('en-US', { dateStyle: 'medium' }),
        };
      });
    },
  },
};
</script>
