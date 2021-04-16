<template lang="html">
  <div class="settings mx-2">
    <aside>
      <b-button
        v-for="{ name, title, icon } in settingsSections"
        :key="name"
        :variant="name === routeName ? 'primary' : 'light'"
        size="sm"
        class="w-100 text-left mb-2"
        @click="handleClick(name)"
      >
        <i :class="`${icon} fa-fw`" aria-hidden />
        <span>{{ title }}</span>
      </b-button>
    </aside>

    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      settingsSections: [
        {
          name: 'preferences',
          title: 'General',
          icon: 'fas fa-sliders-h',
        },
        {
          name: 'tags',
          title: 'Tags',
          icon: 'fas fa-tags',
        },
        {
          name: 'notes',
          title: 'Notes',
          icon: 'fas fa-sticky-note',
        },
        {
          name: 'wallpapers',
          title: 'Wallpapers',
          icon: 'fas fa-images',
        },
      ],
    };
  },

  computed: {
    routeName() {
      return this.$route.name;
    },
  },

  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat().format(new Date(date));
    },

    tabButtonVariant(name) {
      return this.$route.name === name ? 'danger' : 'success';
    },

    handleClick(name) {
      if (this.$route.name !== name) {
        this.$router.push({ name });
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$sidebarWidth: 108px;

.settings {
  display: grid;
  grid-template-columns: #{$sidebarWidth} 1fr;
  grid-gap: 1rem;

  @media(max-width: 780px) {
    grid-template-columns: minmax(0, #{$sidebarWidth}) calc(100% - .5rem - #{$sidebarWidth});
  }
}
</style>
