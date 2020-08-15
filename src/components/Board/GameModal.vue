<template lang="html">
  <b-modal
    id="game-modal"
    scrollable
    size="lg"
    header-bg-variant="light"
    footer-bg-variant="light"
    footer-class="p-2 justify-content-center"
    :title="title"
    @show="loadCachedGame"
    @shown="loadGame"
    @hidden="reset"
  >
    <b-container v-if="game">
      <b-row>
        <b-col lg="4">
          <b-img
            :src="coverUrl"
            :alt="title"
            rounded
            fluid
          />

          <b-progress
            v-if="progress"
            :value="progress"
            variant="success"
            height="8px"
            class="mt-2"
          />
        </b-col>

        <b-col lg="8" md="auto">
          <h3 class="mb-0">
            {{ title }}
          </h3>

          <h6>
            <b-badge
              v-if="releaseDate"
              variant="secondary"
            >
              Releases in
              {{ releaseDate }}
            </b-badge>
          </h6>

          <b-form-rating
            v-if="rating"
            class="p-0"
            inline
            :value="rating"
            readonly
            variant="warning"
            size="lg"
            no-border
          />

          <div v-if="gameTags">
            <b-badge
              v-for="({ games, hex, tagTextColor }, name) in tags"
              v-if="games.includes(game.id)"
              :key="name"
              pill
              variant="primary"
              tag="small"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
            >
              {{ name }}
            </b-badge>
          </div>

          <div class="mb-3">
            <b-button v-b-modal.progress variant="info">
              <b-icon-check />
            </b-button>

            <b-modal id="progress" title="Set game progress" ok-only @shown="setProgress">
              <b-input-group :prepend="`${localProgress}%`" class="mb-4" size="lg">
                <b-form-input
                  size="lg"
                  v-model="localProgress"
                  type="range"
                  max="100"
                  step="5"
                  @change="saveProgress"
                />
              </b-input-group>

              <b-button variant="danger" @click="deleteProgress">
                {{ $t('progresses.deleteProgress') }}
              </b-button>
            </b-modal>

            <b-button variant="warning">
              <b-icon-file-earmark-text />
            </b-button>

            <game-tags :game-id="game.id" />

            <b-button
              v-if="game && !list.games.includes(game.id)"
              :title="$t('list.addGame')"
              variant="success"
              @click="addGame"
            >
              <b-icon-plus />
            </b-button>

            <b-button
              v-else
              variant="danger"
              :title="$t('gameDetail.removeFromList')"
              @click="removeGame"
            >
              <b-icon-trash />
            </b-button>
          </div>

          <placeholder :lines="3" v-if="loading"/>
          <p v-else>{{ game.summary }}</p>
        </b-col>
      </b-row>

      <game-detail-placeholder v-if="loading" />

      <b-card v-else class="mt-4" no-body>
        <b-tabs card>
          <b-tab title="Game details" active>
            <dl class="row">
              <!-- TODO: plural vs singular translations? -->
              <dt class="col-sm-3">{{ $t('gameDetail.platforms') }}</dt>
              <dd class="col-sm-9">{{ platforms }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.genres') }}</dt>
              <dd class="col-sm-9">{{ genres }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.gameModes') }}</dt>
              <dd class="col-sm-9">{{ gameModes }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.developers') }}</dt>
              <dd class="col-sm-9">{{ gameDevelopers }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.publishers') }}</dt>
              <dd class="col-sm-9">{{ gamePublishers }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.perspective') }}</dt>
              <dd class="col-sm-9">{{ playerPerspectives }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.timeToBeat') }}</dt>
              <dd class="col-sm-9">{{ timeToBeat }}</dd>

              <dt class="col-sm-3">{{ $t('gameDetail.ageRatings') }}</dt>
              <dd class="col-sm-9">{{ ageRatings }}</dd>

              <!-- TODO: add release dates -->
              <!-- {{ $t('gameDetail.releaseDate') }} -->
              <!-- <pre>{{ game.release_dates }}</pre> -->
            </dl>
          </b-tab>

          <b-tab>
            <template v-slot:title>
              Notes
            </template>

            <vue-markdown v-if="hasNote" :source="notes[game.id].text" />
          </b-tab>

          <b-tab v-if="game.websites">
            <template v-slot:title>
              Links
              <b-badge>{{ game.websites.length }}</b-badge>
            </template>

            <dl class="row mb-0" v-for="link in game.websites" :key="link.id">
              <!-- TODO: research which links can be leveraged to get API data,
               e.g. wikipedia article, wikia, etc -->
              <dt class="col-sm-3">{{ linkTypes[link.category]}}</dt>
              <dd class="col-sm-9"><a :href="link.url" target="_blank">{{ link.url }}</a></dd>
            </dl>
          </b-tab>

          <b-tab v-if="game.videos">
            <template v-slot:title>
              Videos
              <b-badge>{{ game.videos.length }}</b-badge>
            </template>

            <b-embed
              v-for="{ video_id } in game.videos"
              :key="video_id"
              type="iframe"
              aspect="16by9"
              :src="`https://www.youtube.com/embed/${video_id}`"
              allowfullscreen
            />
          </b-tab>

          <b-tab v-if="screenshots">
            <template v-slot:title>
              Screenshots
              <b-badge>{{ screenshots.length }}</b-badge>
            </template>

            <!-- TODO: add placeholder image, use blank-src="placeholder.jpg" prop -->
            <!-- TODO: use blank-width prop? -->
            <!-- TODO: use blank-height prop? -->

            <b-img-lazy
              v-for="(screenshot, index) in screenshots"
              :key="index"
              :src="screenshot"
              fluid
              blank-color="#ccc"
              fluid-grow
              rounded
              class="mb-3"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>

    <template v-slot:modal-footer>
      <igdb-logo />
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment';
import { mapState, mapGetters } from 'vuex';
import VueMarkdown from 'vue-markdown';
import GameDetailPlaceholder from '@/components/GameDetail/GameDetailPlaceholder';
import GameTags from '@/components/GameDetail/GameTags';
import IgdbLogo from '@/components/IgdbLogo';
import Placeholder from '@/components/Placeholder';

export default {
  components: {
    Placeholder,
    GameTags,
    IgdbLogo,
    VueMarkdown,
    GameDetailPlaceholder,
  },

  data() {
    return {
      gameId: null,
      listId: null,
      localProgress: '',
      game: null,
      loading: true,
      // TODO: GET THIS FROM https://api-v3.igdb.com/igdbapi.proto?
      linkTypes: {
        1: 'Official site',
        2: 'Wikia',
        3: 'Wikipedia',
        4: 'Facebook',
        5: 'Twitter',
        6: 'Twitch',
        8: 'Instagram',
        9: 'YouTube',
        10: 'iPhone',
        11: 'iPad',
        12: 'Android',
        13: 'Steam',
        14: 'Reddit',
        15: 'Itch',
        16: 'Epic Games',
        17: 'GOG',
        18: 'Discord',
      },
      ageRating: {
        categories: {
          1: 'ESRB',
          2: 'PEGI',
        },
        values: {
          1: '3',
          2: '7',
          3: '12',
          4: '16',
          5: '18',
          6: 'RP',
          7: 'EC',
          8: 'E',
          9: 'E10',
          10: 'T',
          11: 'M',
          12: 'AO',
        },
      },
    };
  },

  computed: {
    ...mapState(['gameModalData', 'games', 'platform', 'progresses', 'tags', 'notes', 'gameLists']),
    ...mapGetters(['gameTags', 'gameProgress']),

    title() {
      return this.game && this.game.name;
    },

    activePlatform() {
      return this.gameLists[this.platform.code];
    },

    list() {
      return this.activePlatform[this.listId];
    },

    hasNote() {
      return this.notes && this.game && this.notes[this.game.id] && this.notes[this.game.id].text;
    },

    releaseDate() {
      const releaseDate = this.game
        && this.game.release_dates
        && this.game.release_dates.find(({ platform }) => this.platform.id === platform);

      const formattedDate = releaseDate && releaseDate.date
        ? moment.unix(releaseDate.date)
        : null;

      return moment(formattedDate).isAfter()
        ? formattedDate.toNow(true)
        : null;
    },

    progress() {
      const { game, platform, progresses } = this;

      return game
        && platform
        && progresses[platform.code]
        && progresses[platform.code][game.id];
    },

    genres() {
      return this.game && this.game.genres
        ? this.game.genres.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    screenshots() {
      return this.game && this.game.screenshots
        // eslint-disable-next-line
        ? this.game.screenshots.map(({ image_id }) => `https://images.igdb.com/igdb/image/upload/t_screenshot_huge/${image_id}.jpg`)
        : 'N/A';
    },

    platforms() {
      return this.game && this.game.platforms
        ? this.game.platforms.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    timeToBeat() {
      return this.game && this.game.time_to_beat
        ? moment.unix(this.game.time_to_beat).format('h[h] m[m]')
        : 'N/A';
    },

    gameDevelopers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ developer }) => developer)
          .map(({ company }) => company.name).join(', ')
        : 'N/A';
    },

    gamePublishers() {
      return this.game && this.game.involved_companies
        ? this.game.involved_companies
          .filter(({ publisher }) => publisher)
          .map(({ company }) => company.name).join(', ')
        : 'N/A';
    },

    gameModes() {
      return this.game && this.game.game_modes
        ? this.game.game_modes.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    playerPerspectives() {
      return this.game && this.game.player_perspectives
        ? this.game.player_perspectives.map(({ name }) => name).join(', ')
        : 'N/A';
    },

    ageRatings() {
      return this.game && this.game.age_ratings
        ? this.game.age_ratings.map(({ category, rating }) => `${this.ageRating.categories[category]}: ${this.ageRating.values[rating]}`).join(', ')
        : 'N/A';
    },

    coverUrl() {
      return this.game
        && this.game.cover
        && this.game.cover.image_id
        ? `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${this.game.cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },

    rating() {
      return this.game && this.game.rating
        ? Math.round((this.game.rating / 20) * 2) / 2
        : false;
    },
  },

  methods: {
    saveProgress() {
      /* eslint-disable */
      // this.$store.commit('SET_GAME_PROGRESS', this.localProgress);
      //
      // this.$store.dispatch('SAVE_PROGRESSES')
      //   .then(() => {
      //     this.$bvToast.toast('Progress updated', { title: 'Success', variant: 'success' });
      //   })
      //   .catch(() => {
      //     this.$bvToast.toast('There was an error saving your progress', { title: 'Error', variant: 'error' });
      //     this.$router.push({ name: 'sessionExpired' });
      //   });
    },

    setProgress() {
      this.localProgress = this.gameProgress
        ? JSON.parse(JSON.stringify(this.gameProgress))
        : '0';
    },

    addGame() {
      const data = {
        listId: this.listId,
        gameId: this.game.id,
      };

      // this.$emit('added');
      this.$store.commit('ADD_GAME', data);

      this.$ga.event({
        eventCategory: 'game',
        eventAction: 'add',
        eventLabel: 'addGame',
        eventValue: data,
      });

      this.$store.dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          // TODO: customize using cover image
          this.$bvToast.toast(`Added ${this.game.name} to list ${this.list.name}`, { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    removeGame() {
      const data = {
        listId: this.listId,
        gameId: this.game.id,
      };

      this.$store.commit('REMOVE_GAME', data);

      this.$store
        .dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          // TODO customize using cover
          this.$bvToast.toast(`Removed ${this.game.name} from list ${this.list.name}`, { title: 'Success', variant: 'success' });
        })
        .catch(() => {
          this.$bvToast.toast('Authentication error', { title: 'Error', variant: 'danger' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },

    loadCachedGame() {
      const { gameId, listId } = this.gameModalData;

      this.gameId = gameId;
      this.listId = listId;
      this.game = this.games[gameId];
    },

    async loadGame() {
      this.loading = true;
      const { gameId } = this.gameModalData;

      const game = await this.$store.dispatch('LOAD_GAME', gameId)
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Error loading game', { title: 'Error', variant: 'error' });
        });

      this.game = {
        ...this.game,
        ...game,
      };

      this.loading = false;

      this.$ga.event({
        eventCategory: 'game',
        eventAction: 'view',
        eventLabel: 'gameViewed',
        eventValue: `${this.platform.name} - ${this.game.name}`,
      });
    },

    reset() {
      this.gameId = null;
      this.listId = null;
      this.game = null;
      this.game = null;
    },

    async deleteProgress() {
      // this.$store.commit('REMOVE_GAME_PROGRESS');
      //
      // await this.$store.dispatch('SAVE_PROGRESSES_NO_MERGE')
      //   .catch(() => {
      //     this.$bvToast.toast('There was an error deleting your progress', { title: 'Error', variant: 'error' });
      //     this.$router.push({ name: 'sessionExpired' });
      //   });
      //
      // this.$bvToast.toast('Progress deleted', { title: 'Success', variant: 'success' });
      // this.$refs.progressModal.close();
    },
  },
};
</script>
