<template lang="html">
  <component
    v-if="user"
    :is="userDockComponent"
  />

  <public-dock v-else />
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import PublicDock from '@/components/Dock/PublicDock';
import HorizontalDock from '@/components/Dock/HorizontalDock';
import VerticalDock from '@/components/Dock/VerticalDock';
import PublicMenu from '@/components/PublicMenu';
import GlobalSearch from '@/components/GlobalSearch';

export default {
  components: {
    PinnedBoards,
    PublicDock,
    HorizontalDock,
    VerticalDock,
    PublicMenu,
    GlobalSearch,
  },

  computed: {
    ...mapState(['board', 'user', 'publicBoards', 'settings']),
    ...mapGetters(['isBoardOwner']),

    dockPosition() {
      return this.settings && this.settings.dockPosition;
    },

    userDockComponent() {
      const isVertical = ['left', 'right'].includes(this.dockPosition);

      return isVertical ? 'VerticalDock' : 'HorizontalDock';
    },

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

<style lang="scss" rel="stylesheet/scss" scoped>
.dock {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: .25rem 1rem;
  align-items: center;
  background: #ccf;

  &.left {
    flex-direction: column;
  }
}
</style>

