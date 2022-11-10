<template lang="html">
  <b-card class="small">
    <game-progress />

    <div v-if="gameGenres" class="pr-2 pb-2">
      <strong class="text-muted">Genres: </strong>

      <b-link
        v-for="(genre, index) in gameGenres"
        :key="genre.id"
      >
        <b-link :to="{ name: 'search', query: { genres: genre.id }}">{{ genre.name }}</b-link>
        <template v-if="index < gameGenres.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="gameModes" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.gameModes') }}: </strong>

      <b-link
        v-for="(gameMode, index) in gameModes"
        :key="gameMode.id"
      >
        <b-link :to="{ name: 'search', query: { gameMode: gameMode.id }}">{{ gameMode.name }}</b-link>
        <template v-if="index < gameModes.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="gameDevelopers" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.developers') }}: </strong>

      <b-link
        v-for="({ company }, index) in gameDevelopers"
        :key="company.id"
      >
        <b-link :to="{ name: 'company', params: { id: company.id }}">{{ company.name }}</b-link>
        <template v-if="index < gameDevelopers.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="gamePublishers" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.publishers') }}: </strong>

      <b-link
        v-for="({ company }, index) in gamePublishers"
        :key="company.id"
      >
        <b-link :to="{ name: 'company', params: { id: company.id }}">{{ company.name }}</b-link>
        <template v-if="index < gamePublishers.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="playerPerspectives" class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.perspective') }}: </strong>

      <b-link
        v-for="({ id, name }, index) in playerPerspectives"
        :key="id"
      >
        <b-link :to="{ name: 'search', query: { perspective: id }}">{{ name }}</b-link>
        <template v-if="index < playerPerspectives.length - 1">, </template>
      </b-link>
    </div>

    <div class="pr-2 pb-2">
      <strong class="text-muted">Available for: </strong>

      <b-link
        v-for="(platform, index) in gamePlatforms"
        :key="platform.id"
      >
        <b-link :to="{ name: 'search', query: { platforms: platform.id }}">{{ platform.name }}</b-link>
        <template v-if="index < gamePlatforms.length - 1">, </template>
      </b-link>
    </div>

    <!-- TODO: merge release Dates and platforms -->
    <!-- <div class="pr-2 pb-2">
      <strong class="text-muted">{{ $t('board.gameModal.releaseDate') }}</strong>
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
    </div> -->

    <div v-if="user" class="pr-2 pb-2">
      <strong class="text-muted">Tags</strong>

      <br />

      <b-button
        v-for="({ bgColor, textColor, name, index }) in tagsApplied"
        :key="index"
        rounded
        size="sm"
        variant="transparent"
        class="mr-1 mb-2"
        :style="`background-color: ${bgColor}; color: ${textColor}`"
        :to="{ name: 'tag.edit', params: { id: index } }"
      >
        <i class="fa-solid fa-tag mr-1" />
        {{ name }}
      </b-button>

      <game-tags-dropdown />
    </div>

    <game-in-list v-if="user" />

    <strong class="text-muted">Other links</strong>
    <br>

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
import GameInList from '@/components/Game/GameInList';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsDropdown from '@/components/Game/GameTagsDropdown';

export default {
  components: {
    GameTagsDropdown,
    GameInList,
    GameProgress,
  },

  computed: {
    ...mapGetters(['platformNames', 'gameLinks']),
    ...mapState(['game', 'tags', 'user']),

    tagsApplied() {
      if (!this.tags) return [];

      return this.tags?.map((tag, index) => ({ ...tag, index }))
        .filter((tag) => tag?.games?.includes(this.game?.id));
    },

    gamePlatforms() {
      return this.game?.platforms;
    },

    gameDevelopers() {
      return this.game?.involved_companies?.filter(({ developer }) => developer);
    },

    gamePublishers() {
      return this.game?.involved_companies?.filter(({ publisher }) => publisher);
    },

    gameModes() {
      return this.game?.game_modes;
    },

    playerPerspectives() {
      return this.game?.player_perspectives;
    },

    gameGenres() {
      return this.game?.genres;
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

  async mounted() {
    if (!this.tags) {
      await this.$store.dispatch('LOAD_TAGS');
    }
  },
};
</script>
