<template lang="html">
  <b-overlay show no-center no-wrap>
    <template v-slot:overlay>
      <div class="text-center p-4">
        <b-icon-arrow-clockwise font-scale="3" animation="spin" />
        <p id="cancel-label">Please wait...</p>
      </div>
    </template>
  </b-overlay>
</template>
