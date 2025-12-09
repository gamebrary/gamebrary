<template>
  <router-link
    :to="userName ? { name: 'public.profile', params: { userName } } : { name: 'create.profile' }"
    class="btn btn-lg w-100 text-start d-block"
    :class="darkTheme ? 'btn-dark' : 'btn-light'"
  >
    <img
      v-if="avatarImage"
      :src="avatarImage"
      :alt="displayUserName"
      class="rounded-circle me-2"
      style="width: 32px; height: 32px; object-fit: cover;"
    />

    <i v-else class="fa-regular fa-user fa-fw me-2" />

    {{ userName ? displayUserName : 'Profile' }}
  </router-link>
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
}
</style>
