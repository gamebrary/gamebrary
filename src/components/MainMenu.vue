<template>
  <b-dropdown
    :variant="darkTheme ? 'dark' : 'light'"
    no-caret
    class="mr-3"
  >
    <!-- <b-dropdown-text style="width: 240px;">
      <small>Welcome {{ user.displayName }}</small>
    </b-dropdown-text> -->

    <template #button-content>
      <i class="fa-sharp fa-solid fa-bars" />
    </template>

    <b-dropdown-item :to="{ name: 'home' }">
      <i class="fa-regular fa-rectangle-list fa-fw" />
      <span class="ml-2">Boards</span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'games' }">
      <i class="fa-regular fa-heart fa-fw" />
      <span class="ml-2">Games</span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'notes' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Notes</span>
    </b-dropdown-item>

    <!-- <b-dropdown-item :to="{ name: 'progresses' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Progresses</span>
    </b-dropdown-item> -->

    <b-dropdown-item :to="{ name: 'tags' }">
      <i class="fa fa-tags fa-fw" aria-hidden="true" />
      <span class="ml-2">Tags</span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'wallpapers' }">
      <i class="fa fa-images fa-fw" aria-hidden="true" />
      <span class="ml-2">Wallpapers</span>
    </b-dropdown-item>

    <!-- <b-dropdown-item :to="{ name: 'dev.tools' }">
      <i class="fa fa-cog fa-fw" aria-hidden="true" />
      <span class="ml-2">Dev tools</span>
    </b-dropdown-item> -->

    <b-dropdown-item v-if="user" :to="{ name: 'account' }">
      <b-avatar
        rounded
        v-if="avatarImage"
        :src="avatarImage"
        size="22"
      />

      <i
        v-else
        class="fa fa-solid fa-user fa-fw"
        aria-hidden
      />

      <span class="mr-2">
        Account
      </span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item v-b-modal.keyboard-shortcuts>
      <i class="fa-solid fa-keyboard fa-fw" /> Keyboard Shortcuts
    </b-dropdown-item>

    <b-dropdown-item
      v-if="user"
      @click="toggleTheme"
    >
      <i v-if="darkTheme" class="fa-solid fa-sun fa-fw" />
      <i v-else class="fa-solid fa-moon fa-fw" />

      Change theme
    </b-dropdown-item>

    <b-dropdown-item
      :to="{ name: 'help' }"
      block
      id="help"
    >
      <i class="fa fa-regular fa-circle-question fa-fw" aria-hidden="true" />
      <span class="ml-2">Help</span>
    </b-dropdown-item>

    <!-- <b-dropdown-item
      class="mr-2"
      v-b-tooltip.hover
      title="Change language"
    >
      <i class="fa-solid fa-language" />
    </b-dropdown-item> -->

    <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
      <i class="mr-2 fab fa-steam" aria-hidden />
      <small>Steam</small>
    </b-list-group-item> -->
    <b-dropdown-divider />
    <b-dropdown-text>
      ©{{ year }}
      <b-link
        href="https://github.com/romancm/gamebrary"
        target="_blank"
        :class="darkTheme ? 'text-primary' : 'text-dark'"
      >
        Gamebrary
      </b-link>
    </b-dropdown-text>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageThumbnail } from '@/utils';

export default {
  data() {
    return {
      profile: {},
      avatarImage: null,
    }
  },

  computed: {
    ...mapState(['board', 'boards', 'settings', 'user']),
    ...mapGetters(['darkTheme']),

    year() {
      return new Date().getFullYear();
    },
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
