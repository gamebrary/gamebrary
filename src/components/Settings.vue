`<template lang="html">
  <b-navbar-nav class="ml-auto" v-if="user">
    <b-dropdown
      variant="link"
      v-b-tooltip.hover.left
      :title="notification ? 'New releases' : ''"
      toggle-class="text-decoration-none p-0"
      right
    >
      <template v-slot:button-content>
        <b-avatar
          v-if="user && user.photoURL"
          variant="info"
          square
          :badge="notification"
          badge-variant="danger"
          :src="user.photoURL"
        />
      </template>

      <tags-settings />
      <wallpaper-settings />
      <language />
      <themes />
      <b-dropdown-divider />
      <releases-modal />
      <about />
      <b-dropdown-divider />
      <account-modal />
    </b-dropdown>
  </b-navbar-nav>
</template>

<script>
import TagsSettings from '@/components/Settings/TagsSettings';
import AccountModal from '@/components/Settings/AccountModal';
import WallpaperSettings from '@/components/Settings/WallpaperSettings';
import ReleasesModal from '@/components/Settings/ReleasesModal';
import Themes from '@/components/Settings/Themes';
import Language from '@/components/Settings/Language';
import About from '@/components/Settings/About';
import { mapState } from 'vuex';

export default {
  components: {
    TagsSettings,
    AccountModal,
    WallpaperSettings,
    ReleasesModal,
    Themes,
    Language,
    About,
  },

  computed: {
    ...mapState(['user', 'notification']),
  },
};
</script>
