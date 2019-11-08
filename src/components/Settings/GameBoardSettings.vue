<template lang="html">
    <section>
        <!-- <div class="setting">
            <i class="fas fa-users" />
            <h5>{{ $t('settings.public') }}</h5>

            <toggle-switch
                id="public"
                v-model="value[platform.code].public"
            />
        </div> -->

        <div class="setting">
            <i class="fas fa-star-half-alt" />
            <h5>{{ $t('settings.ratings') }}</h5>

            <toggle-switch
                id="gameRatings"
                v-model="value[platform.code].hideGameRatings"
            />
        </div>

        <wallpaper-upload />

        <div class="setting">
            <i class="fas fa-palette" />
            <h5>Global theme</h5>

            <select v-model="value[platform.code].theme">
                <option v-for="{ id, name } in themes" :key="id" :value="id">
                    {{ name }}
                </option>
            </select>
        </div>

        <div class="setting">
            <i class="fas fa-exclamation-triangle" />
            <h5>{{ $t('gameBoard.settings.dangerZone') }}</h5>

            <modal
                action-text="Delete forever"
                action-button-class="danger"
                :message="`Your ${platform.name} collection will be deleted forever.`"
                :title="`Delete ${platform.name} collection`"
                @action="deletePlatform"
            >
                <button
                    class="small warning"
                    :title="$t('list.delete')"
                >
                    <i class="far fa-trash-alt" />
                    Delete {{ platform.name }} collection
                </button>
            </modal>
        </div>
    </section>
</template>

<script>
import { mapState } from 'vuex';
import themes from '@/themes';
import Modal from '@/components/Modal';
import WallpaperUpload from '@/components/WallpaperUpload';
import ToggleSwitch from '@/components/ToggleSwitch';

export default {
  components: {
    WallpaperUpload,
    Modal,
    ToggleSwitch,
  },

  props: {
    value: Object,
  },

  data() {
    return {
      themes,
    };
  },

  computed: {
    ...mapState(['user', 'platform', 'gameLists']),

    shareText() {
      return `Check out my ${this.platform.name} collection at Gamebrary`;
    },

    tweetUrl() {
      return `https://twitter.com/intent/tweet?text=${this.shareText}&url=${encodeURIComponent(this.shareUrl)}`;
    },

    redditUrl() {
      return `https://www.reddit.com/submit?url=${this.shareUrl}&title=${this.shareText}`;
    },

    shareUrl() {
      const url = process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000'
        : 'https://app.gamebrary.com';

      return `${url}/s?id=${this.user.uid}&list=${this.platform.code}`;
    },
  },

  mounted() {
    if (!this.value[this.platform.code]) {
      this.value[this.platform.code] = {};
    }
  },

  methods: {
    deletePlatform() {
      this.$store.commit('REMOVE_PLATFORM');

      this.$store.dispatch('SAVE_LIST_NO_MERGE', this.gameLists)
        .then(() => {
          this.$router.push({ name: 'platforms' });
        })
        .catch(() => {
          this.$bus.$emit('TOAST', { message: 'Authentication error', type: 'error' });
          this.$router.push({ name: 'sessionExpired' });
        });
    },
  },
};
</script>
