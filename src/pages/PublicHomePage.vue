<template lang="html">
  <div>
    <header>
      <b-container>
        <b-row>
          <b-col cols="6">
            <div class="mb-5 mb-lg-0 text-center text-lg-start align-items-center">
              <h1 class="display-4 mb-3">Organize your video games beautifully.</h1>
              <p class="lead text-muted mb-5">Learn about games, take notes, organize, customize, discover and more with Gamebrary</p>
            </div>
          </b-col>

          <b-col cols="6">
            <div class="px-5 px-sm-0"><img class="img-fluid rounded-circle" src="https://source.unsplash.com/u8Jn2rzYIps/900x900" alt="..." /></div>
          </b-col>
        </b-row>
      </b-container>
    </header>

    <section class="p-5 bg-light">
      <div class="row align-items-center">
        <div class="col-lg-8 order-lg-1 mb-5 mb-lg-0">
          <div class="container-fluid px-5">
            <div class="row gx-5">
              <div class="col-md-6 mb-5">
                <div class="text-center">
                  <i class="bi-phone icon-feature text-gradient d-block mb-3"></i>
                  <h3 class="font-alt">Device Mockups</h3>
                  <p class="text-muted mb-0">Ready to use HTML/CSS device mockups, no Photoshop required!</p>
                </div>
              </div>

              <div class="col-md-6 mb-5">
                <div class="text-center">
                  <i class="bi-camera icon-feature text-gradient d-block mb-3"></i>
                  <h3 class="font-alt">Flexible Use</h3>
                  <p class="text-muted mb-0">Put an image, video, animation, or anything else in the screen!</p>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-5 mb-md-0">
                <div class="text-center">
                  <i class="bi-gift icon-feature text-gradient d-block mb-3"></i>
                  <h3 class="font-alt">Free to Use</h3>
                  <p class="text-muted mb-0">As always, this theme is free to download and use for any purpose!</p>
                </div>
              </div>

              <div class="col-md-6">
                <div class="text-center">
                  <i class="bi-patch-check icon-feature text-gradient d-block mb-3"></i>
                  <h3 class="font-alt">Open Source</h3>
                  <p class="text-muted mb-0">Since this theme is MIT licensed, you can use it commercially!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4 order-lg-0">
          <img class="img-fluid rounded-circle" src="https://source.unsplash.com/u8Jn2rzYIps/900x900" alt="..." />

        </div>
      </div>
    </section>

    <section class="bg-success text-center py-4">
      <h2 class="text-white display-4 mb-4">
        Get started.
        <br />
        For FREE.
      </h2>

      <a class="btn btn-outline-light py-3 px-4 rounded-pill" href="https://startbootstrap.com/theme/new-age" target="_blank">Download for free</a>
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
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.feature {
  display: grid;
  margin: 0 auto;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  grid-gap: 4rem;

  @media(max-width: 768px) {
    grid-gap: 0;
    grid-template-columns: 1fr;

    aside {
      text-align: center;
    }
  }

  img {
    margin-left: auto;

    @media(max-width: 768px) {
      margin: 0 auto;
    }
  }
}
</style>
