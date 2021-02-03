<template lang="html">
  <b-container class="pt-2" v-if="user">
    <div class="text-center my-4">
      <b-avatar
        v-if="user && user.photoURL"
        v-b-tooltip.hover.right
        variant="info"
        badge-variant="danger"
        :title="$t('navMenu.account')"
        :src="user.photoURL"
      />

      <h5 class="mt-2">{{ user.displayName }}</h5>
    </div>

    <b-tabs
      content-class="mt-3"
      align="center"
      small
      pills
    >
      <b-tab
        v-for="{ name, title, icon } in tabs"
        :key="name"
        :active="$route.name === name"
        @click="handleClick(name)"
      >
        <template #title>
          <i :class="`${icon} fa-fw`" aria-hidden />
          <span class="d-none d-md-inline">{{ title }}</span>
        </template>
      </b-tab>
    </b-tabs>

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
    handleClick(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>
