<template lang="html">
  <div>
    <b-jumbotron
      header="Welcome to Gamebrary"
      text-variant="white"
      header-level="4"
      class="text-center rounded-0"
      lead="The open source video game collection management tool."
      :style="`
        background-image: url('${ coverScreenshot }');
        background-size: cover;
        height: 50vh;
      `"
      >
        <small v-if="coverGame">Screenshot from <strong>{{ coverGame.name }}</strong></small>
    </b-jumbotron>

    <div class="container dashboard">
      <b-tabs
        v-model="activeTab"
        pills
        card
        no-fade
        vertical
        nav-wrapper-class="col-12 col-sm-auto"
        nav-class="rounded p-0 bg-transparent mb-4 mb-sm-0 mr-sm-3"
        content-class="rounded p-0"
      >
        <b-tab title-link-class="p-2 px-5" title="Boards" active>
          <boards />
        </b-tab>

        <b-tab title-link-class="p-2 px-5" title="Settings">
          <h5 class="mb-2">Settings</h5>

          <b-form-row>
            <b-col
              class="d-flex mt-2"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <b-card
                v-b-modal:tags-settings
                class="clickable w-100"
              >
              <template v-slot:header>
                <b-icon icon="tags" />
                Manage game tags
              </template>

              <p>Tags are a great way to organize and manage your video game collection.
                Add, edit or delete tags.</p>
              </b-card>
            </b-col>

            <b-col
              class="d-flex mt-2"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <b-card
                v-b-modal:wallpapers
                header="Wallpapers"
                class="clickable w-100"
              >
                <b-card-text>
                  Manage board wallpapers
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
              class="d-flex mt-2"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <b-card
                v-b-modal:language
                header="Language"
                class="clickable w-100"
              >
                <b-card-text>
                  Change language
                </b-card-text>
              </b-card>
            </b-col>

            <b-col
              class="d-flex mt-2"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <b-card
                v-b-modal:themes
                header="Theme"
                class="clickable w-100"
              >
                <b-card-text>
                  Change UI theme
                </b-card-text>
              </b-card>
            </b-col>
          </b-form-row>
        </b-tab>

        <b-tab title-link-class="p-2 px-5" lazy>
          <template v-slot:title>
            Releases <b-badge variant="success" v-if="notification">New!</b-badge>
          </template>

          <h5 class="mb-2">Releases</h5>
          <p>An archive of every release we’ve done that we have a record of.</p>

          <releases />
        </b-tab>

        <b-tab title-link-class="p-2 px-5" title="Account" lazy>
          <h5 class="mb-2">Account</h5>

          <account />
        </b-tab>
      </b-tabs>
    </div>

    <page-footer />
  </div>
</template>

<script>
import PageFooter from '@/components/PageFooter';
import Account from '@/components/Settings/Account';
import Releases from '@/components/Settings/Releases';
import Boards from '@/components/Boards';
import { mapState } from 'vuex';

export default {
  components: {
    Account,
    Releases,
    PageFooter,
    Boards,
  },

  data() {
    return {
      activeTab: 0,
      coverGame: null,
    };
  },

  computed: {
    ...mapState(['notification']),

    coverScreenshot() {
      const baseUrl = 'https://images.igdb.com/igdb/image/upload/t_screenshot_huge_2x/';
      return this.coverGame && this.coverGame.screenshots.length
        ? `${baseUrl}${this.coverGame.screenshots[0].image_id}.jpg`
        : '';
    },
  },

  async mounted() {
    const randomNumber = Math.floor(Math.random() * 49);

    const popularGames = await this.$store.dispatch('LOAD_POPULAR_GAMES');

    this.coverGame = popularGames[randomNumber];
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.jumbotron {
  text-shadow: 2px 3px 5px rgba(0,0,0,0.5);
}
</style>
