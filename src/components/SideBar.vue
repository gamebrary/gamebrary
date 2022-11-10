<template>
  <b-sidebar
    id="sidebar"
    :bg-variant="darkTheme ? 'dark' : 'light'"
    :text-variant="darkTheme ? 'light' : 'dark'"
    aria-labelledby="sidebar-title"
    shadow
    backdrop
  >
    <template #header>
      <header class="d-flex align-items-center justify-content-between w-100">
        <div>
          <b-button
            title="Dashboard"
            size="sm"
            variant="transparent"
            :to="{ name: 'home' }"
          >
            <img
              src="/logo.png"
              class="logo mr-2"
            />
          </b-button>

          <span class="lead">Gamebrary</span>
        </div>

        <b-button
          v-b-toggle.sidebar
          :variant="darkTheme ? 'info' : 'light'"
        >
          <i class="fa fa-close fa-fw" />
        </b-button>
      </header>
    </template>
    
    <template #default>
      <div class="px-3">
        <search-box class="mb-3 w-100" />

        <b-button
          :to="{ name: 'boards' }"
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1"
        >
          <i class="fa-regular fa-rectangle-list fa-fw" />
          <span class="ml-2">Boards</span>
        </b-button>

        <b-button
          :to="{ name: 'wallpapers' }"
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1"
        >
          <i class="fa fa-images fa-fw" aria-hidden="true" />
          <span class="ml-2">Wallpapers</span>
        </b-button>

        <b-button
          :to="{ name: 'notes' }"
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1 fa-fw"
          id="notes"
        >
          <i class="fa fa-note-sticky" aria-hidden="true" />
          <span class="ml-2">Notes</span>
        </b-button>

        <b-button
          :to="{ name: 'tags' }"
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1 fa-fw"
          id="tags"
        >
          <i class="fa fa-tags" aria-hidden="true" />
          <span class="ml-2">Tags</span>
        </b-button>

        <b-button
          class="w-100 text-left mb-1 fa-fw"
          :to="{ name: 'account' }"
          :variant="darkTheme ? 'info' : 'light'"
        >
          <b-avatar
            rounded
            v-if="avatarImage"
            :src="avatarImage"
            size="22"
          />

          <i
            v-else
            class="fa fa-solid fa-user"
            aria-hidden
          />

          <span class="mr-2">
            Account
          </span>
        </b-button>

        <hr />

        <b-button
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1"
          v-b-modal.keyboard-shortcuts
          id="shortcuts"
        >
          <i class="fa-solid fa-keyboard fa-fw" /> Keyboard Shortcuts
        </b-button>

        <b-button
          :variant="darkTheme ? 'info' : 'light'"
          class="w-100 text-left mb-1"
          @click="toggleTheme"
        >
          <i v-if="darkTheme" class="fa-solid fa-sun fa-fw" />
          <i v-else class="fa-solid fa-moon fa-fw" />

          Change theme
        </b-button>

        <b-button
          class="w-100 text-left mb-1"
          variant="link"
          href="https://github.com/romancm/gamebrary"
          target="_blank"
        >
          <i class="fab fa-github fa-fw" /> Github
        </b-button>

        <b-button
          class="w-100 text-left mb-1"
          variant="link"
          href="https://goo.gl/forms/r0juBCsZaUtJ03qb2"
          target="_blank"
        >
          <i class="fa-regular fa-comment-dots fa-fw" />
          Submit Feedback
        </b-button>

        <b-button
          class="w-100 text-left mb-1"
          variant="link"
          href="https://www.paypal.me/RomanCervantes/5"
          target="_blank"
        >
          <i class="fa-solid fa-circle-dollar-to-slot fa-fw" />
          Donate
        </b-button>

        <!-- <b-button
          class="mr-2"
          v-b-tooltip.hover
          title="Change language"
        >
          <i class="fa-solid fa-language" />
        </b-button> -->

        <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
          <i class="mr-2 fab fa-steam" aria-hidden />
          <small>Steam</small>
        </b-list-group-item> -->
      </div>
    </template>

    <template #footer>
      <footer class="ml-auto pl-2 mt-2 pb-5 text-center small">
        &copy; 2022 Gamebrary

        <b-link
          href="https://github.com/romancm/gamebrary/releases"
          target="_blank"
          :class="darkTheme ? 'text-light' : 'text-dark'"
        >
          {{ latestRelease }}
        </b-link>
      </footer>
    </template>
  </b-sidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageThumbnail } from '@/utils';
import SearchBox from '@/components/SearchBox';

export default {
  components: {
    SearchBox,
  },

  data() {
    return {
      profile: {},
      avatarImage: null,
    }
  },

  computed: {
    ...mapState(['board', 'boards', 'settings']),
    ...mapGetters(['sortedBoards', 'darkTheme', 'latestRelease']),
  },

  methods: {
    async toggleTheme() {
      const { settings } = this;
      const darkTheme = settings?.darkTheme || false;

      const payload = {
        ...settings,
        darkTheme: !darkTheme,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
          this.saving = false;
        });

    },

    async load() {
      // await this.$store.dispatch('LOAD_BOARDS').catch(() => {});
      // await this.$store.dispatch('LOAD_TAGS').catch(() => {});
      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => {});

      if (this.profile?.avatar) this.loadAvatarImage();
    },

    async loadAvatarImage() {
      const thumbnailRef = getImageThumbnail(this.profile?.avatar);

      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  header {
    display: grid;
    align-items: center;
    grid-template-columns: 65px 1fr;
    z-index: 1;
  }

  .logo {
    height: 36px;
  }
</style>
