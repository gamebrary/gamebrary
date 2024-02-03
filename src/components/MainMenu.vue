<!-- TODO: get colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<template>
  <div class="main-menu w-100 d-flex" :class="{ 'd-flex flex-column': isVerticalNav }">
    <b-button
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      v-bind="dockDropdownProps"
      title="Home"
      :to="{ name: 'home' }"
    >
      <img src="logo.png" alt="" height="26" />
    </b-button>

    <BoardsDockDropdown />

    <b-dropdown
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Games"
      toggle-class="px-2 py-0"
      v-bind="dockDropdownProps"
    >
      <template #button-content>
        <div class="d-flex align-items-center">
          <b-img
            v-if="isGamePage && !isVerticalNav"
            :src="$options.getImageUrl(game)"
            :alt="game.name"
            height="32"
            style="border-radius: 3px;"
          />

          <i v-else class="fa-solid fa-gamepad fa-fw" />

          <span v-if="!isVerticalNav" class="d-none d-md-inline">
            <span class="ml-2">{{ gameButtonTitle }}</span>
          </span>
        </div>
      </template>

      
      <b-dropdown-group v-if="isGamePage" class="p-1 bg-light m-1 rounded">
        <b-dropdown-item-button @click="$router.push({ name: 'game.notes', params: { id: game.id, slug: game.slug } })">
          Add note
        </b-dropdown-item-button>
        <b-dropdown-item v-b-modal.gameTagsModal>Edit tags</b-dropdown-item>
        <b-dropdown-item v-b-modal.addRemoveGameModal>Add to list</b-dropdown-item>
      </b-dropdown-group>

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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Tags"
      v-bind="dockDropdownProps"
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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Notes"
      v-bind="dockDropdownProps"
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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Wallpapers"
      v-bind="dockDropdownProps"
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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      v-bind="dockDropdownProps"
    >
      <template #button-content>
        <i class="fa-solid fa-sliders fa-fw" />
        
        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Settings
        </span>
      </template>

      <!-- <b-dropdown-form>
        <b-form-group label="Email" label-for="dropdown-form-email" @submit.stop.prevent>
          <b-form-checkbox v-model="checked" name="check-button" switch>
            Switch Checkbox <b>(Checked: {{ checked }})</b>
          </b-form-checkbox>

          <b-form-select v-model="selected" :options="options"></b-form-select>
        </b-form-group>

        <b-form-group label="Password" label-for="dropdown-form-password">
          <b-form-input
            id="dropdown-form-password"
            type="password"
            size="sm"
            placeholder="Password"
          />
        </b-form-group>

        <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
        <b-button variant="primary" size="sm" @click="onClick">Sign In</b-button>
      </b-dropdown-form> -->

      <b-dropdown-divider />
      <b-dropdown-item-button>New around here? Sign up</b-dropdown-item-button>
      <b-dropdown-item-button>Forgot Password?</b-dropdown-item-button>
    </b-dropdown>

    <b-dropdown
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
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
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
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
import BoardsDockDropdown from '@/components/Dock/BoardsDockDropdown';

export default {
  getImageUrl,

  components: {
    UploadWallpaperButton,
    BoardsDockDropdown,
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
    ...mapGetters(['darkTheme', 'navPosition', 'latestRelease', 'isVerticalNav', 'dockDropdownProps']),

    routeName() {
      return this.$route.name;
    },

    profileTitle() {
      return this.profile?.userName
        ? `@${this.profile.userName}`
        : 'Profile';
    },

    isGamePage() {
      return this.$route.name === 'game';
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
