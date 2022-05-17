<template lang="html">
  <nav class="d-flex flex-column text-center dock px-2">
    <pinned-boards class="pt-2" />

    <b-button :to="{ name: 'settings' }" class="d-block d-sm-none mb-2">
      <i class="fas fa-cog" />
    </b-button>

    <global-search class="d-block d-sm-none" />
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';
import GlobalSearch from '@/components/GlobalSearch';

export default {
  components: {
    PinnedBoards,
    GlobalSearch,
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
      return ['public.board', 'board'].includes(this.$route.name);
    },
  },

  methods: {
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
  // background-color: #1c1c27;
  background: linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 100%);
  z-index: 1;
  max-height: 100vh;
  height: calc(100vh - 45px);
}
</style>
