<template>
  <div class="d-flex flex-column">
    <b-dropdown
      split
      text="Split Dropdown"
      class="m-2"
      :variant="darkTheme ? 'black' : 'light'"
      :split-to="{ name: 'home' }"
      dropright
    >
      <template #button-content>
        <i class="fa-regular fa-rectangle-list fa-fw" />
        <!-- Boards -->
      </template>

      <b-dropdown-item href="#">{{  board.title }}</b-dropdown-item>
      <b-dropdown-item :to="{ name: 'create.board' }">Create new board</b-dropdown-item>
      <b-dropdown-item href="#">Edit board</b-dropdown-item>
      <b-dropdown-item href="#">Something else here...</b-dropdown-item>
    </b-dropdown>


    <!-- <b-button
      v-if="user"
      :variant="darkTheme ? 'black' : 'light'"
      :to="{ name: 'create.board' }"
    >
      New board
    </b-button> -->

    <!-- <div :class="['py-1 rounded', darkTheme ? 'bg-black' : 'bg-light']" v-if="showBoardActions">
      <p :class="['strong text-uppercase mb-0 ml-2 mt-1', darkTheme ? 'text-success' : 'text-dark']">{{ board.name }}</p>

      <b-button
        v-if="isBoardOwner"
        class="mx-1"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        Edit board
      </b-button>

      <b-button
        :to="{ name: 'board.edit', params: { id: board.id } }"
        class="mx-1"
      >
        Copy board
      </b-button>
    </div> -->

    <!-- <b-dropdown-group v-if="user && routeName === 'home'">
      <b-button
        v-for="board in recentlyUpdatedBoards"
        :key="board.id"
        :to="{ name: 'board', params: { id: board.id } }"
      >
        <small>{{ board.name }}</small>
      </b-button>
    </b-dropdown-group> -->

    <b-button
      :to="{ name: 'games' }"
      :variant="darkTheme ? 'black' : 'light'"
      title="Games"
    >
      <i class="fa-regular fa-heart fa-fw" />
    </b-button>

    <b-button
      :to="{ name: 'notes' }"
      :variant="darkTheme ? 'black' : 'light'"
      alt="Notes"
    >
      <i class="fa fa-book fa-fw" aria-hidden="true" />
    </b-button>

    <!-- <b-button :to="{ name: 'progresses' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Progresses</span>
    </b-button> -->

    <b-button
      :to="{ name: 'tags' }"
      :variant="darkTheme ? 'black' : 'light'"
      title="Tags"
    >
      <i class="fa fa-tags fa-fw" aria-hidden="true" />
    </b-button>

    <b-button
      :to="{ name: 'wallpapers' }"
      :variant="darkTheme ? 'black' : 'light'"
      title="Wallpapers"
    >
      <i class="fa fa-images fa-fw" aria-hidden="true" />
    </b-button>

    <b-button 
      :to="{ name: 'search' }"
      :variant="darkTheme ? 'black' : 'light'"
      title="Search"
    >
      <i class="fa fa-search fa-fw" aria-hidden="true" />
    </b-button>

    <b-button
      v-if="user" :to="{ name: 'profile' }"
      :variant="darkTheme ? 'black' : 'light'"
      :title="profileTitle"
    >
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
    </b-button>

    <b-button
      v-if="user"
      title="Settings"
      :variant="darkTheme ? 'black' : 'light'"
      :to="{ name: 'settings' }"
    >
      <i class="fa fa-cog fa-fw" aria-hidden="true" />
    </b-button>

    <b-button
      :to="{ name: 'help' }"
      :variant="darkTheme ? 'black' : 'light'"
      title="Help"
      id="help"
    >
      <i class="fa fa-regular fa-circle-question fa-fw" aria-hidden="true" />
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

    <!-- <b-dropdown-text>
      <b-link
        href="https://github.com/romancm/gamebrary/"
        target="_blank"
      >
        GitHub
      </b-link>
    </b-dropdown-text> -->
  </div>
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
