<!-- TODO: finish or kill it -->
<template lang="html">
  <div>
    <b-button
      variant="link"
      v-for="platform in platforms"
      :to="{ name: 'platform.page', params: { slug: platform.slug } }"
      :key="platform.id"
    >
      <img :src="`static/logos/platforms-new/${platform.slug}.png`" />
      {{ platform.slug }} | {{ platform.id }}
    </b-button>

    <!-- <img src="static/logos/platforms-new/3do.png" /> -->
    <!-- <img src="static/logos/platforms-new/action-max.png" /> -->
    <!-- <img src="static/logos/platforms-new/amiga-cd-3  2.png" /> -->
    <!-- <img src="static/logos/platforms-new/arcadia-2001.png" /> -->
    <!-- <img src="static/logos/platforms-new/astrocade.png" /> -->
    <!-- <img src="static/logos/platforms-new/atari-2600.png" /> -->
    <!-- <img src="static/logos/platforms-new/atari-5200.png" /> -->
    <!-- <img src="static/logos/platforms-new/atari-7800.png" /> -->
    <!-- <img src="static/logos/platforms-new/atari-xe.png" /> -->
    <!-- <img src="static/logos/platforms-new/beena.png" /> -->
    <!-- <img src="static/logos/platforms-new/cassette-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/cd-i.png" /> -->
    <!-- <img src="static/logos/platforms-new/channel-f.png" /> -->
    <!-- <img src="static/logos/platforms-new/coleco-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/commodore-cdtv.png" /> -->
    <!-- <img src="static/logos/platforms-new/commodore64.png" /> -->
    <!-- <img src="static/logos/platforms-new/cps-changer.png" /> -->
    <!-- <img src="static/logos/platforms-new/creativision.png" /> -->
    <!-- <img src="static/logos/platforms-new/dreamcast.png" /> -->
    <!-- <img src="static/logos/platforms-new/family-computer.png" /> -->
    <!-- <img src="static/logos/platforms-new/fm-towns-marty.png" /> -->
    <!-- <img src="static/logos/platforms-new/game-wave.png" /> -->
    <!-- <img src="static/logos/platforms-new/gamecube.png" /> -->
    <!-- <img src="static/logos/platforms-new/genesis-32x.png" /> -->
    <!-- <img src="static/logos/platforms-new/genesis.png" /> -->
    <!-- <img src="static/logos/platforms-new/gx4000.png" /> -->
    <!-- <img src="static/logos/platforms-new/halcyon.png" /> -->
    <!-- <img src="static/logos/platforms-new/hyper-scan.png" /> -->
    <!-- <img src="static/logos/platforms-new/imagination-machine.png" /> -->
    <!-- <img src="static/logos/platforms-new/intellivision.png" /> -->
    <!-- <img src="static/logos/platforms-new/interactive-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/ique.png" /> -->
    <!-- <img src="static/logos/platforms-new/jaguar-cd.png" /> -->
    <!-- <img src="static/logos/platforms-new/jaguar.png" /> -->
    <!-- <img src="static/logos/platforms-new/konix.png" /> -->
    <!-- <img src="static/logos/platforms-new/laser-active.png" /> -->
    <!-- <img src="static/logos/platforms-new/leisure-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/loopy.png" /> -->
    <!-- <img src="static/logos/platforms-new/mark-iii.png" /> -->
    <!-- <img src="static/logos/platforms-new/mega-cd-ii.png" /> -->
    <!-- <img src="static/logos/platforms-new/mega-cd.png" /> -->
    <!-- <img src="static/logos/platforms-new/mega-drive.png" /> -->
    <!-- <img src="static/logos/platforms-new/mega-ld.png" /> -->
    <!-- <img src="static/logos/platforms-new/mp1000.png" /> -->
    <!-- <img src="static/logos/platforms-new/my-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/neo-geo-cd.png" /> -->
    <!-- <img src="static/logos/platforms-new/neo-geo.png" /> -->
    <!-- <img src="static/logos/platforms-new/nes.png" /> -->
    <!-- <img src="static/logos/platforms-new/nintendo-64-dd.png" /> -->
    <!-- <img src="static/logos/platforms-new/nintendo-64.png" /> -->
    <!-- <img src="static/logos/platforms-new/nuon.png" /> -->
    <!-- <img src="static/logos/platforms-new/odyssey2.png" /> -->
    <!-- <img src="static/logos/platforms-new/pc-engine.png" /> -->
    <!-- <img src="static/logos/platforms-new/pc-fx.png" /> -->
    <!-- <img src="static/logos/platforms-new/picno.png" /> -->
    <!-- <img src="static/logos/platforms-new/pico.png" /> -->
    <!-- <img src="static/logos/platforms-new/pippin.png" /> -->
    <!-- <img src="static/logos/platforms-new/playdia.png" /> -->
    <!-- <img src="static/logos/platforms-new/playstation.png" /> -->
    <!-- <img src="static/logos/platforms-new/ps-2.png" /> -->
    <!-- <img src="static/logos/platforms-new/ps3.png" /> -->
    <!-- <img src="static/logos/platforms-new/ps4.png" /> -->
    <!-- <img src="static/logos/platforms-new/pv-1000.png" /> -->
    <!-- <img src="static/logos/platforms-new/rca-studio-ii.png" /> -->
    <!-- <img src="static/logos/platforms-new/satellaview.png" /> -->
    <!-- <img src="static/logos/platforms-new/sega-cd.png" /> -->
    <!-- <img src="static/logos/platforms-new/sega-master-system.png" /> -->
    <!-- <img src="static/logos/platforms-new/sega-saturn.png" /> -->
    <!-- <img src="static/logos/platforms-new/sg-1000.png" /> -->
    <!-- <img src="static/logos/platforms-new/socrates.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-acan.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-cassette-vision.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-cd-rom.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-famicom.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-grafx.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-nintendo.png" /> -->
    <!-- <img src="static/logos/platforms-new/super-vision-8000.png" /> -->
    <!-- <img src="static/logos/platforms-new/switch.png" /> -->
    <!-- <img src="static/logos/platforms-new/turbo-grafx-16.png" /> -->
    <!-- <img src="static/logos/platforms-new/tutor.png" /> -->
    <!-- <img src="static/logos/platforms-new/tv-boy.png" /> -->
    <!-- <img src="static/logos/platforms-new/ultravision.png" /> -->
    <!-- <img src="static/logos/platforms-new/v-flash.png" /> -->
    <!-- <img src="static/logos/platforms-new/v-smile.png" /> -->
    <!-- <img src="static/logos/platforms-new/vc4000.png" /> -->
    <!-- <img src="static/logos/platforms-new/vectrex.png" /> -->
    <!-- <img src="static/logos/platforms-new/video-art.png" /> -->
    <!-- <img src="static/logos/platforms-new/video-challenger.png" /> -->
    <!-- <img src="static/logos/platforms-new/video-driver.png" /> -->
    <!-- <img src="static/logos/platforms-new/videopac.png" /> -->
    <!-- <img src="static/logos/platforms-new/vis.png" /> -->
    <!-- <img src="static/logos/platforms-new/wii-u.png" /> -->
    <!-- <img src="static/logos/platforms-new/wii.png" /> -->
    <!-- <img src="static/logos/platforms-new/xavix.png" /> -->
    <!-- <img src="static/logos/platforms-new/xbox-360.png" /> -->
    <!-- <img src="static/logos/platforms-new/xbox-one.png" /> -->
    <!-- <img src="static/logos/platforms-new/xbox.png" /> -->
    <!-- <img src="static/logos/platforms-new/zeebo.png" /> -->
    <!-- <img src="static/logos/platforms-new/zemina.png" /> -->
    <!-- <pre class="text-dark small">{{ platforms }}</pre> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['platforms']),
  },

  mounted() {
    this.loadPlatforms();
  },

  methods: {
    async loadPlatforms() {
      await this.$store.dispatch('LOAD_IGDB_PLATFORMS')
        .catch(() => {
          this.$bvToast.toast('There was an error loading platforms', { variant: 'error' });
        });
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
img {
  filter: drop-shadow(-1px 0 0 black)
          drop-shadow(0 -1px 0 black)
          drop-shadow(0 1px 0 black)
          drop-shadow(1px 0 0 black);
  width: 200px;
}
</style>
