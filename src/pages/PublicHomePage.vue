<template lang="html">
  <div>
    <header class="masthead bg-white">
      <div class="container px-5">
        <div class="row gx-5 align-items-center">
          <div class="col-lg-6">
            <div class="mb-5 mb-lg-0 text-center text-lg-start">
              <h1 class="display-1 mb-3">Organize <small class="display-4">your video games</small> beautifully.</h1>
              <p class="lead fw-normal text-muted mb-5">Learn about games, take notes, organize, customize, discover and more with Gamebrary</p>
              <div class="d-flex flex-column flex-lg-row align-items-center">
                <a class="me-lg-3 mb-4 mb-lg-0" href="#!"><img class="app-badge" src="assets/img/google-play-badge.svg" alt="..." /></a>
                <a href="#!"><img class="app-badge" src="assets/img/app-store-badge.svg" alt="..." /></a>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="px-5 px-sm-0"><img class="img-fluid rounded-circle" src="https://source.unsplash.com/u8Jn2rzYIps/900x900" alt="..." /></div>
          </div>

        </div>
      </div>
    </header>

    <!-- App features section-->
    <section id="features">
      <div class="container px-5">
        <div class="row gx-5 align-items-center">
          <div class="col-lg-8 order-lg-1 mb-5 mb-lg-0">
            <div class="container-fluid px-5">
              <div class="row gx-5">
                <div class="col-md-6 mb-5">
                  <!--
                  Gamebrary is open source, free and universally available, there is no need to install apps, updates, etc... Gamebrary works on all your devices. -->


                  <!-- Feature item-->
                  <div class="text-center">
                    <i class="bi-phone icon-feature text-gradient d-block mb-3"></i>
                    <h3 class="font-alt">Notes</h3>
                    <p class="text-muted mb-0">Take game notes and view them all in place!</p>
                  </div>
                </div>
                <div class="col-md-6 mb-5">
                  <!-- Feature item-->
                  <div class="text-center">
                    <i class="bi-camera icon-feature text-gradient d-block mb-3"></i>
                    <h3 class="font-alt">Organize</h3>
                    <p class="text-muted mb-0">Create custom boards that suit your needs. Organize using lists, tags, customize, sort and more!</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-5 mb-md-0">
                  <!-- Feature item-->
                  <div class="text-center">
                    <i class="bi-gift icon-feature text-gradient d-block mb-3"></i>
                    <h3 class="font-alt">Encyclopedia</h3>
                    <p class="text-muted mb-0">
                      Powered by IGDB, Wikipedia, . Gamebrary provides the best video game database with hundreds of thousands of video games.
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <!-- Feature item-->
                  <div class="text-center">
                    <i class="bi-patch-check icon-feature text-gradient d-block mb-3"></i>
                    <h3 class="font-alt">Track your progress</h3>
                    <p class="text-muted mb-0">Keep track of your video game backlog.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 order-lg-0">
            <!-- Features section device mockup-->
            <img class="img-fluid rounded-circle" src="https://source.unsplash.com/u8Jn2rzYIps/900x900" alt="..." />

          </div>
        </div>
      </div>
    </section>

    <section class="text-center bg-dark p-5">
      <h2 class="text-white">
        Open Source, free and universal
      </h2>
    </section>

    <!-- Basic features section-->
    <section class="bg-dark">
      <div class="container px-5">
        <div class="row gx-5 align-items-center justify-content-center justify-content-lg-between">
          <div class="col-12 col-lg-5">
            <h2 class="display-4 lh-1 mb-4">Organize your video game collection</h2>
            <p class="lead fw-normal text-muted mb-5 mb-lg-0">This section is perfect for featuring some information about your application, why it was built, the problem it solves, or anything else! There's plenty of space for text here, so don't worry about writing too much.</p>
          </div>
          <div class="col-sm-8 col-md-6">
            <div class="px-5 px-sm-0"><img class="img-fluid rounded-circle" src="https://source.unsplash.com/u8Jn2rzYIps/900x900" alt="..." /></div>
          </div>
        </div>
      </div>
    </section>

    <section class="text-center bg-light p-5">
      <h2>
        Vue Awesome
      </h2>
    </section>

    <!-- Call to action section-->
    <section class="bg-success py-5">
      <div class="cta-content">
        <div class="container px-5">
          <h2 class="text-white display-3">Get started.
          <br />
          For FREE.</h2>

          <b-button pill variant="outline-light" size="lg">Login</b-button>
          <b-button pill variant="outline-light" size="lg" class="ml-3">Get Pro</b-button>
        </div>
      </div>
    </section>
    <public-page-footer />
  </div>
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
