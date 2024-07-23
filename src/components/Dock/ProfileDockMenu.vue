<template>
    <div>
      <div class="position-relative text-center">
        <b-avatar
          :src="avatarImage"
          size="120"
          :title="displayUserName"
          :to="{ name: 'public.profile', params: { userName } }"
        />
      </div>

      <b-button
        :variant="darkTheme ? 'dark' : 'light'"
        :to="{ name: 'profile' }"
      >
        <i class="fa-regular fa-pen"></i>
      </b-button>

      <b-button
        block
        :variant="darkTheme ? 'dark' : 'light'"
        @click="signOut"
      >
        <i class="fa-regular fa-right-from-bracket"></i>
        <span class="ml-2">Log out</span>
      </b-button>
    </div>
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
    ...mapGetters(['dockButtonProps', 'darkTheme']),

    userName() {
      return this.profile?.userName;
    },

    displayUserName() {
      return this.userName
        ? `@${this.userName}`
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
