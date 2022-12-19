<template lang="html">
  <section>
    <b-container>
      <b-spinner v-if="loading" class="spinner-centered" />

      <div
        v-else-if="profile"
      >
        <portal to="headerActions">
          <b-button
            v-if="isProfileOwner"
            class="mr-2"
            :to="{ name: 'account' }"
          >
            Edit
          </b-button>
        </portal>

        <div class="d-flex">
          <b-avatar
            :src="avatarImage"
            class="mr-3 float-left"
            size="200"
            rounded
          />

          <div class="d-flex flex-column">
            <template v-if="profile.name">{{ profile.name }} / </template>@{{ profile.userName }}
            <p class="text-info mb-0">{{ profile.bio }}</p>
            <p class="mb-0">{{ profile.location }}</p>

            <div>
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
          </div>
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

      this.loading = false;
    },
  },
};
</script>
