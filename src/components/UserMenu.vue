<template lang="html">
  <b-dropdown>
    <template #button-content>
      <b-avatar
        rounded
        :src="user && user.photoURL ? user.photoURL : null"
      />
      <!-- <b-button
        v-if="dev"
        :variant="routeName === 'profile' ? 'primary' : ''"
      > -->


        <!-- <span v-if="profile.userName">
          @{{ profile.userName }}
        </span> -->

        <!-- <span v-else>Profile</span> -->
      <!-- </b-button> -->
    </template>

    <b-dropdown-item
      v-for="{ name, title, icon } in menuButtons"
      :key="name"
      :variant="name === routeName ? 'primary' : ''"
      block
      class="text-left"
      :to="{ name }"
    >
      <b-avatar
        v-if="name === 'profile'"
        rounded
        size="38"
        :src="user.photoURL ? user.photoURL : null"
      />

      <i v-else :class="`${icon} fa-fw`" aria-hidden />

      {{ title }}
    </b-dropdown-item>

    <b-button
      v-for="{ name, title, icon } in secondaryButtons"
      :key="name"
      :variant="name === routeName ? 'primary' : ''"
      block
      class="text-left"
      :to="{ name }"
    >
      <i :class="`${icon} fa-fw`" aria-hidden /> {{ title }}
    </b-button>

    <b-button
      v-if="dev"
      v-for="{ name, title, icon } in betaFeatures"
      :key="name"
      :variant="name === routeName ? 'primary' : ''"
      block
      class="text-left"
      :to="{ name }"
    >
      <i :class="`${icon} fa-fw`" aria-hidden /> {{ title }}
    </b-button>

    <hr>

    <b-button
      v-b-modal.keyboard-shortcuts
      block
      class="d-none d-sm-block"
      size="sm"
    >
      Keyboard shortcuts
    </b-button>

    <b-button
      variant="transparent"
      href="https://github.com/romancm/gamebrary"
      target="_blank"
    >
      <i class="fab fa-github"></i>
    </b-button>
    <small>&copy; 2021 Gamebrary</small>
    <div>

    <!-- {{ $t('global.donateMessage') }}
    <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
      {{ $t('global.donating') }}
    </a>
    ,
    <a href="https://github.com/romancm/gamebrary/issues" target="_blank">
      {{ $t('global.reportBugs') }}
    </a>
    {{ $t('global.or') }}
    <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
      {{ $t('global.submitFeedback') }}
    </a>
    . -->

    </div>
  </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      menuButtons: [
        {
          name: 'boards',
          title: 'Boards',
          icon: 'fas fa-th-large',
        },
        {
          name: 'tags',
          title: 'Tags',
          icon: 'fas fa-tags',
        },
        {
          name: 'notes',
          title: 'Notes',
          icon: 'fas fa-sticky-note',
        },
        {
          name: 'wallpapers',
          title: 'Wallpapers',
          icon: 'fas fa-images',
        },
        {
          name: 'settings',
          title: 'Settings',
          icon: 'fas fa-cog',
        },
      ],
      secondaryButtons: [
        {
          name: 'releases',
          title: 'Releases',
          icon: 'fas fa-rocket',
        },
      ],
      betaFeatures: [
        {
          name: 'profiles',
          title: 'Profiles',
          icon: 'fas fa-th-large',
        },
        {
          name: 'dev-tools',
          title: 'Dev tools',
          icon: 'fas fa-tags',
        },
      ],
    };
  },

  computed: {
    ...mapState(['user', 'profile']),
    ...mapGetters(['isRTL']),

    dev() {
      // TODO: put in getter or util
      return process.env.NODE_ENV === 'development';
    },

    routeName() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>

