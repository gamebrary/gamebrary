<template lang="html">
  <b-container fluid class="p-2">
    <b-row no-gutters>
      <b-col cols="4" sm="3" lg="2">
        <b-list-group>
          <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'general.settings' }">
            <i class="mr-2 fas fa-sliders-h fa-fw" aria-hidden />
            <small>General</small>
          </b-list-group-item>

          <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'wallpapers.settings' }">
            <i class="mr-2 fa-solid fa-images fa-fw" aria-hidden />
            <small>Wallpapers</small>
          </b-list-group-item>

          <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'profile.settings' }">
            <i class="mr-2 fa-solid fa-user fa-fw" aria-hidden />
            <small>Profile</small>
          </b-list-group-item> -->

          <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'notes.settings' }">
            <i class="mr-2 fa-solid fa-note-sticky fa-fw" aria-hidden />
            <small>Notes</small>
          </b-list-group-item>

          <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'team.settings' }">
            <i class="mr-2 fa-solid fa-tags fa-fw" aria-hidden />
            <small>Tags</small>
          </b-list-group-item>

          <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'account.settings' }">
            <i class="mr-2 fa-solid fa-user-shield fa-fw" aria-hidden />
            <small>Account</small>
          </b-list-group-item>

          <!-- <b-list-group-item exact exact-active-class="bg-primary text-white" :to="{ name: 'steam.settings' }">
            <i class="mr-2 fab fa-steam fa-fw" aria-hidden></i>
            <small>Steam</small>
          </b-list-group-item> -->

          <!-- <hr /> -->

          <!-- <b-list-group-item :to="{ name: 'profiles' }">
            <i class="mr-2 fa-solid fa-people-group fa-fw" aria-hidden />
            <small>Profiles</small>
          </b-list-group-item> -->

          <!-- <b-list-group-item :to="{ name: 'dev.tools' }">
            <i class="mr-2 fa-solid fa-code fa-fw" aria-hidden />

            <small>Dev tools</small>
          </b-list-group-item> -->

          <!-- <a
            href="https://github.com/romancm/gamebrary"
            target="_blank"
          >
            <i class="mr-2 fab fa-github"></i>
          </a> -->

          <!-- <small class="my-2">
            <a v-b-modal.keyboard-shortcuts>Keyboard shortcuts</a>
          </small> -->

          <!-- {{ $t('global.donateMessage') }} -->
          <!-- <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
            {{ $t('global.donating') }}
          </a> -->

          <!-- <a href="https://github.com/romancm/gamebrary/issues" target="_blank">
            {{ $t('global.reportBugs') }}
          </a> -->

          <!-- <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
            {{ $t('global.submitFeedback') }}
          </a> -->
        </b-list-group>

        <small>&copy; 2021 Gamebrary</small>
      </b-col>

      <b-col cols="8" sm="9" lg="10">
        <router-view />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
// import AccountSettingsPage from '@/pages/AccountSettingsPage';
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import GeneralSettingsPage from '@/pages/GeneralSettingsPage';
import { mapState } from 'vuex';

export default {
  components: {
    // ProfileSettingsPage,
    // AccountSettingsPage,
    // SteamSettingsPage,
    // GeneralSettingsPage,
  },

  computed: {
    ...mapState(['user']),
  },
};
</script>
