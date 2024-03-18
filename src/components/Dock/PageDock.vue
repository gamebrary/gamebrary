<!-- TODO: get better (and) colorized icons for active state -->
<!-- TODO: bring settings to nav, remove page. -->
<!-- TODO: highlight menu item if active -->
<template>
  <div class="main-menu h-100 w-100 d-flex" :class="{ 'd-flex flex-column': isVerticalNav }">
    <b-button
      v-if="!user"
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      v-bind="dockDropdownProps"
      title="Home"
      class="position-relative"
      :to="{ name: 'home' }"
    >
      <!-- <div
        v-if="status"
        class="position-absolute w-100 h-100 rounded d-flex align-items-center justify-content-center"
        :class="statusClass"
          style="left: 0; top: 0;"
      >
        <i
          v-if="status === 'SUCCESS'"
          class="fa-solid fa-fw fa-check"
        />
        

        <b-spinner
          v-else-if="status === 'LOADING'"
          small
        />

        <i
          v-else-if="status === 'ERROR'"
          class="fa-solid fa-fw fa-times"
        />
      </div> -->
      
      <img
        src="/logo.png"
        alt=""
        height="26"
      />
    </b-button>

    <BoardsDockDropdown v-if="user" />
    <GamesDockDropdown v-if="user" />
    <TagsDockDropdown v-if="user" />
    <NotesDockDropdown v-if="user" />

    <b-dropdown
      v-if="user"
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Wallpapers"
      v-bind="dockDropdownProps"
    >
      <template #button-content>
        <img
          src="/img/dock-icons/wallpapers.png"
          alt="Wallpapers"
          width="24"
        />
      </template>

      <b-dropdown-item
        :to="{ name: 'wallpapers' }"
      >
        <img
          src="/img/dock-icons/my-wallpapers.png"
          alt="Wallpapers"
          width="24"
        />
        <span class="ml-2">My wallpapers</span>
      </b-dropdown-item>

      <UploadWallpaperButton v-if="user" />
    </b-dropdown>

    <SettingsDockDropdown v-if="user" />

    <div class="ml-auto d-flex align-items">
      <b-button
        v-bind="dockDropdownProps"
        :to="{ name: 'search' }"
        v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
        title="Search"
      >
        <!-- <i class="fa fa-search fa-fw" aria-hidden="true" /> -->
        <img
          src="/img/dock-icons/search.png"
          alt="wikipedia"
          width="24"
        />
      </b-button>

      <ProfileDockDropdown v-if="user" />

      <b-button
        v-else
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
// import { STATUS_VARIANTS } from '@/constants';
import UploadWallpaperButton from '@/components/UploadWallpaperButton';
import BoardsDockDropdown from '@/components/Dock/BoardsDockDropdown';
import ProfileDockDropdown from '@/components/Dock/ProfileDockDropdown';
import SettingsDockDropdown from '@/components/Dock/SettingsDockDropdown';
import TagsDockDropdown from '@/components/Dock/TagsDockDropdown';
import NotesDockDropdown from '@/components/Dock/NotesDockDropdown';
import GamesDockDropdown from '@/components/Dock/GamesDockDropdown';

export default {

  components: {
    UploadWallpaperButton,
    BoardsDockDropdown,
    ProfileDockDropdown,
    SettingsDockDropdown,
    TagsDockDropdown,
    NotesDockDropdown,
    GamesDockDropdown,
  },

  computed: {
    ...mapState(['board', 'boards', 'settings', 'user', 'games', 'notes', 'tags', 'wallpapers']),
    ...mapGetters(['navPosition', 'latestRelease', 'isVerticalNav', 'dockDropdownProps']),
  },
}
</script>
