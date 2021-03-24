<!-- TODO: limit platform search to board platforms, allow to change -->
<!-- TODO: show tip to edit board if need to change platforms -->

<template lang="html">
  <b-tab title="Recent games">
    <b-button
      v-if="board.platforms.length > 1"
      v-b-modal.recentGamesPlatforms
      class="mb-2 ml-auto"
    >
      <i class="fas fa-sliders-h fa-fw" aria-hidden />
    </b-button>

    <b-modal
      id="recentGamesPlatforms"
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          title="Change platforms to display"
          :subtitle="board.name"
          @close="close"
        />
      </template>

      <platform-toggle-field @change="reload" />

      <b-alert
        show
        class="mt-2 mb-0"
      >
        Missing something?

        <b-button variant="link" v-b-modal:board-settings>
          Edit board
        </b-button>
      </b-alert>
    </b-modal>

    <game-card-recent
      v-for="{ id } in filteredRecentGames"
      :key="id"
      class="mb-2"
      :game-id="id"
      :list="list"
    />
  </b-tab>
</template>

<script>
import GameCardRecent from '@/components/GameCards/GameCardRecent';
import PlatformToggleField from '@/components/PlatformToggleField';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    GameCardRecent,
    PlatformToggleField,
  },

  props: {
    list: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      recentGames: null,
      platforms: [],
    };
  },

  computed: {
    ...mapState(['board']),
    ...mapGetters(['darkTheme']),

    filteredRecentGames() {
      return this.recentGames
        ? this.recentGames.filter(({ id }) => !this.list.games.includes(id))
        : [];
    },
  },

  mounted() {
    this.platforms = JSON.parse(JSON.stringify(this.board.platforms));

    this.loadRecentGames();
  },

  methods: {
    reload(updatedPlatforms) {
      this.platforms = JSON.parse(JSON.stringify(updatedPlatforms));
      this.loadRecentGames();
    },

    loadRecentGames() {
      const payload = {
        sortQuery: 'first_release_date desc',
        platforms: this.platforms.join(','),
      };

      this.$store.dispatch('CUSTOM_SEARCH', payload)
        .then((data) => {
          this.recentGames = data;
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
