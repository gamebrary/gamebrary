<template lang="html">
  <b-container>
    <EditProfileSidebar v-if="isProfileOwner" />

    <b-spinner v-if="loading" class="spinner-centered" />

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

        <h3>@{{ profile.userName }}</h3>

        <strong v-if="profile.name">{{ profile.name }}</strong>

        <p v-if="profile.location">
          <i class="fa-solid fa-location-dot" />
          {{ profile.location }}
        </p>

        <p v-if="profile.bio" class="text-subtle">{{ profile.bio }}</p>
        
        <b-button
          v-if="profile.website"
          :href="profile.website"
          target="_blank"
          title="Website"
          variant="link"
        >
          {{ profile.website }}
        </b-button>
        
        <b-button
          v-if="profile.twitter"
          :href="`https://twitter.com/${profile.twitter}`"
          target="_blank"
          title="X"
          variant="transparent"
        >
          <i class="fa-brands fa-x-twitter fa-fw" />
          {{ profile.twitter }}
        </b-button>
      </div>

      <!-- <b-button :to="{ name: 'profiles' }">
        View other profiles
      </b-button> -->

      <b-row class="mt-4">
        <b-col
          v-for="board in userBoards"
          :key="board.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="px-2"
        >
          <mini-board
            :board="board"
            @click.native="$router.push({ name: 'board', params: { id: board.id } })"
            class="p-relative mb-3"
          />
        </b-col>
      </b-row>
    </div>

    <empty-state
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
