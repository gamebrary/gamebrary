<template>
  <b-card
    :img-src="gameHeaderImage"
    img-alt="Image"
    img-top
    class="small mt-3"
    bg-variant="light"
    text-variant="dark"
  >
    <game-progress />

    <div v-if="gameGenres" class="pr-2 pb-2">
      <strong>Genres: </strong>

      <b-link
        v-for="(genre, index) in gameGenres"
        :key="genre.id"
      >
        <b-link :to="{ name: 'search', query: { genres: genre.id }}">{{ genre.name }}</b-link>
        <template v-if="index < gameGenres.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="gameModes" class="pr-2 pb-2">
      <strong>{{ $t('board.gameModal.gameModes') }}: </strong>

      <b-link
        v-for="(gameMode, index) in gameModes"
        :key="gameMode.id"
      >
        <b-link :to="{ name: 'search', query: { gameMode: gameMode.id }}">{{ gameMode.name }}</b-link>
        <template v-if="index < gameModes.length - 1">, </template>
      </b-link>
    </div>

    <div v-if="playerPerspectives" class="pr-2 pb-2">
      <strong>{{ $t('board.gameModal.perspective') }}: </strong>

      <b-link
        v-for="({ id, name }, index) in playerPerspectives"
        :key="id"
      >
        <b-link :to="{ name: 'search', query: { perspective: id }}">{{ name }}</b-link>
        <template v-if="index < playerPerspectives.length - 1">, </template>
      </b-link>
    </div>

    <div class="pr-2 pb-2">
      <strong>Available for: </strong>

      <span
        v-for="(platform, index) in gamePlatforms"
        :key="platform.id"
      >
        <b-link :to="{ name: 'search', query: { platforms: platform.id }}">{{ platform.name }}</b-link>
        <template v-if="index < gamePlatforms.length - 1">, </template>
      </span>
    </div>

    <!-- TODO: restore release dates -->
    <!-- <div class="pr-2 pb-2">
      <strong>{{ $t('board.gameModal.releaseDate') }}</strong>
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

    <div v-if="user" class="pr-2 pb-2">
      <strong>Found in: </strong>

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

    <div v-if="user" class="pr-2 pb-2">
      <strong>Tags: </strong>

      <b-link v-if="!tagsApplied.length" v-b-modal.gameTagsModal>
        Add tag
      </b-link>

      <br />

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

    <strong>Other links</strong>
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

    <b-button
      v-if="officialWebsiteUrl"
      class="mt-3"
      v-b-modal.officialWebsite
      block
      :title="officialWebsiteUrl"
      variant="secondary"
    >
      Official website
    </b-button>

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

  </b-card>
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

    gameHeaderImage() {
      return this.game?.steam?.header_image;
    },

    officialWebsiteUrl() {
      return this.gameLinks?.find(({ id }) => id === 'official')?.url;
    },

    gamePlatforms() {
      return this.game?.platforms;
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