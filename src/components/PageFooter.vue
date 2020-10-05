<template>
  <footer class="p-4 text-center">
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
      .
    </small>
  </footer>
</template>
