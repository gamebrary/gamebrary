<template lang="html">
  <router-link
    v-if="thumbnail"
    :to="{ name: 'public.profile', params: { userName: profile.userName } }"
    class="d-inline-block"
    :title="`@${profile.userName}`"
    data-bs-toggle="tooltip"
  >
    <img
      v-if="avatarImage"
      :src="avatarImage"
      class="rounded-circle"
      style="width: 80px; height: 80px; object-fit: cover;"
      :alt="`@${profile.userName}`"
    />
    <div
      v-else
      class="rounded-circle d-flex align-items-center justify-content-center"
      style="width: 80px; height: 80px; background-color: var(--bs-gray-300);"
    >
      <i class="fa-regular fa-user fa-2x"></i>
    </div>
  </router-link>

  <div v-else class="card">
    <div class="profile-card">
      <router-link
        :to="{ name: 'public.profile', params: { userName: profile.userName } }"
        class="d-inline-block"
        :title="`@${profile.userName}`"
        data-bs-toggle="tooltip"
      >
        <img
          v-if="avatarImage"
          :src="avatarImage"
          class="rounded-circle"
          style="width: 80px; height: 80px; object-fit: cover;"
          :alt="`@${profile.userName}`"
        />
        <div
          v-else
          class="rounded-circle d-flex align-items-center justify-content-center"
          style="width: 80px; height: 80px; background-color: var(--bs-gray-300);"
        >
          <i class="fa-regular fa-user fa-2x"></i>
        </div>
      </router-link>

      <aside v-if="!thumbnail" class="d-flex flex-column">
        <router-link :to="{ name: 'public.profile', params: { userName: profile.userName } }">
          <strong>@{{ profile.userName }}</strong>
        </router-link>
        <q v-if="profile.bio">{{ profile.bio }}</q>
      </aside>
    </div>
  </div>
</template>

<script>
import { getImageThumbnail } from '@/utils';

export default {
  props: {
    thumbnail: Boolean,
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
    this.initTooltips();
  },

  updated() {
    this.initTooltips();
  },

  methods: {
    initTooltips() {
      this.$nextTick(() => {
        const tooltipTriggerList = this.$el.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            new bootstrap.Tooltip(tooltipTriggerEl);
          }
        });
      });
    },
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
