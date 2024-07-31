<!-- TODO: link to create page if profile not created -->
<template>
  <div
    class="py-3 d-flex flex-column text-center"
    :style="style"
  >
    <b-avatar
      :src="avatarImage"
      size="120"
      class="mx-auto mb-2"
      :title="displayUserName"
      :to="{ name: 'public.profile', params: { userName } }"
    />

    <b-link
      :to="{ name: 'public.profile', params: { userName } }"
    >
      {{ displayUserName }}
    </b-link>
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
      wallpaperImage: null,
    };
  },

  computed: {
    ...mapState(['board', 'user']),
    ...mapGetters(['darkTheme']),

    style() {
      return this.wallpaperImage
        ? `background-image: url('${this.wallpaperImage}'); background-size: cover;`
        : null;
    },

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

      if (this.profile?.wallpaper) {
        this.wallpaperImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile?.wallpaper)
          .catch((e) => {});
      }
    },
    
    async loadAvatarImage() {
      const thumbnailRef = getImageThumbnail(this.profile?.avatar);
    
      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef);
    },
  }
}
</script>

<style scoped>
/* Your CSS code here */
</style>
