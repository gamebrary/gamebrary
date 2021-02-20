<template lang="html">
  <b-container class="pt-2" v-if="user">
    <div class="text-center my-4">
      <b-avatar
        v-if="user && user.photoURL"
        v-b-tooltip.hover.right
        badge-variant="danger"
        :title="$t('navMenu.account')"
        :src="user.photoURL"
      />

      <h5 class="mt-2">Welcome, {{ user.displayName }}!</h5>
    </div>

    <b-button-group class="mb-4">
      <b-button
        v-for="{ name, title, icon } in tabs"
        :key="name"
        :variant="tabButtonVariant(name)"
        @click="handleClick(name)"
      >
        <i :class="`${icon} fa-fw`" aria-hidden />
        <span class="d-none d-md-inline">{{ title }}</span>
      </b-button>
    </b-button-group>

    <b-row>
      <router-view />
    </b-row>

    <!-- <page-footer /> -->
  </b-container>
</template>

<script>
import PageFooter from '@/components/PageFooter';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    PageFooter,
  },

  data() {
    return {
      tabs: [
        {
          name: 'boards',
          title: 'Boards',
          icon: 'fas fa-columns',
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
          name: 'profile',
          title: 'Profile',
          icon: 'fas fa-user',
        },
        {
          name: 'settings',
          title: 'Settings',
          icon: 'fas fa-cog',
        },
      ],
    };
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['nightMode']),

    routeName() {
      return this.$route.name;
    },
  },

  methods: {
    tabButtonVariant(name) {
      const dark = this.$route.name === name ? 'secondary' : 'info';
      const light = this.$route.name === name ? 'info' : 'light';

      return this.nightMode ? dark : light;
    },

    handleClick(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>
