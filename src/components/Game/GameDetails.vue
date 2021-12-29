<template lang="html">
  <b-alert show variant="secondary" class="game-details">
    <div v-if="platforms">
      <strong>{{ $t('board.gameModal.platforms') }}:</strong>
      <span class="text-wrap">{{ platforms }}</span>
    </div>

    <div v-if="genres">
      <strong>{{ $t('board.gameModal.genres') }}:</strong>
      <span class="text-wrap">{{ genres }}</span>
    </div>

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

    <div v-if="game.alternative_names">
      <strong>Also known as:</strong>
      <ul>
        <li
          v-for="alternativeName in game.alternative_names"
          :key="alternativeName.id"
        >
          {{ alternativeName.name }}
          {{ alternativeName.comment ? `(${alternativeName.comment})` : null }}
        </li>
      </ul>
    </div>

    <!-- Latest update -->
    <vue-timeline-update
      :date="new Date('2017-02-26')"
      title="v2.2.0 - Initial D"
      description="Today I am thrilled to announce the release of Vue.js 2.2.0."
      thumbnail="/images/vuetimeline/initial_d.jpg"
      category="announcement"
      icon="code"
      color="red"
    />

    <!-- Another update -->
    <vue-timeline-update
      :date="new Date('2016-11-22')"
      title="v2.1.0 - Hunter X Hunter"
      description="Today I am thrilled to announce the release of Vue.js 2.1.0."
      thumbnail="/images/vuetimeline/hunter_x_hunter.jpg"
      category="announcement"
      icon="code"
      color="turquoise"
    />

    <!-- Yet another update -->
    <vue-timeline-update
      :date="new Date('2016-09-30')"
      title="v2.0.0 - Ghost in the Shell"
      description="Today I am thrilled to announce the release of Vue.js 2.0.0"
      thumbnail="/images/vuetimeline/ghost_in_the_shell.jpg"
      category="announcement"
      icon="code"
      color="white"
      is-last
    />


    <ul class="list-unstyled">
      <b-media tag="li">
        <template #aside>
          <b-img blank blank-color="#abc" width="64" alt="placeholder"></b-img>
        </template>
        <h5 class="mt-0 mb-1">List-based media object</h5>
        <p class="mb-0">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </p>
      </b-media>

      <b-media tag="li" class="my-4">
        <template #aside>
          <b-img blank blank-color="#cba" width="64" alt="placeholder"></b-img>
        </template>

        <h5 class="mt-0 mb-1">List-based media object</h5>
        <p class="mb-0">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </p>
      </b-media>

      <b-media tag="li">
        <template #aside>
          <b-img blank blank-color="#bac" width="64" alt="placeholder"></b-img>
        </template>

        <h5 class="mt-0 mb-1">List-based media object</h5>
        <p class="mb-0">
          Cras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin.
          Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc
          ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
        </p>
      </b-media>
    </ul>


    <b-list-group>
      <b-list-group-item>Cras justo odio</b-list-group-item>
      <b-list-group-item>Dapibus ac facilisis in</b-list-group-item>
      <b-list-group-item>Morbi leo risus</b-list-group-item>
      <b-list-group-item>Porta ac consectetur ac</b-list-group-item>
      <b-list-group-item>Vestibulum at eros</b-list-group-item>
    </b-list-group>

    <strong>{{ $t('board.gameModal.releaseDate') }}:</strong>
    <span class="text-wrap">
      <div v-for="releaseDate in releaseDates" :key="releaseDate">
        {{ releaseDate }}
      </div>
    </span>
  </b-alert>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
  },

  computed: {
    ...mapGetters(['platformNames']),

    genres() {
      return this.game && this.game.genres
        ? this.game.genres.map(({ name }) => name).join(', ')
        : null;
    },

    platforms() {
      return this.game && this.game.platforms
        ? this.game.platforms.map(({ name }) => name).join(', ')
        : null;
    },

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

<style lang="scss" rel="stylesheet/scss" scoped>
.game-details {
  font-size: small;
}
</style>

