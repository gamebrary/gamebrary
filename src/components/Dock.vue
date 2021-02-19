<!-- TODO: auto hide dock on scroll -->
<template lang="html">
  <nav
    class="rounded position-fixed d-flex flex-column p-0 m-2 text-center border dock"
    :class="{
      'bg-dark text-white border-dark': nightMode,
      'bg-white': !nightMode,
      }"
  >
    <b-button
      title="Dashboard"
      variant="transparent"
      class="my-2 p-0"
      @click="handleLogoClick"
    >
      <img
        :src="`/static/gamebrary-logo${nightMode ? '' : '-dark'}.png`"
        width="32"
      />
    </b-button>

    <pinned-boards v-if="user" />

    <b-collapse id="moreMenu" v-model="moreMenuOpen">
      <b-button
        :to="{ name: 'boards' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="Boards"
      >
        <i class="fas fa-columns fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'tags' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="Tags"
      >
        <i class="fas fa-tags fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'notes' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="Notes"
      >
        <i class="fas fa-sticky-note fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'wallpapers' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="Wallpapers"
      >
        <i class="fas fa-images fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'profile' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="Profile"
      >
        <i class="fas fa-user fa-fw" aria-hidden />
      </b-button>

      <b-button
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        v-b-modal:keyboard-shortcuts
        title="Keyboard shortcuts"
      >
        <i class="fas fa-keyboard fa-fw" aria-hidden />
      </b-button>

      <hr class="my-2">

      <b-button
        :to="{ name: 'settings' }"
        :variant="nightMode ? 'primary' : 'light'"
        size="sm"
        title="Settings"
      >
        <i class="fas fa-cog fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'about' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="mt-1"
        size="sm"
        title="About"
      >
        <i class="fas fa-info fa-fw" aria-hidden />
      </b-button>

      <b-button
        :to="{ name: 'releases' }"
        :variant="nightMode ? 'primary' : 'light'"
        class="my-1"
        size="sm"
        title="Releases"
      >
        <i class="fas fa-bullhorn fa-fw" aria-hidden />
      </b-button>
    </b-collapse>

    <!-- TODO: persist value -->
    <b-button
      v-b-toggle.moreMenu
      :variant="nightMode ? 'primary' : 'light'"
      class="mx-1 mb-1"
      size="sm"
    >
      <i :class="`fas fa-angle-double-${moreMenuOpen ? 'up' : 'down'} fa-fw`" />
    </b-button>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PinnedBoards from '@/components/Board/PinnedBoards';

export default {
  components: {
    PinnedBoards,
  },

  data() {
    return {
      moreMenuOpen: false,
    };
  },

  computed: {
    ...mapState(['board', 'notification', 'settings', 'user']),
    ...mapGetters(['nightMode']),

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
  width: 50px;
  z-index: 1;
}
</style>
