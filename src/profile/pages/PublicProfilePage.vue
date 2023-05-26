<template lang="html">
  <section :style="`background-image: url(${wallpaperImage})`">
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div
        v-else-if="profile"
      >
        <portal to="headerActions">
          <b-button
            v-if="isProfileOwner"
            class="mr-2"
            :to="{ name: 'profile' }"
          >
            Edit
          </b-button>
        </portal>

        <div class="text-center">
          <b-avatar
            :src="avatarImage"
            class="mx-auto rounded my-3"
            size="200"
            rounded
          />

          <br />

          <p :class="['lead', wallpaperImage ? 'text-white' : '']">@{{ profile.userName }}</p>

          <template v-if="profile.name">{{ profile.name }} / </template>
          <p class="text-info">{{ profile.bio }}</p>
          <p>{{ profile.location }}</p>
          <b-button
            v-if="profile.twitter"
            :href="`https://twitter.com/${profile.twitter}`"
            target="_blank"
            style="color: #00acee"
            v-b-tooltip.hover
            title="Twitter"
            class="mr-2"
          >
            <i class="fab fa-twitter fa-fw" aria-hidden />
          </b-button>

          <b-button
            v-if="profile.website"
            :href="profile.website"
            target="_blank"
            v-b-tooltip.hover
            title="Website"
            class="mr-2"
          >
            <i class="fa-solid fa-link fa-fw" />
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
  </section>
</template>

<script>
import { mapState } from 'vuex';
import MiniBoard from '@/components/Board/MiniBoard';
import EmptyState from '@/components/EmptyState';
import { getImageThumbnail } from '@/utils';

export default {
  components: {
    MiniBoard,
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
    ...mapState(['user']),

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
  },

  mounted() {
    this.loadProfile();
  },

  methods: {
    viewPublicBoard(id) {
      this.$router.push({ name: 'public.board', params: { id } });
    },

    async loadProfile() {
      this.error = false;
      this.loading = true;

      this.profile = await this.$store.dispatch('LOAD_PUBLIC_PROFILE_BY_USERNAME', this.userName)
        .catch(() => {
          this.error = true;
        });

      if (!this.profile) {
        this.loading = false;

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
