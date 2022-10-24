d<template lang="html">
  <b-card class="mt-3 small">

    <div v-if="gameGenres" class="pr-2 pb-2">
      <strong class="text-muted">Genres:</strong>

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

      <span
        v-for="(platform, index) in gamePlatforms"
        :key="platform.id"
      >
        <b-link :to="{ name: 'platform', params: { id: platform.id }}">{{ platform.name }}</b-link>
        <template v-if="index < gamePlatforms.length - 1">, </template>
      </span>
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

    <div class="pr-2 pb-2">
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

      <game-tags-dropdown v-if="user" />
    </div>

    <game-in-list />

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
import GameTagsDropdown from '@/components/Game/GameTagsDropdown';

export default {
  components: {
    GameTagsDropdown,
    GameInList,
  },

  data() {
    return {
      progress: 0,
      saving: false,
      deleting: false,
    }
  },

  computed: {
    ...mapGetters(['platformNames', 'gameLinks']),
    ...mapState(['game', 'tags', 'user', 'progresses']),

    tagsApplied() {
      if (!this.tags) return [];

      return this.tags?.map((tag, index) => ({ ...tag, index }))
        .filter((tag) => tag?.games?.includes(this.game?.id));
    },

    gamePlatforms() {
      return this.game?.platforms;
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

  async mounted() {
    if (!this.tags) {
      await this.$store.dispatch('LOAD_TAGS');
    }

    this.progress = this.progresses?.[this.game?.id]
      ? JSON.parse(JSON.stringify(this.progresses?.[this.game?.id]))
      : 0;
  },

  methods: {
    async deleteProgress() {
      const { id, name } = this.game;

      this.deleting = true;

      this.$store.commit('REMOVE_GAME_PROGRESS', id);

      await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
        .catch(() => {
          this.$bvToast.toast('There was an error deleting your progress', { title: `${name} progress`, variant: 'error' });
          this.deleting = false;
        });

      this.deleting = false;
    },

    async saveProgress() {
      this.saving = true;

      this.$store.commit('SET_GAME_PROGRESS', {
        progress: this.progress,
        gameId: this.game?.id,
      });

      await this.$store.dispatch('SAVE_PROGRESSES')
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error saving your progress', { variant: 'error' });
        });

      this.saving = false;
    },
  },
};
</script>
