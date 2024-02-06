<template lang="html">
  <b-link
    class="d-inline-flex"
    @click="$router.push({ name: 'public.profile', params: { userName: profile.userName } })"
  >
    <b-avatar
      v-b-tooltip.hover
      :title="`@${profile.userName}`"
      :src="avatarImage"
      size="80px"
    />
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
