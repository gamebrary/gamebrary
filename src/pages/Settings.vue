<template lang="html">
  <b-container class="pt-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="m-0">Settings</h3>
    </div>

    <languages />
    <theme-selector />

    <hr />

    <b-list-group>
      <b-list-group-item :to="{ name: 'wallpapers' }">
        <i class="fas fa-image fa-fw" aria-hidden />
        Wallpapers
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'notes' }">
        <i class="fas fa-sticky-note fa-fw" aria-hidden />
        Notes
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'tags' }">
        <i class="fas fa-sticky-note fa-fw" aria-hidden />
        {{ $t('navMenu.tags') }}
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'about' }">
        <i class="fas fa-info fa-fw" aria-hidden />
        About
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'releases' }">
        <i class="fas fa-bullhorn fa-fw" aria-hidden />
        Releases
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'account' }">
        <b-avatar
          v-if="user && user.photoURL"
          v-b-tooltip.hover.right
          size="22px"
          variant="info"
          badge-variant="danger"
          :title="$t('navMenu.account')"
          :src="user.photoURL"
        />

        Account
      </b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
import Languages from '@/components/Settings/Languages';
import ThemeSelector from '@/components/Settings/ThemeSelector';
import { mapState } from 'vuex';

export default {
  components: {
    Languages,
    ThemeSelector,
  },

  computed: {
    ...mapState(['settings', 'user']),
  },
};
</script>
