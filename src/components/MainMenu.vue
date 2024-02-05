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
      <img src="/logo.png" alt="" height="26" />
    </b-button>

    <BoardsDockDropdown v-if="user" />

    <GamesDockDropdown v-if="user" />
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
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import BoardsDockDropdown from '@/components/Dock/BoardsDockDropdown';
import ProfileDockDropdown from '@/components/Dock/ProfileDockDropdown';
import SettingsDockDropdown from '@/components/Dock/SettingsDockDropdown';
import TagsDockDropdown from '@/components/Dock/TagsDockDropdown';
import GamesDockDropdown from '@/components/Dock/GamesDockDropdown';

export default {

  components: {
    UploadWallpaperButton,
    BoardsDockDropdown,
    ProfileDockDropdown,
    SettingsDockDropdown,
    TagsDockDropdown,
    GamesDockDropdown,
  },

  computed: {
    ...mapState(['board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers']),
    ...mapGetters(['navPosition', 'latestRelease', 'isVerticalNav', 'dockDropdownProps']),
  },
}
</script>
