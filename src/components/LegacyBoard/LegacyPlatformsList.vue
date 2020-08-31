<template lang="html">
  <div class="platform-list">
    <b-row>
      <b-col
        cols="12" sm="6" md="4" lg="2"
        v-for="platform in platforms"
        :key="platform.id"
        class="mb-4"
        @click="openDeprecationWarning(platform)"
      >
        <a
          class="thumbnail"
          :style="`background-color: ${platform.hex || '#fff'}`"
        >
          <img
            :src="`/static/img/platforms/logos/${platform.code}.svg`"
            :alt="platform.name"
          />
        </a>

        <h6>{{ platform.name }}</h6>
      </b-col>
    </b-row>

    <b-modal
      id="deprecation-warning"
      :title="tempPlatform && tempPlatform.name ? tempPlatform.name : 'Migration warning'"
      hide-footer
      @hidden="resetPlatorm"
    >
      <b-alert show variant="warning">
        <h4>Deprecation warning</h4>
        <p>Platform-based boards will be phased out soon</p>
        <p>Please click the button below to convert this platform into a board.</p>
        <p>If you have any questions or need help feel free to email
          <strong>contact@gamebrary.com</strong> and/or open defects in
          <a href="https://github.com/romancm/gamebrary/issues" target="_blank">GitHub</a></p>
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

      const platforms = isNaN(id) && id.includes(',')
        ? id.split(',').map(platformId => Number(platformId))
        : [id];

      const newBoard = {
        description: '',
        lists,
        name: tempPlatform.name,
        platforms,
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
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .platform {
    margin-bottom: 1rem;
    display: grid;
    align-items: center;
    grid-template-columns: 120px auto;
    grid-gap: 1rem;
  }

  .thumbnail {
    padding: 1rem;
    justify-content: center;
    text-align: center;
    display: flex;
    position: relative;
    overflow: hidden;
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
