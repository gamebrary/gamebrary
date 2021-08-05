<template lang="html">
  <footer class="text-white container ml-auto mr-auto">
    <h3>© {{ year }} Gamebrary</h3>

    <div class="pt-4 pb-24 flex items-center justify-center">
      <ul>
        <a class="px-1" href="/about">About</a>
        <a class="px-1" href="/privacy-policy">Privacy policy</a>
        <a class="px-1" href="/terms">Terms</a>
        <a class="px-1" href="https://github.com/romancm/gamebrary/releases" target="_blank">Releases</a>
        <a class="px-1" href="https://github.com/romancm/gamebrary/" target="_blank">
          GitHub
        </a>
      </ul>
    </div>

    <small>
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
