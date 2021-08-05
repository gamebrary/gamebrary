<template lang="html">
  <div>
    Gamebrary!
    <p>Open source tool to organize video game collections.</p>
    <p>Gamebrary is free, but powered by your support</p>

    <div class="bg-white">
      teest
    </div>

    <section>
      Browse boards:
      <public-boards-page />
    </section>

    <section class="bg-danger py-4">
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
    </section>

    <public-page-footer />
  </div>
</template>

<script>
import PublicBoardsPage from '@/pages/PublicBoardsPage';
import PublicPageFooter from '@/components/PublicPageFooter';

export default {
  components: {
    PublicBoardsPage,
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
