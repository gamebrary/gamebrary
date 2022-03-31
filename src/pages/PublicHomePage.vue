<template lang="html">
  <b-container fluid>
    [homepage]
    <b-row>
      <b-col>
        <b-card>
          <h3>Organize</h3>
          Boards, tags, notes
        </b-card>
      </b-col>

      <b-col>
        <b-card>
          <h3>Learn</h3>
        </b-card>
      </b-col>

      <b-col>
        <b-card>
          <h3>Track</h3>
        </b-card>
      </b-col>
    </b-row>

    <hr />

    <b-card class="text-center text-white bg-danger">
      <h3>Gamebrary Pro</h3>
      [image]

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

      <b-button>Learn more</b-button>
    </b-card>

    <!-- <p>Open source tool to organize video game collections.</p>
    <p>Gamebrary is free, but powered by your support</p>

    <img src="static/img/screenshot.png" alt="">

    <section class="bg-light py-4" id="features">
      <b-container>
        <h5 class="text-center">Features</h5>

        <div class="features">
          <b-card
            v-for="{ title, message } in features"
            :key="title"
          >
            <h6>{{ title }}</h6>
            <small v-html="message" />
          </b-card>
        </div>
      </b-container>
    </section> -->

    <public-page-footer />
  </b-container>
</template>

<script>
import PublicPageFooter from '@/components/PublicPageFooter';

export default {
  components: {
    PublicPageFooter,
  },

  data() {
    return {
      features: [
        {
          title: 'Boards',
          message: 'Much like a bookshelf, display  your games, drag and drop them, customize, sort and more!',
        },
        {
          title: 'Encyclopedia',
          message: '<strong>Powered by IGDB and Wikipedia</strong>. Gamebrary provides the best video game database with hundreds of thousands of video games.',
        },
        {
          title: 'Notes',
          message: 'Take game notes and view them all in place.',
        },
        {
          title: 'Track your progress',
          message: 'Keep track of your video game backlog.',
        },
        {
          title: 'Tags',
          message: 'Categorize games across the board, literally.',
        },
        {
          title: 'Open Source, free and universal',
          message: 'Gamebrary is open source, free and universally available, there is no need to install apps, updates, etc... Gamebrary works on all your devices.',
        },
      ],
    };
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.features {
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 1rem;
}
</style>
