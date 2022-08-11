<template lang="html">
  <b-container fluid>
    <portal to="pageTitle">
      <div>
        <b-button
          :to="gamePage"
          variant="light"
          class="mr-2"
          >
          <i v-if="showBackIcon" class="fa-solid fa-chevron-left" />
          <template v-else-if="game">
            {{ game.name }}
          </template>
        </b-button>

        Tags
      </div>
    </portal>

    <portal to="headerActions">
      <b-button
        :to="{ name: 'tags' }"
        variant="light"
        class="mr-2"
      >
        Manage tags
      </b-button>
    </portal>

    <div v-if="loading" class="text-center mt-5 ml-auto">
      <b-spinner/>
    </div>

    <b-row v-else>
      <b-col cols="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded class="mb-2 mr-2 field" />
        </router-link>
      </b-col>

      <b-col>
        <empty-state
          v-if="empty"
          class="mb-4"
          message="Looks like you don't have any tags yet."
        >
          <b-button @click="manageTags">Manage tags</b-button>
        </empty-state>

        <section class="field">
          <section>
            <h3 class="mb-3">Tags applied to {{ game.name }}</h3>

            <b-alert
              v-if="tagsSelected.length === 0"
              show
              variant="light"
            >
              No tags applied
            </b-alert>

            <b-button
              v-for="{ name, hex, tagTextColor } in tags"
              :key="name"
              rounded
              block
              variant="outline-light"
              :style="`background-color: ${hex}; color: ${tagTextColor}`"
              @click="removeTag"
            >
              {{ name }}
            </b-button>
          </section>

          <hr />

          <h3 class="my-3">Tags available</h3>

          <pre>{{ tags }}</pre>
          <!-- <b-button
            v-for="({ name, hex, tagTextColor }, index) in tags"
            :key="name"
            rounded
            block
            variant="outline-light"
            :disabled="saving"
            :style="`background-color: ${hex}; color: ${tagTextColor}`"
            @click="addTag(index)"
          >
            {{ name }}
          </b-button> -->
        </section>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';
import EmptyState from '@/components/EmptyState';

export default {
  components: {
    EmptyState,
  },

  data() {
    return {
      loading: true,
      saving: false,
    };
  },

  computed: {
    ...mapState(['tags', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    showBackIcon() {
      return this.game?.name.length > 25;
    },

    gamePage() {
      return { name: 'game', params: { id: this.game?.id, slug: this.game?.slug }};
    },

    empty() {
      return Object.keys(this.tags).length === 0;
    },

    tagsSelected() {
      return this.tags?.filter(({ games }) => {
        return games?.includes(this.game?.id);
      })
    },

    tagsAvailable() {
      return Object.entries(this.tags).map((t) => {
        const [name, tag] = t;

        return { name: name, ...tag };
      })
      .filter(({ games }) => {
        return !games.includes(this.game.id);
      })
    },
  },

  mounted() {
    if (this.game?.id !== this.$route.params.id) {
      this.loadGame();
    } else {
      this.loading = false;
    }
  },

  methods: {
    async loadGame() {
      this.loading = true;
      this.$store.commit('CLEAR_GAME');

      await this.$store.dispatch('LOAD_GAME', this.$route.params.id);
      await this.$store.dispatch('LOAD_TAGS')
        .catch(() => {
          this.loading = false;
        });

      this.loading = false;
    },

    async addTag(index) {
      console.log('add this tag');
      // TODO: use commit instead?
      // const gameId = this.game.id;
      //
      // if (!gameId) return;
      //
      // const tags = JSON.parse(JSON.stringify(this.tags)) ;
      //
      // tags[index].games.push(gameId)
      //
      // console.log(`game id ${gameId} should be included`, tags[index].games);

      // this.saving = true;

      // await this.$store.dispatch('SAVE_TAGS', tags)
      //   .catch((e) => {
      //     console.log(e);
      //   });

      // this.saving = false;

      // this.$store.commit('ADD_GAME_TAG', { tagName, gameId });
      // await this.saveTags();
    },

    async removeTag(tagName) {
      const gameId = this.game.id;

      // this.$store.commit('REMOVE_GAME_TAG', { tagName, gameId });
      // await this.saveTags();
    },

    manageTags() {
      this.$bvModal.hide('tags');
      this.$router.push({ name: 'tags' });
    },
  },
};
</script>
