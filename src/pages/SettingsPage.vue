<template lang="html">
  <b-container fluid>
    <b-row no-gutters>
      <b-col cols="2">
        <b-list-group>
          <b-list-group-item :to="{ name: 'general-settings' }">
            <i class="fas fa-sliders-h fa-fw" aria-hidden />
            General
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'wallpapers-settings' }">
            <i class="fa-solid fa-images fa-fw" aria-hidden />
            Wallpapers
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'profile-settings' }">
            <i class="fa-solid fa-user fa-fw" aria-hidden />
            Profile
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'notes-settings' }">
            <i class="fa-solid fa-note-sticky fa-fw" aria-hidden />
            Notes
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'tags-settings' }">
            <i class="fa-solid fa-tags fa-fw" aria-hidden />
            Tags
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'account-settings' }">
            <i class="fa-solid fa-user-shield fa-fw" aria-hidden />
            Account
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'steam-settings' }">
            <i class="fab fa-steam fa-fw" aria-hidden></i>
            Steam
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'releases' }">
            <i class="fas fa-rocket fa-fw" aria-hidden></i>
            Releases
          </b-list-group-item>

          <b-list-group-item :to="{ name: 'profiles' }">
            <i class="fa-solid fa-people-group fa-fw" aria-hidden />
            Profiles
          </b-list-group-item>

          <router-link to="dev-tools">Dev tools</router-link>
          <router-link to="releases">Releases</router-link>
          <a
            href="https://github.com/romancm/gamebrary"
            target="_blank"
          >
            <i class="fab fa-github"></i>
          </a>

          <a v-b-modal.keyboard-shortcuts>Keyboard shortcuts</a>

          {{ $t('global.donateMessage') }}
          <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
            {{ $t('global.donating') }}
          </a>

          <a href="https://github.com/romancm/gamebrary/issues" target="_blank">
            {{ $t('global.reportBugs') }}
          </a>

          <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
            {{ $t('global.submitFeedback') }}
          </a>
        </b-list-group>

        <small>&copy; 2021 Gamebrary</small>
      </b-col>

      <b-col>
        <router-view />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ProfileSettingsPage from '@/pages/ProfileSettingsPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import SteamSettingsPage from '@/pages/SteamSettingsPage';
import GeneralSettingsPage from '@/pages/GeneralSettingsPage';

export default {
  components: {
    ProfileSettingsPage,
    AccountSettingsPage,
    SteamSettingsPage,
    GeneralSettingsPage,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
