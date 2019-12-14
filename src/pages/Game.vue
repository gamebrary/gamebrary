<template lang="html">
  <div class="game">
    <header>
      <aside>
        <img :src="coverUrl" :alt="games[id].name" class="game-cover" />

        <!-- <div
          v-if="game && game.age_ratings"
          class="game-rating"
        >
          <img
            v-for="{ rating, synopsis, id } in game.age_ratings"
            :key="id"
            :src="`/static/img/age-ratings/${ageRatings[rating]}.png`"
            :alt="synopsis"
          >
        </div> -->
      </aside>

      <main>
        <div class="game-title">
          <h2>{{ games[id].name }}</h2>
          {{ platform.name }}

          <game-rating v-if="games[id].rating" :rating="games[id].rating" />
          <game-tags />

          <div class="actions">
            <button
              v-if="list.games.includes(id)"
              class="danger"
              @click="removeGame"
            >
              <i class="far fa-trash-alt delete-game" />
              {{ $t('gameDetail.removeFromList') }}
            </button>

            <button v-else class="primary" @click="addGame">
              {{ $t('list.addGame') }}
            </button>

            <div v-if="hasTags" class="tags">
              <button class="primary hollow" @click="openTags">
                <i class="fas fa-tag" />
                {{ $t('tags.addTag') }}
              </button>
            </div>
          </div>
        </div>

        <div class="details" v-if="game">
          <game-description />
          <game-notes />
          <game-details />
          <game-links />
          <game-videos />
          <game-screenshots />
          <igdb-credit gray />

          <!-- <section v-if="gamePlatforms && gamePlatforms.length > 0">
            <h4>{{ $t('gameDetail.gamePlatforms') }}</h4>

            <div class="platforms">
              <platform
                v-for="platform in gamePlatforms"
                :key="platform.name"
                :platform="platform"
              />
            </div>
          </section> -->
        </div>

        <placeholder v-else :lines="3" class="game-placeholder" />
      </main>
    </header>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import GameScreenshots from '@/components/GameDetail/GameScreenshots';
import GameNotes from '@/components/GameDetail/GameNotes';
import GameTags from '@/components/GameDetail/GameTags';
import GameRating from '@/components/GameDetail/GameRating';
import GameLinks from '@/components/GameDetail/GameLinks';
import GameDescription from '@/components/GameDetail/GameDescription';
import GameVideos from '@/components/GameDetail/GameVideos';
import GameDetails from '@/components/GameDetail/GameDetails';
import Placeholder from '@/components/Placeholder';
import IgdbCredit from '@/components/IgdbCredit';
import GameDetailPlaceholder from '@/components/GameDetail/GameDetailPlaceholder';

export default {
  components: {
    IgdbCredit,
    GameRating,
    GameLinks,
    GameDescription,
    Placeholder,
    GameScreenshots,
    GameNotes,
    GameTags,
    GameVideos,
    GameDetails,
    GameDetailPlaceholder,
  },

  props: {
    id: {
      type: [Number, String],
      default: null,
    },
    listId: {
      type: [Number, String],
      default: null,
    },
  },

  computed: {
    ...mapState(['game', 'user', 'platform', 'tags', 'gameLists', 'games']),
    ...mapGetters(['ageRatings', 'gamePlatforms', 'hasTags']),

    activePlatform() {
      return this.gameLists[this.platform.code];
    },

    list() {
      return this.activePlatform[this.listId];
    },

    coverUrl() {
      return this.games[this.id] && this.games[this.id].cover
        ? `https://images.igdb.com/igdb/image/upload/t_cover_small_2x/${this.games[this.id].cover.image_id}.jpg`
        : '/static/no-image.jpg';
    },
  },

  mounted() {
    this.loadGame(this.id);
  },

  methods: {
    openTags() {
      this.$bus.$emit('OPEN_TAGS', this.id);
    },

    loadGame(gameId) {
      this.$store.commit('CLEAR_ACTIVE_GAME');

      this.$store
        .dispatch('LOAD_GAME', gameId)
        .then(() => {
          if (this.game) {
            this.$ga.event({
              eventCategory: 'game',
              eventAction: 'view',
              eventLabel: 'gameViewed',
              eventValue: `${this.platform.name} - ${this.game.name}`,
            });

            document.title = `${this.game.name} (${this.platform.name}) - Gamebrary`;
          }
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Error loading game', type: 'error' });
        });
    },

    addGame() {
      const data = {
        listId: this.listId,
        gameId: this.game.id,
      };

      this.$emit('added');
      this.$store.commit('ADD_GAME', data);

      this.$ga.event({
        eventCategory: 'game',
        eventAction: 'add',
        eventLabel: 'addGame',
        eventValue: data,
      });

      this.$store.dispatch('SAVE_LIST', this.gameLists)
        .then(() => {
          this.$bus.$emit('TOAST', {
            message: `Added ${this.game.name} to list ${this.list.name}`,
            imageUrl: this.coverUrl,
          });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
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
          this.$bus.$emit('TOAST', {
            message: `Removed ${this.game.name} from list ${this.list.name}`,
            imageUrl: this.coverUrl,
          });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '~styles/styles';

header {
  display: grid;
  grid-template-columns: 180px auto;
  grid-gap: $gp;
  margin-top: $gp;

  @media ($small) {
    grid-template-columns: auto;
  }
}

aside {
  @media ($small) {
    text-align: center;
  }
}

.game-cover {
  border-radius: $border-radius;
}

.game-title {
  @media($small) {
    text-align: center;
    width: calc(100vw - #{$gp * 2});
  }
}

.actions {
  display: flex;
  align-items: center;

  @media($small) {
    justify-content: center;
  }

  button {
    margin-right: $gp / 2;
  }
}

.game-placeholder {
  margin-top: $gp;
}
</style>
