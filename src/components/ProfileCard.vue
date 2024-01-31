<template lang="html">
  <b-link
    class="cursor-pointer mb-3 d-flex"
    body-class="p-2"
    @click="$router.push({ name: 'public.profile', params: { userName: profile.userName } })"
  >
    <b-avatar
      :src="avatarImage"
      class="mr-3"
      size="80px"
      rounded
    />

    <b-link class="small text-center d-block">@{{ profile.userName }}</b-link>
  </b-link>
</template>

<script>
import { getImageThumbnail } from '@/utils';

export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      avatarImage: null,
    }
  },

  async mounted() {
    if (this.profile?.avatar) {
      const thumbnailRef = getImageThumbnail(this.profile?.avatar);

      this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef)
        .catch((e) => {});
    }
  },
};
</script>
