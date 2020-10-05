<template lang="html">
  <b-link
    href="https://www.igdb.com/"
    class="igdb-credit m-0 d-flex text-center text-decoration-none"
    target="_blank"
  >
    <small class="text-muted pr-1">{{ $t('global.poweredByIgdb') }}</small>

    <b-img
      center
      width="40"
      :src="`/static/img/igdb-logo.png`"
      :alt="$t('global.poweredByIgdb')"
    />
  </b-link>
</template>
