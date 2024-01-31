<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<template>
  <div class="main-menu w-100 d-flex" :class="{ 'd-flex flex-column': isVerticalNav }">
    <b-dropdown id="dropdown-form" text="Dropdown with form" ref="dropdown" class="m-2">
      <b-dropdown-form>
        <b-form-group label="Email" label-for="dropdown-form-email" @submit.stop.prevent>
          <b-form-checkbox v-model="checked" name="check-button" switch>
      Switch Checkbox <b>(Checked: {{ checked }})</b>
    </b-form-checkbox>

          <b-form-select v-model="selected" :options="options"></b-form-select>

          <div @click.native.stop.prevent>
            <b-dropdown @click.native.stop.prevent id="dropdown-1" text="Dropdown Button" class="m-md-2">
            <b-dropdown-item @click.native.stop.prevent>First Action</b-dropdown-item>
            <b-dropdown-item @click.native.stop.prevent>Second Action</b-dropdown-item>
            <b-dropdown-item @click.native.stop.prevent>Third Action</b-dropdown-item>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item active>Active action</b-dropdown-item>
            <b-dropdown-item disabled>Disabled action</b-dropdown-item>
          </b-dropdown>
          </div>


          <b-form-input
            id="dropdown-form-email"
            size="sm"
            placeholder="email@example.com"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="dropdown-form-password">
          <b-form-input
            id="dropdown-form-password"
            type="password"
            size="sm"
            placeholder="Password"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
        <b-button variant="primary" size="sm" @click="onClick">Sign In</b-button>
      </b-dropdown-form>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item-button>New around here? Sign up</b-dropdown-item-button>
      <b-dropdown-item-button>Forgot Password?</b-dropdown-item-button>
    </b-dropdown>

    <b-button
      v-b-tooltip.hover
      v-bind="dropdownProps"
      title="Home"
      :to="{ name: 'home' }"
    >
      <img src="logo.png" alt="" height="26" />
    </b-button>

    <b-dropdown
      v-b-tooltip.hover
      :title="boardButtonTitle"
      v-bind="dropdownProps"
    >
      <template #button-content>
        <i class="fa-regular fa-rectangle-list fa-fw" />
        
        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          {{ boardButtonTitle }}
        </span>
      </template>

      <b-dropdown-item
        :to="{ name: 'boards' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My boards</span>
      </b-dropdown-item>

      <b-dropdown-group v-if="user">
        <b-dropdown-item
          v-for="board in recentlyUpdatedBoards"
          :key="board.id"
          :to="{ name: 'board', params: { id: board.id } }"
        >
          <small>{{ board.name }}</small>
        </b-dropdown-item>
      </b-dropdown-group>

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

      <b-dropdown-item
          v-if="showBoardActions"
          disabled
        >
          <i class="fa-solid fa-clone fa-fw"></i>
          <span class="ml-2">Copy board</span>
        </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto
      title="Games"
      toggle-class="px-2 py-0"
      v-bind="dropdownProps"
    >
      <template #button-content>
        <i class="fa-solid fa-gamepad fa-fw" />

        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          {{ gameButtonTitle }}
        </span>
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

      <b-dropdown-item
        :to="{ name: 'home' }"
        disabled
      >
        <i
          class="fa-solid fa-stopwatch fa-fw"
          aria-hidden="true"
        />
        <span class="ml-2">Progresses</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover
      title="Tags"
      v-bind="dropdownProps"
    >
      <template #button-content>
        <i class="fa-solid fa-tags fa-fw" />
        
        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Tags
        </span>
      </template>

      <b-dropdown-text
          v-for="({ textColor, bgColor, name }, index) in tags"
          :key="name"
          block
          class="rounded mb-1"
          :style="`background-color: ${bgColor};`"
          @click="$router.push({ name: 'tag.edit', params: { id: index } })"
        >
        <span :style="`color: ${textColor}`">{{ name }}</span>
      </b-dropdown-text>

      <!-- <b-dropdown-item
        :to="{ name: 'tags' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My tags</span>
      </b-dropdown-item> -->

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
      title="Notes"
      v-bind="dropdownProps"
    >
      <template #button-content>
        <i class="fa fa-sticky-note fa-fw" aria-hidden="true" />

        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Wallpapers
        </span>
      </template>

      <b-dropdown-item
        :to="{ name: 'notes' }"
      >
      <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">My notes</span>
      </b-dropdown-item>

    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto
      title="Wallpapers"
      v-bind="dropdownProps"
    >
      <template #button-content>
        <i class="fa fa-images fa-fw" aria-hidden="true" />

        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Wallpapers
        </span>
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
      v-if="user"
      v-b-tooltip.hover.auto
      title="Profile"
      :variant="darkTheme ? 'black' : 'light'"
      no-caret
    >
      <template #button-content>
        <template>  
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

          <!-- {{ profileTitle }} -->
        </template>
      </template>

      <b-dropdown-item
        :to="{ name: 'profile' }"
      >
        <i class="fa-regular fa-rectangle-list fa-fw"></i>
          <span class="ml-2">Edit profile</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'public.profile', params: { userName: profile.userName } }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">View profile</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto
      title="Preferences"
      :variant="darkTheme ? 'black' : 'light'"
      no-caret
    >
      <template #button-content>
        <i class="fa-solid fa-sliders fa-fw" />
        
        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Settings
        </span>
      </template>

      <b-dropdown-item
        :to="{ name: 'settings' }"
      >
        <i class="fa-regular fa-rectangle-list fa-fw"></i>
        <span class="ml-2">Settings</span>
      </b-dropdown-item>

      <b-dropdown-item
        href="https://github.com/romancm/gamebrary/"
        target="_blank"
      >
        <i class="fa-brands fa-github fa-fw"></i>
        GitHub
      </b-dropdown-item>

      <b-dropdown-item v-b-modal.keyboard-shortcuts>
        <i class="fa-solid fa-keyboard fa-fw" />
        <span class="ml-2">Keyboard Shortcuts</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'help' }"
        id="help"
      >
        <i class="fa-regular fa-circle-question fa-fw" aria-hidden="true" />
        <span class="ml-2">Help</span>
      </b-dropdown-item>

      <b-dropdown-item disabled>
        <i class="fa-solid fa-language" />
        <span class="ml-2">Change language</span>
      </b-dropdown-item>

      <b-dropdown-item
        :to="{ name: 'steam.settings' }"
        disabled
      >
        <i class="fab fa-steam fa-fe" aria-hidden />
        <span class="ml-2">Steam</span>
      </b-dropdown-item>
    </b-dropdown>

    <b-button
      class="ml-auto"
      :to="{ name: 'search' }"
      v-b-tooltip.hover.auto
      title="Search"
    >
      <i class="fa fa-search fa-fw" aria-hidden="true" />
    </b-button>

    <b-button
        v-if="!user"
        class="ml-auto"
        variant="danger"
        :to="{ name: 'auth' }"
      >
        Get started <span class="d-none d-sm-inline"> — it's free!</span>
    </b-button>
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
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'This is First option' },
        { value: 'b', text: 'Selected Option' },
        { value: { C: '3PO' }, text: 'This is an option with object value' },
        { value: 'd', text: 'This one is disabled', disabled: true }
      ],
    }
  },

  computed: {
    ...mapState(['board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers', 'game']),
    ...mapGetters(['darkTheme', 'navPosition', 'sortedBoards', 'latestRelease', 'isVerticalNav', 'isBoardOwner']),

    dropdownProps() {
      return {
        variant: this.darkTheme ? 'black' : 'light',
        dropup: this.navPosition === 'bottom',
        dropright: this.navPosition === 'left',
        dropleft: this.navPosition === 'right',
        noCaret: true,
      };
    },

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
      return this.sortedBoards.filter(({ lastUpdated }) => Boolean(lastUpdated)).slice(0, 3);
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

    gameButtonTitle() {
      if (this.isGamePage) return this.game.name;

      return 'Games';
    }
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
