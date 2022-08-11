<template lang="html">
  <b-container fluid>
    <portal to="headerTitle">
      Create tag
    </portal>

    <form
      ref="newTagForm"
      @submit.stop.prevent="submit"
    >
      <b-form-row class="mb-3">
        <b-col cols="8" md="9">
          <b-form-input
            maxlength="20"
            :placeholder="$t('tags.form.inputPlaceholder')"
            required
            v-model.trim="tagName"
          />

          <b-form-text v-if="tagName" tag="span">
            {{ $t('tags.form.preview') }}

            <b-badge :style="`background-color: ${hex}; color: ${tagTextColor}`">
              {{ tagName }}
            </b-badge>
          </b-form-text>
        </b-col>

        <b-col cols="4" md="3">
          <b-input-group>
            <b-form-input
              v-model="hex"
              type="color"
              required
            />

            <b-form-input
              v-model="tagTextColor"
              type="color"
              required
            />
          </b-input-group>
        </b-col>
      </b-form-row>

      <b-button
        variant="primary"
        class="d-flex ml-auto"
        :disabled="isDuplicate || saving || !Boolean(tagName)"
        @click="submit"
      >
        <b-spinner small v-if="saving" />
        <span v-else>{{ $t('tags.form.addTag')}}</span>
      </b-button>

      <b-alert
        class="mt-3 mb-0"
        :show="isDuplicate"
        variant="warning"
      >
        {{ $t('tags.form.duplicateMessage', { tagName }) }}
         <strong>{{ tagName }}</strong>
      </b-alert>
    </form>
  </b-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      colorCombinations: [
        ['#0d1137', '#e52165'],
        ['#ffffff', '#000000'],
        ['#101820', '#FEE715'],
        ['#F2AA4C', '#101820'],
        ['#F93822', '#FDD20E'],
      ],
      tagTextColor: '#F4B41A',
      tagName: '',
    }
  },

  mounted() {
      this.setRandomColors();
  },

  computed: {
    ...mapState(['tags', 'platform', 'games']),
    // isDuplicate() {
    //   const { tagName, localTags } = this;
    //
    //   const tagNames = Object.keys(localTags)
    //     .filter(name => name !== tagName)
    //     .map(name => name.toLowerCase());
    //
    //   return tagNames.includes(tagName.toLowerCase());
    // },
  },

  methods: {
    setRandomColors() {
      const { colorCombinations } = this;

      const randomNumber = Math.floor(Math.random() * colorCombinations.length);

      this.tagTextColor = colorCombinations[randomNumber][0];
      this.hex = colorCombinations[randomNumber][1];
    },

  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
</style>
