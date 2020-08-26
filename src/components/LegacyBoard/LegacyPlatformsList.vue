<template lang="html">
  <div class="platform-list">
    <div
      class="platform"
      v-for="platform in platforms"
      :key="platform.id"
    >
      <a
        class="thumbnail"
        :style="`background-color: ${platform.hex || '#fff'}`"
        @click="openDeprecationWarning(platform)"
      >
        <img
          :src="`/static/img/platforms/logos/${platform.code}.svg`"
          :alt="platform.name"
        />

        <span v-if="hasLists(platform.code)" class="lists-indicator" />
      </a>

      <div class="platform-info">
        <h4>{{ platform.name }}</h4>
        {{ platform.releaseYear }}
      </div>
    </div>

    <b-modal
      id="deprecation-warning"
      :title="tempPlatform && tempPlatform.name ? tempPlatform.name : 'Migration warning'"
      hide-footer
      @hidden="resetPlatorm"
    >
      <b-alert show variant="warning">
        <h3>Deprecation warning</h3>
        <p>Platform-based game boards are being phased out.
          Please click the button below to convert this platform into a board.</p>
      </b-alert>

      <b-button
        variant="success"
        @click="convertBoard({ tempPlatform, migratePlatform  })"
        :disabled="saving"
      >
        <b-spinner small v-if="saving" />
        <span v-else>Convert to board</span>
      </b-button>

      <hr>

      <p>You can still access your platform board, but keep in mind that
        they will eventually be removed</p>

      <b-button @click="changePlatform(tempPlatform)">
        View platform
      </b-button>

      <!-- <pre>{{ tempPlatform }}</pre> -->
      <!-- <pre>{{ migratePlatform }}</pre> -->
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    platforms: Array,
  },

  data() {
    return {
      tempPlatform: null,
      migratePlatform: null,
      saving: false,
    };
  },

  computed: {
    ...mapState(['gameLists']),
  },

  methods: {
    async convertBoard({ tempPlatform, migratePlatform }) {
      this.saving = true;

      const lists = migratePlatform.map(({ games, name }) => {
        const list = {
          name,
          games,
          settings: {},
        };

        return list;
      });

      const { id } = tempPlatform;

      const newBoard = {
        description: '',
        lists,
        name: tempPlatform.name,
        platforms: [id],
        theme: null,
        wallpaper: null,
      };

      await this.$store.dispatch('CREATE_BOARD', newBoard)
        .catch(() => {
          this.saving = false;
          this.$bvToast.toast('There was an error creating board', { title: 'Error', variant: 'error' });
        });

      this.saving = false;
      this.$bvToast.toast('Board converted', { title: 'Success', variant: 'success' });
      this.$bvModal.hide('deprecation-warning');
    },

    openDeprecationWarning(platform) {
      this.migratePlatform = this.gameLists[platform.code];
      this.tempPlatform = platform;
      this.$bvModal.show('deprecation-warning');
    },

    resetPlatorm() {
      this.tempPlatform = null;
      this.migratePlatform = null;
    },

    changePlatform(platform) {
      this.$store.commit('SET_PLATFORM_LEGACY', platform);
      this.$router.push({ name: 'legacy-board' });
    },

    hasLists(platform) {
      return Boolean(this.gameLists[platform] && this.gameLists[platform].length);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  // @import "~styles/styles";

  .platform-list {
    display: grid;
    grid-template-columns: auto auto;

    @media(max-width: 780px) {
      grid-template-columns: auto;
    }
  }

  .platform {
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 200px auto;
    grid-gap: 1rem;
  }

  .thumbnail {
    padding: 1rem;
    border-radius: var(--border-radius);
    justify-content: center;
    text-align: center;
    display: flex;
    position: relative;
    overflow: hidden;

    &.has-lists {
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-color: transparent;
        border-style: solid;
      }

      &::after {
        border-width: .5rem;
        border-right-color: #555;
        border-top-color: #555;
      }
    }
  }

  .lists-indicator {
    position: absolute;
    top: -15px;
    right: -20px;
    width: 40px;
    height: 30px;
    transform: rotate(45deg);
    background: red;
    border-bottom: 3px solid var(--body-background);
    background-color: #555;
  }

  img {
      max-width: 100%;
      align-self: center;
      max-height: 50px;
      border-radius: var(--border-radius);
  }

  .has-lists-badge {
    position: absolute;
    top: -11px;
    right: -13.5px;
    transform: rotate(45deg);
    color: #555;
  }
</style>
