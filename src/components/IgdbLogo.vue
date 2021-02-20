<template lang="html">
  <b-link
    href="https://www.igdb.com/"
    class="igdb-credit m-0 d-flex text-center text-decoration-none justify-content-center w-100"
    target="_blank"
  >
    <small class="text-muted pr-1">{{ $t('global.poweredByIgdb') }}</small>

    <b-aspect>
      <b-img
        width="40"
        height="20"
        :src="`/static/img/igdb-logo.png`"
        :alt="$t('global.poweredByIgdb')"
      />
    </b-aspect>
  </b-link>
</template>
