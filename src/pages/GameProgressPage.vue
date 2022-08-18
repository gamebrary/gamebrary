<template lang="html">
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
      <b-col cols="6">
        <router-link :to="{ name: 'game', params: { id: game.id, slug: game.slug }}" class="float-right">
          <b-img :src="gameCoverUrl" fluid rounded />
        </router-link>
      </b-col>

      <b-col>
        <b-input-group :prepend="`${localProgress}%`" class="field mb-2">
          <b-form-input
            size="lg"
            v-model="localProgress"
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
</template>

<script>
import { mapState } from 'vuex';
import { getGameCoverUrl } from '@/utils';

export default {
  data() {
    return {
      localProgress: 0,
      saving: false,
      deleting: false,
      value: 45,
      max: 100,
    };
  },

  computed: {
    ...mapState(['progresses', 'game']),

    gameCoverUrl() {
      return getGameCoverUrl(this.game);
    },

    title() {
      return this.localProgress
        ? 'Update progress'
        : 'Set progress';
    },
  },

  mounted() {
    this.setGameProgress();
  },

  methods: {
    show() {
      this.setGameProgress();
      this.saving = false;
      this.deleting = false;
    },

    setGameProgress() {
      const { id } = this.game;

      this.localProgress = this.progresses[id]
        ? JSON.parse(JSON.stringify(this.progresses[id]))
        : 0;
    },

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
      const { id, name } = this.game;

      this.saving = true;

      this.$store.commit('SET_GAME_PROGRESS', {
        progress: this.localProgress,
        gameId: id,
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
