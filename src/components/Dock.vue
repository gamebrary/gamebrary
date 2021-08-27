<template lang="html">
  <nav
    :class="[{ 'position-fixed': isBoard }, 'd-flex align-items-center justify-content-between w-100 py-2 px-3 z-index-1']"
  >
    <div class="d-flex">
      <router-link :to="{ name: 'home' }">
        <img
          src="/static/gamebrary-logo.png"
          width="32"
        />
      </router-link>

      <!-- Gamebrary -->

      <portal-target name="logo" />

      <span v-if="!isBoard" class="m-2">
        <portal-target name="pageTitle" />
      </span>
    </div>

    <div class="d-flex">

      <!-- <global-search class="ml-2" /> -->
      <portal-target name="dock" multiple />

      <user-menu v-if="user" />
      <public-menu v-else />
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import UserMenu from '@/components/UserMenu';
import PublicMenu from '@/components/PublicMenu';
import GlobalSearch from '@/components/GlobalSearch';

export default {
  components: {
    PinnedBoards,
    UserMenu,
    PublicMenu,
    GlobalSearch,
  },

  computed: {
    ...mapState(['board', 'user', 'publicBoards']),
    ...mapGetters(['isBoardOwner']),

    isBoard() {
      return ['public-board', 'board'].includes(this.$route.name);
    },

    pageTitle() {
      return this.$route.meta && this.$route.meta.title;
    },
  },

  methods: {
    // handleLogoClick() {
    //   if (!this.user) {
    //     if (this.$route.name === 'public-boards') {
    //       this.$bvModal.show('authModal');
    //     } else {
    //       this.$router.push({ name: 'public-boards' });
    //     }
    //   }
    //
    //   if (this.user && this.$route.name !== 'dashboard') {
    //     this.$router.push({ name: 'home' });
    //   }
    // },

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
