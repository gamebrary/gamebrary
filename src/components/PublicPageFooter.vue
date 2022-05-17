<template lang="html">
  <footer class="text-muted text-center container ml-auto mr-auto">
    <div class="pt-4 pb-24 flex items-center justify-center">
      <ul>
        <router-link :to="{ name: 'about' }">About</router-link>
        <router-link :to="{ name: 'privacy.policy' }">Privacy policy</router-link>
        <router-link :to="{ name: 'terms' }">Terms</router-link>
        <a class="px-1" href="https://github.com/romancm/gamebrary/releases" target="_blank">Releases</a>
        <a class="px-1" href="https://github.com/romancm/gamebrary/" target="_blank">
          GitHub
        </a>
      </ul>
    </div>

    <small class="text-muted">
      <small>©{{ year }} Gamebrary</small>

      {{ $t('global.donateMessage') }}
      <a href="https://www.paypal.me/RomanCervantes/5" target="_blank">
        {{ $t('global.donating') }}
      </a>
      ,
      <a href="https://github.com/romancm/gamebrary/issues" target="_blank">
        {{ $t('global.reportBugs') }}
      </a>
      {{ $t('global.or') }}
      <a href="https://goo.gl/forms/r0juBCsZaUtJ03qb2" target="_blank">
        {{ $t('global.submitFeedback') }}
      </a>
    </small>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      const year = new Date().getFullYear();

      return year;
    },
  },
};
</script>
