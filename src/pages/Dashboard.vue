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


    <b-tabs content-class="mt-3" align="center">
      <b-tab
        v-for="{ name, title } in tabs"
        :key="name"
        :title="title"
        :active="$route.name === name"
        @click="$router.push({ name })"
      />
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
        },
        {
          name: 'tags',
          title: 'Tags',
        },
        {
          name: 'notes',
          title: 'Notes',
        },
        {
          name: 'wallpapers',
          title: 'Wallpapers',
        },
        {
          name: 'account',
          title: 'Account',
        },
        {
          name: 'settings',
          title: 'Settings',
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
};
</script>
