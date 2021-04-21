<template lang="html">
  <b-button
    href="https://www.igdb.com/"
    size="sm"
    target="_blank"
  >
    <small class="text-muted pr-1">{{ $t('global.poweredByIgdb') }}</small>

    <b-img
      width="40"
      height="20"
      :src="`/static/img/igdb-logo.png`"
      :alt="$t('global.poweredByIgdb')"
    />
  </b-button>
</template>
