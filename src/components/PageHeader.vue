<!-- TODO: allow auto collapse, toggle on click, hover -->
<!-- TODO: add option for dock style: rounded, full, floating (top, bottom), bring back pinned boards, notes, tags,  -->
<!-- // LanguageSettings,
// SteamSettingsPage,
// import SteamSettingsPage from '@/pages/SteamSettingsPage';
// import LanguageSettings from '@/components/Settings/LanguageSettings'; -->
<!-- Elevate Your Play, Organize Your Way! -->
<!-- "Gamebrary: Level Up Your Collection, Organize Your Play." -->

<!--
🌟 Smart Filters: Now, effortlessly find the perfect game for your mood or gaming session with our new Smart Filters! Sort and discover your collection based on genres, release dates, and more. Level up your game organization experience!

Explore the next level of game management with Gamebrary's Smart Filters—your key to a more personalized gaming adventure. Start organizing like never before! 🚀🎮

Introducing the **New Feature: "PlayStats"**!

Now, take your game organization to the next level with PlayStats, the latest addition to our website. Dive deeper into your gaming world and enhance your experience by tracking and analyzing your gameplay habits. Here's what PlayStats has to offer:

1. **Gameplay Insights:**
   Explore detailed statistics on your gaming patterns, such as total playtime, most played genres, and favorite gaming hours. Gain valuable insights into your gaming preferences.

2. **Achievement Showcase:**
   Showcase your in-game achievements and milestones. Celebrate your victories and share your gaming accomplishments with the community.

3. **Playtime Reminders:**
   Set personalized playtime reminders to maintain a healthy gaming balance. Keep track of your gaming sessions and ensure you stay on top of your real-life responsibilities.

4. **Game Recommendations:**
   Receive tailored game recommendations based on your play history and preferences. Discover new titles that align with your gaming style and interests.

Elevate your gaming experience with PlayStats – because your gaming journey is more than just a collection; it's a story waiting to be told. Upgrade your Gamebrary experience today!
 -->

<template lang="html">
  <nav :class="[darkTheme ? 'dark' : 'light', `nav-${navPosition}`]" class="p-1">
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
    ...mapGetters(['darkTheme', 'navPosition', 'isVerticalNav']),
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
nav {
  display: flex;
  align-items: center;
  // border-bottom: 1px solid var(--light);
  border-radius: .5rem;
  margin: .5rem;
  width: calc(100% - 2rem);
  position: fixed;
  z-index: 1;
  backdrop-filter: saturate(180%) blur(20px);
  &.dark {
    background: rgba(53,54,58,.72);
  }
  
  &.light {
    background: rgba(222,228,231,.72);
  }
  // background: url('https://static.vecteezy.com/system/resources/previews/026/292/194/original/90s-seamless-pattern-colourful-memphis-style-retro-background-or-retro-80s-wallpaper-free-vector.jpg');
  // background-size: 200px;
  
  &.nav-top {
    top: 0;
    margin: .5rem 1rem;
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
