<template>
  <div>
    <game-progress />

    <div v-if="gameGenres">
      <h4 class="mt-4">Genres: </h4>

      <b-link
        v-for="(genre, index) in gameGenres"
        :key="genre.id"
      >
        <b-link :to="{ name: 'search', query: { genres: genre.id }}">{{ genre.name }}</b-link>
        <template v-if="index < gameGenres.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="gameModes">
      <h4 class="mt-4">{{ $t('board.gameModal.gameModes') }}: </h4>

      <b-link
        v-for="(gameMode, index) in gameModes"
        :key="gameMode.id"
      >
        <b-link :to="{ name: 'search', query: { gameMode: gameMode.id }}">{{ gameMode.name }}</b-link>
        <template v-if="index < gameModes.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="playerPerspectives">
      <h4 class="mt-4">{{ $t('board.gameModal.perspective') }}: </h4>

      <b-link
        v-for="({ id, name }, index) in playerPerspectives"
        :key="id"
      >
        <b-link :to="{ name: 'search', query: { perspective: id }}">{{ name }}</b-link>
        <template v-if="index < playerPerspectives.length - 1">, </template>
      </b-link>
    </div>

    <!-- TODO: restore release dates -->
    <!-- <div>
      <h4 class="mt-4">{{ $t('board.gameModal.releaseDate') }}</h4>
      <ol v-if="releaseDates" class="list-unstyled mb-0">
        <li
          v-for="{ id, platform, date } in releaseDates"
          :key="id"
        >
          {{ date }} <span>{{ platform || 'N/A' }}</span>
        </li>
      </ol>

      <div v-else>
        Not released yet
      </div>
    </div> -->

    <div v-if="user">
      <h4 class="mt-4">Found in: </h4>

      <b-link v-if="!boardsWithGame.length" v-b-modal.addRemoveGameModal>
        Add to list
      </b-link>

      <span
        v-for="(board, index) in boardsWithGame"
        :key="board.id"
      >
        <b-link :to="{ name: 'board', params: { id: board.id } }">{{ board.name }}</b-link>
        <template v-if="index !== boardsWithGame.length - 1">, </template>
      </span>


      <add-remove-game />
    </div>

    <div v-if="user">
      <h4 class="mt-4">Tags: </h4>

      <b-link v-if="!tagsApplied.length" v-b-modal.gameTagsModal>
        Add tag
      </b-link>

      <b-button
        v-for="({ bgColor, textColor, name, index }) in tagsApplied"
        :key="index"
        rounded
        size="sm"
        variant="transparent"
        class="mr-1 mb-2"
        :style="`background-color: ${bgColor}; color: ${textColor}`"
        v-b-modal.gameTagsModal
      >
        <i class="fa-solid fa-tag mr-1" />
        {{ name }}
      </b-button>

      <game-tags-modal />
    </div>

    <h4 class="mt-4">Other links</h4>

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

    <b-link
      v-if="officialWebsiteUrl"
      v-b-modal.officialWebsite
      :title="officialWebsiteUrl"
    >
      Official website
    </b-link>

    <b-modal
      id="officialWebsite"
      size="xl"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Official website"
          :subtitle="game.name"
          @close="close"
        >
          <b-button :href="officialWebsiteUrl" target="_blank">
            Open in new tab
          </b-button>
        </modal-header>
      </template>

      <b-embed
        type="iframe"
        aspect="16by9"
        class="official-site-modal rounded"
        :src="officialWebsiteUrl"
        allowfullscreen
      />
    </b-modal>

  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import GameProgress from '@/components/Game/GameProgress';
import GameTagsModal from '@/components/Game/GameTagsModal';
import AddRemoveGame from '@/components/AddRemoveGame';

export default {
  components: {
    AddRemoveGame,
    GameTagsModal,
    GameProgress,
  },

  computed: {
    ...mapGetters(['platformNames', 'gameLinks', 'darkTheme']),
    ...mapState(['game', 'tags', 'user', 'board', 'boards']),

    tagsApplied() {
      if (!this.tags) return [];

      return this.tags?.map((tag, index) => ({ ...tag, index }))
        .filter((tag) => tag?.games?.includes(this.game?.id));
    },

    boardsWithGame() {
      return this.boards?.filter(({ lists }) => lists?.some(({ games }) => games?.includes(this.game?.id))) || [];
    },

    // TODO: find a good use for game header image
    // gameHeaderImage() {
    //   return this.game?.steam?.header_image;
    // },

    officialWebsiteUrl() {
      return this.gameLinks?.find(({ id }) => id === 'official')?.url;
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

<style scoped>
.official-site-modal {
  height: calc(100vh - 8rem);
}
</style>