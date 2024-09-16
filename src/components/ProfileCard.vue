<template lang="html">
  <b-card>
    <div class="profile-card">
      <b-avatar
          v-b-tooltip.hover
          :title="`@${profile.userName}`"
          :src="avatarImage"
          :to="{ name: 'public.profile', params: { userName: profile.userName } }"
          size="80"
          rounded
        />

        <aside class="d-flex flex-column">
          <router-link :to="{ name: 'public.profile', params: { userName: profile.userName } }">
            <strong>@{{ profile.userName }}</strong>
          </router-link>
          <q v-if="profile.bio">{{ profile.bio }}</q>
        </aside>
    </div>
  </b-card>
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


<style lang="scss" scoped>
.profile-card {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 80px auto;
}
</style>
