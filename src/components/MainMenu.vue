<template>
  <b-dropdown
    :variant="darkTheme ? 'black' : 'light'"
    :dropup="navPosition === 'bottom'"
    :dropright="navPosition === 'left'"
    :dropleft="navPosition === 'right'"
    no-caret
    :menu-class="darkTheme ? 'bg-dark' : null"
  >
    <!-- <b-dropdown-text style="width: 240px;">
      <small>Welcome {{ user.displayName }}</small>
    </b-dropdown-text> -->

    <template #button-content>
      <i class="fa-sharp fa-solid fa-bars" />
    </template>

    <b-dropdown-item :to="{ name: 'home' }">
      <i class="fa-regular fa-rectangle-list fa-fw" />
      <span class="ml-2">Boards <small v-if="user" class="text-muted">({{ boardCount }})</small></span>
    </b-dropdown-item>

    <!-- <b-dropdown-group v-if="user && routeName === 'home'">
      <b-dropdown-item
        v-for="board in recentlyUpdatedBoards"
        :key="board.id"
        :to="{ name: 'board', params: { id: board.id } }"
      >
        <small>{{ board.name }}</small>
      </b-dropdown-item>
    </b-dropdown-group> -->

    <b-dropdown-item :to="{ name: 'games' }">
      <i class="fa-regular fa-heart fa-fw" />
      <span class="ml-2">Games <small v-if="user" class="text-muted">({{ gameCount }})</small></span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'notes' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Notes <small v-if="user" class="text-muted">({{ noteCount }})</small></span>
    </b-dropdown-item>

    <!-- <b-dropdown-item :to="{ name: 'progresses' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Progresses</span>
    </b-dropdown-item> -->

    <b-dropdown-item :to="{ name: 'tags' }">
      <i class="fa fa-tags fa-fw" aria-hidden="true" />
      <span class="ml-2">Tags <small v-if="user" class="text-muted">({{ tagCount }})</small></span>
    </b-dropdown-item>

    <b-dropdown-item :to="{ name: 'wallpapers' }">
      <i class="fa fa-images fa-fw" aria-hidden="true" />
      <span class="ml-2">Wallpapers <small v-if="user" class="text-muted">({{ wallpaperCount }})</small></span>
    </b-dropdown-item>

    <b-dropdown-item v-if="user" :to="{ name: 'profile' }">
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

      {{ profileTitle }}
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item v-if="user" :to="{ name: 'settings' }">
      <i class="fa fa-cog fa-fw" aria-hidden="true" />
      <span class="ml-2">Settings</span>
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

    <b-dropdown-text>
      <b-link
        href="https://github.com/romancm/gamebrary"
        target="_blank"
        :class="darkTheme ? 'text-primary' : 'text-dark'"
      >
        <b-link
          href="https://github.com/romancm/gamebrary/releases"
          target="_blank"
          :class="darkTheme ? 'text-light' : 'text-dark'"
        >
          {{ latestRelease }}
        </b-link>
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
    ...mapState(['board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers']),
    ...mapGetters(['darkTheme', 'navPosition', 'sortedBoards', 'latestRelease']),

    year() {
      return new Date().getFullYear();
    },

    routeName() {
      return this.$route.name;
    },

    recentlyUpdatedBoards() {
      return this.sortedBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 5);
    },

    gameCount() {
      return Object.values(this.games)?.filter((liked) => Boolean(liked))?.length;
    },

    noteCount() {
      return Object.keys(this.notes)?.length;
    },

    tagCount() {
      return Object.keys(this.tags)?.length;
    },

    boardCount() {
      return this.boards?.length;
    },

    wallpaperCount() {
      return this.wallpapers?.length;
    },

    profileTitle() {
      return this.profile?.userName
        ? `@${this.profile.userName}`
        : 'Profile';
    },
  },

  mounted() {
    if (this.user) this.load();
  },

  methods: {
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
