<template lang="html">
  <div class="game-detail">
    <header>
      <aside>
        <img
          :src="coverUrl"
          :alt="games[id].name"
          class="game-cover"
        >

        <div
          v-if="game && game.age_ratings"
          class="game-rating"
        >
          <img
            v-for="{ rating, synopsis, id } in game.age_ratings"
            :key="id"
            :src="`/static/img/age-ratings/${ageRatings[rating]}.png`"
            :alt="synopsis"
          >
        </div>
      </aside>

      <article>
        <h2>{{ games[id].name }}</h2>
        {{ platform.name }}

        <game-rating v-if="games[id].rating" :rating="games[id].rating" />

        <div v-if="game" class="details">

          <p class="game-description" v-html="game.summary" />

          <div class="actions">
            <button
              v-if="list.games.includes(game.id)"
              class="danger"
              @click="removeGame"
            >
              <i class="far fa-trash-alt delete-game" />
              {{ $t('gameDetail.removeFromList') }}
            </button>

            <button v-else class="primary">
              {{ $t('list.addGame') }}
            </button>

            <div v-if="hasTags" class="tags">
              <button class="primary hollow" @click="openTags">
                <i class="fas fa-tag" />
                {{ $t('tags.addTag') }}
              </button>
            </div>
          </div>

          <game-notes />

          <section v-if="gamePlatforms && gamePlatforms.length > 0">
            <h4>{{ $t('gameDetail.gamePlatforms') }}</h4>

            <div class="platforms">
              <platform
                v-for="platform in gamePlatforms"
                :key="platform.name"
                :platform="platform"
              />
            </div>
          </section>

          <tag
            v-for="({ games, hex, tagTextColor }, name) in tags"
            v-if="games.includes(game.id)"
            :key="name"
            :label="name"
            :hex="hex"
            :text-hex="tagTextColor"
            readonly
            @action="openTags"
            @close="removeTag(name)"
          />

          <igdb-credit gray />

          <div class="tabs">
            <span v-for="{ value, icon, text } in tabs" :key="value">
              <label :for="value" :class="{ active: value === tab }">
                <i :class="icon" />
                {{ text }}
              </label>

              <input
                :id="value"
                :value="value"
                v-model="tab"
                type="radio"
              />
            </span>
          </div>

          <component :is="activeComponent" />
        </div>

        <placeholder
          v-else
          :lines="3"
        />
      </article>
    </header>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Tag from '@/components/Tag';
import GameScreenshots from '@/components/GameDetail/GameScreenshots';
import GameNotes from '@/components/GameNotes';
import GameRating from '@/components/GameDetail/GameRating';
import GameLinks from '@/components/GameDetail/GameLinks';
import GameVideos from '@/components/GameDetail/GameVideos';
import GameDetails from '@/components/GameDetail/GameDetails';
import Platform from '@/components/Platforms/Platform';
import Placeholder from '@/components/Placeholder';
import IgdbCredit from '@/components/IgdbCredit';
import GameDetailPlaceholder from '@/components/GameDetail/GameDetailPlaceholder';

export default {
  components: {
    IgdbCredit,
    Tag,
    GameRating,
    GameLinks,
    Placeholder,
    GameScreenshots,
    GameNotes,
    Platform,
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

  data() {
    return {
      tab: 'details',
      tabs: [
        {
          value: 'details',
          icon: 'fab fa-youtube',
          text: 'Details',
          component: 'GameDetails',
        },
        {
          value: 'videos',
          icon: 'fab fa-youtube',
          text: 'Videos',
          component: 'GameVideos',
        },
        {
          value: 'screenshots',
          icon: 'fas fa-images',
          text: 'Screenshots',
          component: 'GameScreenshots',
        },
        {
          value: 'links',
          icon: 'fas fa-link',
          text: 'Links',
          component: 'GameLinks',
        },
      ],
    };
  },

  computed: {
    ...mapState(['game', 'user', 'platform', 'tags', 'gameLists', 'games']),
    ...mapGetters(['ageRatings', 'gamePlatforms']),

    hasTags() {
      return Object.keys(this.tags) && Object.keys(this.tags).length > 0;
    },

    activeComponent() {
      const activeTab = this.tabs.find(tab => tab.value === this.tab);

      return activeTab ? activeTab.component : '';
    },

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
    removeTag(tagName) {
      this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId: this.game.id });
      this.$bus.$emit('SAVE_TAGS', this.tags);
    },

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

.actions {
  display: flex;
  align-items: center;

  button {
    margin-right: $gp / 2;
  }
}

.platforms {
  margin-top: $gp;
  display: flex;
  flex-wrap: wrap;

  .platform {
    width: 90px;
    height: 50px;
    margin-right: $gp / 2;
    padding: $gp / 4;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
