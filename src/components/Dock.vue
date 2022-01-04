<template lang="html">
  <nav class="rounded d-flex flex-column m-2 text-center dock">
    <b-button
      title="Dashboard"
      variant="transparent"
      class="my-2 p-0"
      @click="handleLogoClick"
    >
      <!-- <img
        src="/static/gamebrary-logo-dark.png"
        width="32"
      /> -->
      <i class="fas fa-gamepad" />
      <!-- TODO: move back button to here when viewing a game that's part of a board -->
    </b-button>

    <pinned-boards />
    <user-menu />

    <b-button :to="{ name: 'settings' }">
      <i class="fas fa-cog" />
    </b-button>

    <global-search />
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import GlobalSearch from '@/components/GlobalSearch';
import UserMenu from '@/components/UserMenu';

export default {
  components: {
    PinnedBoards,
    GlobalSearch,
    UserMenu,
  },

  computed: {
    ...mapState(['board', 'notification', 'user', 'releases']),
    ...mapGetters(['darkTheme']),

    latestRelease() {
      // eslint-disable-next-line
      const [latestRelease] = this.releases;

      // eslint-disable-next-line
      return latestRelease && latestRelease.tag_name;
    },

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },
  },

  methods: {
    handleLogoClick() {
      if (!this.user) {
        if (this.$route.name === 'public-boards') {
          this.$bvModal.show('authModal');
        } else {
          this.$router.push({ name: 'public-boards' });
        }
      }

      if (this.user && this.$route.name !== 'boards') {
        this.$router.push({ name: 'boards' });
      }
    },

    // async pinBoard() {
    //   const payload = {
    //     ...this.board,
    //     pinned: !this.board.pinned,
    //   };
    //
    //   this.$store.commit('SET_ACTIVE_BOARD', payload);
    //
    //   await this.$store.dispatch('SAVE_BOARD')
    //     .catch(() => {
    //       this.$bvToast.toast('There was an error renaming list', { variant: 'danger' });
    //     });
    //
    //   this.$bvToast.toast('Board settings saved');
    // },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.dock {
  // background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  max-height: calc(100vh - 16px);
}
</style>
