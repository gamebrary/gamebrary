<template lang="html">
  <nav
    class="dock p-2 d-flex align-items-center justify-content-between w-100"
    :class="{ 'position-fixed': isBoard }"
  >
    <div class="d-flex">
      <b-button
        title="Dashboard"
        squared
        variant="transparent"
        v-b-toggle.menu
        class="p-0 ml-2"
      >
        <img
          src="/static/gamebrary-logo.png"
          width="32"
        />
      </b-button>

      <portal-target name="logo" />

      <span v-if="pageTitle && !isBoard" class="d-sm-none m-2">{{ pageTitle }}</span>
    </div>

    <portal-target name="dock" />

    <sidebar />
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import Sidebar from '@/components/Sidebar';

export default {
  components: {
    PinnedBoards,
    Sidebar,
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
    //     this.$router.push({ name: 'dashboard' });
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

<style lang="scss" rel="stylesheet/scss" scoped>
.dock {
  z-index: 1;
  height: 54px;
}
</style>
