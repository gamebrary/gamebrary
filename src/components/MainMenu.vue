<template>
  <b-dropdown
    :variant="darkTheme ? 'black' : 'light'"
    :dropup="navPosition === 'bottom'"
    :dropright="navPosition === 'left'"
    :dropleft="navPosition === 'right'"
    no-caret
    :class="isVerticalNav ? 'mt-1' : ''"
  >
    <template #button-content>
      <i class="fa-sharp fa-solid fa-bars" />
    </template>

    <b-dropdown-item :to="{ name: 'home' }">
      <i class="fa-regular fa-rectangle-list fa-fw" />
      <span class="ml-2">Boards</span>
    </b-dropdown-item>

    <b-dropdown-item
      v-if="user"
      :to="{ name: 'create.board' }"
      class="ml-2"
    >
      <i class="fa-regular fa-plus" />
      <span class="ml-2">New board</span>
    </b-dropdown-item>

    <div :class="['py-1 rounded', darkTheme ? 'bg-black' : 'bg-light']" v-if="showBoardActions">
      <p :class="['strong text-uppercase mb-0 ml-2 mt-1', darkTheme ? 'text-success' : 'text-dark']">{{ board.name }}</p>

      <b-dropdown-item
        v-if="isBoardOwner"
        class="mx-1"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        Edit board
      </b-dropdown-item>

      <!-- <b-dropdown-item
        :to="{ name: 'board.edit', params: { id: board.id } }"
        class="mx-1"
      >
        Copy board
      </b-dropdown-item> -->
    </div>

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

    <b-dropdown-item :to="{ name: 'search' }">
      <i class="fa fa-search fa-fw" aria-hidden="true" />
      <span class="ml-2">Search</span>
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

    <!-- <b-dropdown-text>
      <b-link
        href="https://github.com/romancm/gamebrary/"
        target="_blank"
      >
        GitHub
      </b-link>
    </b-dropdown-text> -->
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
    ...mapGetters(['darkTheme', 'navPosition', 'sortedBoards', 'latestRelease', 'isVerticalNav', 'isBoardOwner']),

    year() {
      return new Date().getFullYear();
    },

    routeName() {
      return this.$route.name;
    },

    showBoardActions() {
      return Boolean(this.routeName === 'board' && this.user?.uid);
    },

    recentlyUpdatedBoards() {
      return this.sortedBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 5);
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
