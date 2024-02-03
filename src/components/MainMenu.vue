<!-- TODO: get colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<template>
  <div class="main-menu h-100 w-100 d-flex" :class="{ 'd-flex flex-column': isVerticalNav }">
    <b-button
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      v-bind="dockDropdownProps"
      title="Home"
      :to="{ name: 'home' }"
    >
      <img src="logo.png" alt="" height="26" />
    </b-button>

    <BoardsDockDropdown v-if="user" />

    <b-dropdown
      v-if="user"
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Games"
      :toggle-class="isGamePage ? 'px-2 py-0' : null"
      v-bind="dockDropdownProps"
    >
      <template #button-content>
        <!-- TODO: fix this -->
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
        <i class="fa-solid fa-heart fa-fw" />
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

    <TagsDockDropdown v-if="user" />

    <b-dropdown
      v-if="user"
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Notes"
      v-bind="dockDropdownProps"
    >
      <template #button-content>
        <i class="fa fa-sticky-note fa-fw" aria-hidden="true" />

        <span v-if="!isVerticalNav" class="d-none d-md-inline">
          Notes
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
      v-if="user"
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

    <SettingsDockDropdown v-if="user" />
    <ProfileDockDropdown v-if="user" />

    <div v-else class="ml-auto d-flex align-items">
      <b-button
        v-bind="dockDropdownProps"
        :to="{ name: 'search' }"
        v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
        title="Search"
      >
        <i class="fa fa-search fa-fw" aria-hidden="true" />
      </b-button>

      <b-button
          variant="danger"
          class="ml-2"
          :to="{ name: 'auth' }"
        >
          Get started <span class="d-none d-sm-inline"> — it's free!</span>
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageUrl } from '@/utils';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import BoardsDockDropdown from '@/components/Dock/BoardsDockDropdown';
import ProfileDockDropdown from '@/components/Dock/ProfileDockDropdown';
import SettingsDockDropdown from '@/components/Dock/SettingsDockDropdown';
import TagsDockDropdown from '@/components/Dock/TagsDockDropdown';

export default {
  getImageUrl,

  components: {
    UploadWallpaperButton,
    BoardsDockDropdown,
    ProfileDockDropdown,
    SettingsDockDropdown,
    TagsDockDropdown,
  },

  data() {
    return {
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
    ...mapGetters(['navPosition', 'latestRelease', 'isVerticalNav', 'dockDropdownProps']),

    routeName() {
      return this.$route.name;
    },

    isGamePage() {
      return this.$route.name === 'game';
    },

    gameButtonTitle() {
      if (this.isGamePage) return this.game.name;

      return 'Games';
    }
  },
}
</script>
