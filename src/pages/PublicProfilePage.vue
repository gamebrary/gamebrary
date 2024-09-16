<template lang="html">
  <b-container>
    <EditProfileSidebar v-if="isProfileOwner" />

    <b-spinner v-if="loading && profile === null" class="spinner-centered" />

    <div
      v-else-if="profile"
    >
      <portal to="headerActions">
        <b-button
          v-if="isProfileOwner"
          variant="primary"
          @click="$store.commit('SET_PROFILE_SIDEBAR_OPEN', true)"
        >
          Edit profile
        </b-button>
      </portal>

      <div class="text-center">
        <b-avatar
          :src="avatarImage"
          class="mx-auto mt-5 mb-3"
          size="200"
        />

        <h3
          v-b-tooltip
          :title="profile.name"
        >
          @{{ profile.userName }}
        </h3>

        <q
          v-if="profile.bio"
          class="d-block text-subtle mt-2"
        >
          {{ profile.bio }}
        </q>

        <div class="mt-2">
          <b-button
            v-if="profile.website"
            :href="profile.website"
            target="_blank"
            :title="profile.website"
            v-b-tooltip
            class="mx-1"
          >
            <i class="fa-regular fa-globe-pointer fa-fw" />
          </b-button>

          <b-button
            v-if="profile.twitter"
            :href="`https://twitter.com/${profile.twitter}`"
            target="_blank"
            v-b-tooltip
            :title="profile.twitter"
            class="mx-1"
          >
            <i class="fa-brands fa-x-twitter fa-fw" />
          </b-button>

          <b-button
            v-if="userLocation"
            :href="userLocation"
            :title="profile.location"
            v-b-tooltip
            class="mx-1"
            target="_blank"
          >
            <i class="fa-solid fa-location-dot fa-fw" />
          </b-button>
        </div>
      </div>

      <!-- <b-button :to="{ name: 'profiles' }">
        View other profiles
      </b-button> -->

      <div class="board-grid mt-5">
        <MiniBoard
          v-for="board in userBoards"
          :key="board.id"
          :board="board"
        />
      </div>
    </div>

    <EmptyState
      v-else
      title="404 Not Found"
      message="Page not found!"
    />
  </b-container>
</template>

<script>
import { mapState } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import EditProfileSidebar from '@/components/EditProfileSidebar';
import EmptyState from '@/components/EmptyState';
import { getImageThumbnail } from '@/utils';

export default {
  components: {
    MiniBoard,
    EditProfileSidebar,
    EmptyState,
  },

  data() {
    return {
      error: false,
      loading: false,
      userBoards: [],
      profile: null,
      avatarImage: null,
      wallpaperImage: null,
    };
  },

  computed: {
    ...mapState(['user', 'editProfileSidebarOpen']),

    userName() {
      return this.$route.params.userName;
    },

    userLocation() {
      if (!this.profile?.location) return null;

      const location = this.profile?.location?.replace(' ', '+');

      return `https://www.google.com/maps/search/${location}`;
    },

    isProfileOwner() {
      if (!this.user?.uid) return false;

      return this.user?.uid === this.profile?.uid;
    },
  },

  watch: {
    userName(value) {
      if (value) {
        this.loadProfile();
      }
    },

    wallpaperImage(value) {
      if (value) this.$bus.$emit('UPDATE_WALLPAPER', value);
    },
  },

  mounted() {
    this.$bus.$on('LOAD_PROFILE', this.loadProfile);
    this.loadProfile();
  },

  destroyed() {
    this.$bus.$off('LOAD_PROFILE');
    this.$bus.$emit('CLEAR_WALLPAPER');
  },

  methods: {
    viewPublicBoard(id) {
      this.$router.push({ name: 'public.board', params: { id } });
    },

    async loadProfile() {
      this.error = false;
      this.loading = this.profile === null;

      this.profile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USERNAME', this.userName)
        .catch(() => {
          this.error = true;
        });

      if (!this.profile) {
        this.loading = false;
        document.title = 'Page not found - Gamebrary';

        return;
      }

      this.userBoards = await this.$store.dispatch('LOAD_USER_PUBLIC_BOARDS', this.profile.uid)
        .catch(() => {
          this.error = true;
        });

      if (this.profile?.avatar) {
        const thumbnailRef = getImageThumbnail(this.profile?.avatar);

        this.avatarImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', thumbnailRef)
          .catch((e) => {});
      } else {
        this.avatarImage = null;
      }

      if (this.profile?.wallpaper) {
        this.wallpaperImage = await this.$store.dispatch('LOAD_FIREBASE_IMAGE', this.profile?.wallpaper)
          .catch((e) => {});
      }

      this.loading = false;
    },
  },
};
</script>
