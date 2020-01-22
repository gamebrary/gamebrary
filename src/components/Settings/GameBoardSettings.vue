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

    <h3>Theme</h3>

    <wallpaper-upload />

    <div class="setting" v-if="value[platform.code]">
      <i class="fas fa-palette" />
      <h5>Theme</h5>

      <select v-model="value[platform.code].theme" @change="$emit('save')">
        <option
          v-for="{ id, name } in themes"
          :key="id"
          :value="id"
        >
          {{ name }}
        </option>
      </select>
    </div>

    <div class="setting">
      <i class="fas fa-bars" />
      <h5>Header position (only affects mobile)</h5>

      <select v-model="value[platform.code].position" @change="$emit('save')">
        <option
          v-for="{ id, name } in positions"
          :key="id"
          :value="id"
        >
          {{ name }}
        </option>
      </select>
    </div>

    <div class="setting">
      <i class="fas fa-shapes" />
      <h5>Border Radius</h5>

      <toggle-switch
        id="borderRadius"
        @change="$emit('save')"
        v-model="value[platform.code].borderRadius"
      />
    </div>

    <h3>Gameboard</h3>
    <div class="setting">
      <i class="fas fa-heading" />
      <h5>Show amount of games next to list title</h5>

      <toggle-switch
        id="showGameCount"
        @change="$emit('save')"
        v-model="value[platform.code].showGameCount"
      />
    </div>

    <div class="setting">
      <i class="fas fa-exclamation-triangle" />
      <h5>{{ $t('gameBoard.settings.dangerZone') }}</h5>

      <modal
        :message="`Your ${platform.name} collection will be deleted forever.`"
        :title="`Delete ${platform.name} collection`"
        action-text="Delete forever"
        action-button-class="danger"
        @action="deletePlatform"
      >
        <button
          :title="$t('list.delete')"
          class="small warning"
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
import positions from '@/positions';
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
    value: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      themes,
      positions,
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
