<template lang="html">
  <div class="container-fluid dashboard">
    <h5 class="mb-3 text-center">
      Welcome to Gamebrary, the open source video game collection management tool.
    </h5>

    <b-tabs
      v-model="activeTab"
      pills
      card
      no-fade
      vertical
      nav-wrapper-class="col-12 col-sm-auto"
      nav-class="rounded p-0 bg-transparent mr-4 mb-4"
      content-class="bg-light rounded p-0"
    >
      <b-tab title="Boards" active>
        <boards />
      </b-tab>

      <b-tab v-if="Object.keys(gameLists).length">
        <template v-slot:title>
          Platforms <b-badge variant="warning">Deprecated</b-badge>
        </template>

        <legacy-platforms />
      </b-tab>

      <b-tab title="Settings">
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

      <b-tab title="About">
        <h5 class="mb-2">About</h5>

        <b-form-row>
          <b-col
            class="d-flex mt-2"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <b-card
              v-b-modal:releases
              header="GitHub Releases"
              class="clickable w-100"
            >
              <b-card-text>
                Manage game tags

                Latest release v1.2
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
              v-b-modal:about
              header="About Gamebrary"
              class="clickable w-100"
            >
              <b-card-text>
                Info about the project, contributors, development info...
              </b-card-text>
            </b-card>
          </b-col>
        </b-form-row>
      </b-tab>

      <b-tab title="Account">
        <h5 class="mb-2">Account</h5>

        <account />
      </b-tab>
    </b-tabs>

    <page-footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LegacyPlatforms from '@/components/LegacyBoard/LegacyPlatforms';
import PageFooter from '@/components/PageFooter';
import Account from '@/components/Settings/Account';
import Boards from '@/components/Boards';

export default {
  components: {
    Account,
    LegacyPlatforms,
    PageFooter,
    Boards,
  },

  data() {
    return {
      activeTab: 0,
    };
  },

  computed: {
    ...mapState(['gameLists']),
  },
};
</script>
