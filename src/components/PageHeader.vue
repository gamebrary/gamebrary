<template lang="html">
  <nav :class="[darkTheme ? 'bg-dark' : 'bg-light', `nav-${navPosition}`, transparencyEnabled ? 'semi-transparent' : '']" class="p-1">
    <PageDock />

    <div 
      v-if="!isVerticalNav"
      class="align-items-center d-flex ml-auto h-100 flex-column"
    >
        <portal-target name="headerActions" multiple />
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PageDock from '@/components/Dock/PageDock';

export default {
  components: {
    PageDock,
  },

  computed: {
    ...mapState(['user']),
    ...mapGetters(['darkTheme', 'navPosition', 'isVerticalNav', 'transparencyEnabled']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  display: flex;
  align-items: center;
  // border-bottom: 1px solid var(--light);
  border-radius: .5rem;
  margin: 1rem;
  width: calc(100dvw - 2rem);
  position: fixed;
  z-index: 2;
  // background: url('https://static.vecteezy.com/system/resources/previews/026/292/194/original/90s-seamless-pattern-colourful-memphis-style-retro-background-or-retro-80s-wallpaper-free-vector.jpg');
  // background-size: 200px;
  
  &.nav-top {
    top: 0;
    margin: .5rem;
  }

  &.nav-bottom {
    // border-bottom: 0;
    bottom: 0;
    margin: .5rem 1rem;
    // border-top: 1px solid var(--light);
  }

  &.nav-left {
    // border: 0;
    left: 0;
    // border-right: 1px solid var(--light);
  }

  &.nav-right {
    border: 0;
    // border-left: 1px solid var(--light);
  }

  &.nav-left, &.nav-right {
    width: auto;
    height: calc(100svh - 1rem);
    display: flex;
    flex-direction: column;
  }

  // &.bg-dark {
  //   border-color: var(--black);
  // }
}

// .header-toggle {
//   position: absolute;
//   padding: 0;
//   width: 30px;
//   left: calc(50vw - 15px);
//   background: var(--light);
// }
</style>
