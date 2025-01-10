<template>
  <b-button
    block
    class="text-left"
    size="lg"
    :to="userName ? { name: 'public.profile', params: { userName } } : { name: 'create.profile' }"
  >
    <b-avatar
      v-if="avatarImage"
      :src="avatarImage"
      :title="displayUserName"
      size="32"
      :to="userName ? { name: 'public.profile', params: { userName } } : null"
    />

    <i v-else class="fa-regular fa-user fa-fw" />

    {{ userName ? displayUserName : 'Profile' }}
  </b-button>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getImageThumbnail } from '@/utils';

export default {
  data() {
    return {
      avatarImage: null,
      wallpaperImage: null,
    };
  },

  computed: {
    ...mapState(['board', 'user', 'profile']),
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
      await this.$store.dispatch('LOAD_PROFILE').catch(() => {});

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
.profile-card {
  margin-top: -72px;
  padding-top: 80px;

  /* TODO: make this responsive */
  /* @media(max-width: 780px) {
    height: 16px;
  } */
}
</style>
