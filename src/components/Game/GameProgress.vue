<template lang="html">
  <div>
    <strong class="text-muted">Completed: {{ progress }}</strong>

    <b-form-input
      size="lg"
      v-model="progress"
      type="range"
      max="100"
      step="1"
    />

    <b-button
      variant="primary"
      :disabled="saving"
      class="mr-2"
      @click="saveProgress"
    >
      <b-spinner small v-if="saving" />
      <span v-else>{{ $t('global.save') }}</span>
    </b-button>

    <b-button
      :disabled="deleting"
      variant="danger"
      @click="deleteProgress"
    >
      <b-spinner small v-if="deleting" />
      <i v-else class="fas fa-trash fa-fw" aria-hidden />
    </b-button>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
