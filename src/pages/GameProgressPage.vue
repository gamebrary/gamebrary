<template lang="html">
  <section>
    <b-container>
      <portal to="pageTitle">
        <div>
          <b-button
            :to="{ name: 'game', params: { id: game.id, slug: game.slug } }"
            variant="light"
            class="mr-2"
            >
              <i class="fa-solid fa-chevron-left" />
          </b-button>

          Track progress
        </div>
      </portal>


      <b-row>
        <b-col cols="12" sm="6">
          <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
            <b-img :src="gameCoverUrl" fluid rounded />
          </router-link>
        </b-col>

        <b-col cols="12" sm="6" class="mt-3 mt-sm-0 mb-3">
          <b-input-group :prepend="`${progress}%`" class="field mb-2">
            <b-form-input
              size="lg"
              v-model="progress"
              type="range"
              max="100"
              step="1"
            />
          </b-input-group>

          <b-button
            variant="primary"
            :disabled="saving"
            class="mr-2"
            @click="saveProgress"
          >
            <b-spinner small v-if="saving" />
            <span v-else>{{ $t('global.save') }}</span>
          </b-button>

          <b-button
            :disabled="deleting"
            variant="danger"
            @click="deleteProgress"
          >
            <b-spinner small v-if="deleting" />
            <i v-else class="fas fa-trash fa-fw" aria-hidden />
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      progress: 0,
      saving: false,
      deleting: false,
    };
  },

  computed: {
    ...mapState(['progresses', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },
  },

  mounted() {
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
      this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug }});
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
      this.$router.push({ name: 'game', params: { id: this.game.id, slug: this.game.slug }});
    },
  },
};
</script>
