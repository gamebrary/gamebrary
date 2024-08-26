<!-- TODO: standardize title and subtitle -->
<!-- TODO: finish replacing remaining places -->
<template lang="html">
  <div class="d-flex align-items-center justify-content-between p-3 bg-danger">
    <slot />

    <b-button
      @click="$emit('hide')"
      :variant="darkTheme ? 'black' : 'white'"
    >
      <i class="fa-solid fa-xmark" />
    </b-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  // props: {
  //   profile: {
  //     type: Object,
  //     required: true,
  //   },
  // },

  // data() {
  //   return {
  //     avatarImage: null,
  //   }
  // },

  computed: {
    ...mapGetters(['darkTheme']),
  },

  async mounted() {
    // if (this.profile?.avatar) {
    //   const thumbnailRef = getImageThumbnail(this.profile?.avatar);

    //   this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef)
    //     .catch((e) => {});
    // }
  },
};
</script>
