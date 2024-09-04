<template>
  <div
    class="py-4 d-flex flex-column text-center profile-card"
    :style="style"
  >
    <!-- <div v-else>
      Choose your user name!
    </div> -->

    <b-avatar
      :src="avatarImage"
      size="120"
      class="mx-auto mb-2"
      :title="displayUserName"
      :to="userName ? { name: 'public.profile', params: { userName } } : null"
    />

    <div class="mx-3">
      <p v-if="!userName">
        Welcome! Let's get you started.

        <br />

        <b-link
          :to="{ name: 'create.profile' }"
        >
          Choose a username
        </b-link>
      </p>

      <b-link
        v-if="userName"
        :to="{ name: 'public.profile', params: { userName } }"
      >
        {{ displayUserName }}
      </b-link>
    </div>
  </div>
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
}
</style>
