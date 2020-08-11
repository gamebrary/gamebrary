<template lang="html">
  <section>
    <b-list-group>
      <wallpaper-upload />

      <b-list-group-item v-if="value[platform.code]">
        <label for="theme">Theme</label>
        <b-form-select
          id="theme"
          v-model="value[platform.code].theme"
          @change="$emit('save')"
        >
          <b-form-select-option
            v-for="{ id, name } in themes"
            :key="id"
            :value="id"
          >
            {{ name }}
          </b-form-select-option>
        </b-form-select>
      </b-list-group-item>

      <b-list-group-item>
        <b-form-checkbox
          switch
          v-model="value[platform.code].showGameCount"
          @change="$emit('save')"
        >
          Show game count
        </b-form-checkbox>
      </b-list-group-item>

      <b-list-group-item>
        <modal
          :message="`Your ${platform.name} collection will be deleted forever.`"
          :title="`Delete ${platform.name} collection`"
          action-text="Delete forever"
          action-button-class="danger"
          @action="deletePlatform"
        >
          <b-button
            :title="$t('list.delete')"
            variant="danger"
          >
            <i class="far fa-trash-alt" />
            Delete {{ platform.name }} collection
          </b-button>
        </modal>
      </b-list-group-item>
    </b-list-group>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import themes from '@/themes';
import Modal from '@/components/Modal';
import WallpaperUpload from '@/components/WallpaperUpload';

export default {
  components: {
    WallpaperUpload,
    Modal,
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
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
