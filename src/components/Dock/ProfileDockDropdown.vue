<template>
    <b-dropdown
      v-b-tooltip.hover.auto="{ delay: { show: 500, hide: 50 } }"
      title="Profile"
      v-bind="dockDropdownProps"
      :class="isVerticalNav ? 'mt-auto' : 'ml-auto'"
      :toggle-class="avatarImage ? 'p-0' : null"
      no-caret
    >
      <template #button-content>
        <template>  
          <b-avatar
            v-if="avatarImage"
            :src="avatarImage"
            size="40"
            rounded
          />

          <b-img
            v-else
            src="/img/dock-icons/profile.png"
            alt="wikipedia"
            width="24"
          />
        </template>
      </template>

      <b-dropdown-text :class="darkTheme ? 'text-success' : 'text-danger'">
        {{ profileTitle }}
      </b-dropdown-text>

      <b-dropdown-item
        :to="{ name: 'profile' }"
      >
        <i class="fa-regular fa-rectangle-list fa-fw"></i>
          <span class="ml-2">Edit profile</span>
      </b-dropdown-item>

      <b-dropdown-item
        v-if="profile"
        :to="{ name: 'public.profile', params: { userName: profile.userName } }"
      >
        <i class="fa-regular fa-plus fa-fw" />
        <span class="ml-2">View profile</span>
      </b-dropdown-item>

      <b-dropdown-item
        @click="signOut"
      >
        <i class="fa-regular fa-rectangle-list fa-fw"></i>
          <span class="ml-2">Log out</span>
      </b-dropdown-item>
    </b-dropdown>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageThumbnail } from '@/utils';

export default {
  data() {
    return {
      profile: null,
      avatarImage: null,
    };
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['dockDropdownProps', 'darkTheme', 'isVerticalNav']),

    profileTitle() {
      return this.profile?.userName
        ? `@${this.profile.userName}`
        : 'Profile';
    },
  },

  mounted() {
    if (this.user) this.load();
  },

  methods: {
    async load() {
      this.profile = await this.$store.dispatch('LOAD_PROFILE').catch(() => {});
      
      if (this.profile?.avatar) this.loadAvatarImage();
    },
    
    async loadAvatarImage() {
      const thumbnailRef = getImageThumbnail(this.profile?.avatar);
    
      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
    },

    async signOut() {
			await this.$store.dispatch('SIGN_OUT');
			this.$bvToast.toast('Logged out');
			this.$store.commit('CLEAR_SESSION');
			this.$router.replace({ name: 'home' });
		},
  }
}
</script>

<style scoped>
/* Your CSS code here */
</style>
