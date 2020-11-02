<template lang="html">
  <div>
    <b-jumbotron
      :header="$t('notes.title')"
      :lead="$t('notes.subtitle')"
      :bg-variant="nightMode ? 'dark' : ''"
      :text-variant="nightMode ? 'white' : ''"
      :border-variant="nightMode ? 'dark' : ''"
      header-level="5"
      fluid
    />

    <b-container>
      <!-- TODO: add skeleton -->
      <!-- TODO: finish search, include game title? -->
      <!-- <b-row class="mb-3">
        <b-form-input
          type="search"
          placeholder="Search notes"
          v-model="search"
        />
      </b-row> -->

      <b-row>
        <template v-if="loaded && games && notes">
          <b-card
            v-for="(note, gameId) in notes"
            :key="gameId"
            class="mb-3 w-100 note"
            :img-src="getCoverUrl(gameId)"
            :img-alt="games[gameId].name"
            img-left
          >
            <div v-if="games[gameId]">

              <h5>{{ games[gameId] && games[gameId].name ? games[gameId].name : '' }}</h5>

              <b-alert show variant="warning" class="mt-2">
                <vue-markdown :source="note.text ? note.text : note" />
              </b-alert>
            </div>

            <div v-else>
              ...
            </div>
          </b-card>

        </template>

        <b-card
          v-else
          v-for="n in 3"
          :key="n"
          no-body
          img-left
          class="w-100 mb-3"
        >
        <b-skeleton-img
          card-img="left"
          width="180px"
          height="240px"
        />

        <b-card-body>
          <b-skeleton />
          <b-skeleton />
        </b-card-body>
      </b-card>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    VueMarkdown,
  },

  data() {
    return {
      loaded: false,
      search: '',
    };
  },

  computed: {
    ...mapState(['notes', 'games']),
    ...mapGetters(['nightMode']),
  },

  mounted() {
    this.loadGames();
  },

  methods: {
    async loadGames() {
      const gamesList = Object.keys(this.notes).length
        ? Object.keys(this.notes).toString()
        : null;

      if (!gamesList) return;

      // TODO: get list of games that aren't currently cached

      await this.$store.dispatch('LOAD_BOARD_GAMES', gamesList)
        .catch(() => {
          this.$bvToast.toast('Error loading games', { title: 'Error', variant: 'error' });
        });

      this.loaded = true;
    },

    getCoverUrl(gameId) {
      const game = this.games[gameId];

      return game && game.cover && game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.note {
  img {
    align-self: baseline;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss">
img {
  max-width: 100%;
}
</style>
