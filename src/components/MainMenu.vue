<template>
  <div class="main-menu" :class="{ 'd-flex flex-column': isVerticalNav }">
    <b-button
      v-b-tooltip.hover.auto
      title="Home"
      :to="{ name: 'home' }"
    >
      <i class="fa-solid fa-house"></i>
    </b-button>

    <b-dropdown
      v-b-tooltip.hover.auto
      :title="boardButtonTitle"
      :variant="darkTheme ? 'black' : 'light'"
      no-caret
    >
      <template #button-content>
        <i class="fa-regular fa-rectangle-list fa-fw" />
        
        <template v-if="!isVerticalNav">  
          {{ boardButtonTitle }}
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'home' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My boards</span>
      </b-dropdown-item>

      <b-dropdown-item
        v-if="isBoardEditPage"
        :to="{ name: 'board', params: { id: board.id } }"
      >
      <i class="fa-solid fa-caret-left"></i>
        <span class="ml-2">Back to board</span>
      </b-dropdown-item>

      <b-dropdown-item
        v-if="isBoardOwner && (isBoardEditPage || isBoardPage)"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        <i class="fa-regular fa-rectangle-list fa-fw" />
        <span class="ml-2">Edit board</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'create.board' }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">Create board</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto
      title="Tags"
      :variant="darkTheme ? 'black' : 'light'"
      :dropup="navPosition === 'bottom'"
      :dropright="navPosition === 'left'"
      :dropleft="navPosition === 'right'"
      no-caret
    >
      <template #button-content>
        <i class="fa-solid fa-tags fa-fw" />
        
        <template v-if="!isVerticalNav">  
          Tags
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'tags' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My tags</span>
      </b-dropdown-item>

      <b-dropdown-item
        v-if="user"
        :to="{ name: 'tag.create' }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">Add tag</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto
      title="Wallpapers"
      :variant="darkTheme ? 'black' : 'light'"
      :dropup="navPosition === 'bottom'"
      :dropright="navPosition === 'left'"
      :dropleft="navPosition === 'right'"
      no-caret
    >
      <template #button-content>
        <i class="fa fa-images fa-fw" aria-hidden="true" />
        
        <template v-if="!isVerticalNav">  
          Wallpapers
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'wallpapers' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My wallpapers</span>
      </b-dropdown-item>

      <UploadWallpaperButton v-if="user" />
    </b-dropdown>

    <b-dropdown
      :variant="darkTheme ? 'black' : 'light'"
      :dropup="navPosition === 'bottom'"
      :dropright="navPosition === 'left'"
      :dropleft="navPosition === 'right'"
      no-caret
    >
      <template #button-content>
        
        <b-img
          v-if="isGamePage"
          :src="$options.getImageUrl(game)"
          :alt="game.name"
          bordered
          class="mr-2"
          style="max-height: 40px; width: auto;"
        />

        <i v-else class="fa-solid fa-gamepad fa-fw" />

        <template v-if="!isVerticalNav">
          <!-- {{ gameButtonTitle }} -->
          Games
        </template>
      </template>

      <template v-if="isGamePage">
        <b-dropdown-text>
          {{ game.name }}
        </b-dropdown-text>

        <b-dropdown-item-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
          Add note
        </b-dropdown-item-button>
        <b-dropdown-item v-b-modal.gameTagsModal>Edit tags</b-dropdown-item>
        <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
      </template>

      <b-dropdown-item
        :to="{ name: 'games' }"
      >

      <i class="fa-solid fa-heart fa-fw"></i>
        <span class="ml-2">My games</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'search' }"
      >
        <i class="fa fa-search fa-fw" aria-hidden="true" />
        Find games
      </b-dropdown-item>

      <!-- <b-dropdown-item
        v-if="isBoardPage && isBoardOwner"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        <i class="fa-regular fa-rectangle-list fa-fw" />
        <span class="ml-2">Edit board</span>
      </b-dropdown-item> -->

      <b-dropdown-item
        :to="{ name: 'create.board' }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">Create board</span>
      </b-dropdown-item>
    </b-dropdown>


    <b-dropdown
      v-b-tooltip.hover.auto
      :title="boardButtonTitle"
      :variant="darkTheme ? 'black' : 'light'"
      no-caret
    >
      <template #button-content>
        <i class="fa-solid fa-cog fa-fw" />
        
        <template v-if="!isVerticalNav">  
          Settings
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'tags' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My tags</span>
      </b-dropdown-item>

      <b-dropdown-item
        v-if="user"
        :to="{ name: 'tag.create' }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">Add tag</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-if="user"
      v-b-tooltip.hover.auto
      title="Profile"
      :variant="darkTheme ? 'black' : 'light'"
      no-caret
    >
      <template #button-content>
        <template v-if="!isVerticalNav">  
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
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'tags' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My tags</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'tag.create' }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">Add tag</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown-item v-if="user" :to="{ name: 'profile' }">

    </b-dropdown-item>

    <b-dropdown
    :variant="darkTheme ? 'black' : 'light'"
    :dropup="navPosition === 'bottom'"
    :dropright="navPosition === 'left'"
    :dropleft="navPosition === 'right'"
    no-caret
  >
    <template #button-content>
      <i class="fa-sharp fa-solid fa-bars" />
    </template>

    <!-- <b-dropdown-item
      v-if="user"
      :to="{ name: 'create.board' }"
      class="ml-2"
    >
      <i class="fa-regular fa-plus" />
      <span class="ml-2">New board</span>
    </b-dropdown-item> -->

    <!-- <div :class="['py-1 rounded', darkTheme ? 'bg-black' : 'bg-light']" v-if="showBoardActions">
      <p :class="['strong text-uppercase mb-0 ml-2 mt-1', darkTheme ? 'text-success' : 'text-dark']">{{ board.name }}</p>

      <b-dropdown-item
        v-if="isBoardOwner"
        class="mx-1"
        :to="{ name: 'board.edit', params: { id: board.id } }"
      >
        Edit board
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'board.edit', params: { id: board.id } }"
        class="mx-1"
      >
        Copy board
      </b-dropdown-item>
    </div> -->

    <!-- <b-dropdown-group v-if="user && routeName === 'home'">
      <b-dropdown-item
        v-for="board in recentlyUpdatedBoards"
        :key="board.id"
        :to="{ name: 'board', params: { id: board.id } }"
      >
        <small>{{ board.name }}</small>
      </b-dropdown-item>
    </b-dropdown-group> -->

    <!-- <b-dropdown-item :to="{ name: 'progresses' }">
      <i class="fa fa-book fa-fw" aria-hidden="true" />
      <span class="ml-2">Progresses</span>
    </b-dropdown-item> -->

    <b-dropdown-item :to="{ name: 'search' }">
      <i class="fa fa-search fa-fw" aria-hidden="true" />
      <span class="ml-2">Search</span>
    </b-dropdown-item>

    <b-dropdown-divider />

    <b-dropdown-item v-if="user" :to="{ name: 'settings' }">
      <i class="fa fa-cog fa-fw" aria-hidden="true" />
      <span class="ml-2">Settings</span>
    </b-dropdown-item>

    <b-dropdown-item
        v-if="!user"
        class="ml-2"
        variant="danger"
        :to="{ name: 'auth' }"
      >
        Get started <span class="d-none d-sm-inline"> — it's free!</span>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageThumbnail, getImageUrl } from '@/utils';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';

export default {
  getImageUrl,

  components: {
    UploadWallpaperButton,
  },

  data() {
    return {
      profile: {},
      avatarImage: null,
    }
  },

  computed: {
    ...mapState(['board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme', 'navPosition', 'sortedBoards', 'latestRelease', 'isVerticalNav', 'isBoardOwner']),

    year() {
      return new Date().getFullYear();
    },

    tooltipSettings() {
      if (this.navPosition === 'left') return 'right';

      return 'bottomright';
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

    isBoardPage() {
      return this.$route.name === 'board';
    },

    isBoardEditPage() {
      return this.$route.name === 'board.edit';
    },

    isBoardCreatePage() {
      return this.$route.name === 'create.board';
    },

    isGamePage() {
      return this.$route.name === 'game';
    },

    boardButtonTitle() {
      if (this.isBoardEditPage || this.isBoardPage) return this.board.name;

      return 'Boards';
    },

    // gameButtonTitle() {
    //   if (this.isGamePage) return this.game.name;

    //   return 'Games';
    // }
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
