<template lang="html">
  <b-container fluid>
    <page-title title="Settings" />

    <b-list-group>
      <b-list-group-item :to="{ name: 'general-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        General
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'wallpapers-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        Wallpapers
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'profile-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        Profile
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'notes-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        Notes
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'tags-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        Tags
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'account-settings' }">
        <i class="fas fa-sliders-h fa-fw" aria-hidden />
        Account
      </b-list-group-item>

      <b-list-group-item :to="{ name: 'steam-settings' }">
        <i class="fab fa-steam fa-fw" aria-hidden></i>
        Steam
      </b-list-group-item>
    </b-list-group>

    <router-view />

    <a href="#">Keyboard shortcuts</a>
    <a href="#">Releases</a>
  </b-container>
</template>
