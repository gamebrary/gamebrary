<template lang="html">
  <div>
    <b-form-group label="Dock position:">
      <b-form-select
        v-model="dockPosition"
        style="max-width: 200px"
        @change="save"
      >
        <b-form-select-option
          v-for="{ name, value } in $options.DOCK_POSITIONS"
          :key="value"
          :value="value"
        >
          {{ name }}
        </b-form-select-option>
      </b-form-select>
    </b-form-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DOCK_POSITIONS } from '@/constants';

export default {
  DOCK_POSITIONS,

  data() {
    return {
      dockPosition: null,
    };
  },

  computed: {
    ...mapState(['settings']),
  },

  mounted() {
    const { settings } = this;

    this.dockPosition = settings.dockPosition || null;
  },

  methods: {
    async save() {
      const { dockPosition, settings } = this;

      const payload = {
        ...settings,
        dockPosition,
      };

      await this.$store.dispatch('SAVE_SETTINGS', payload)
        .catch(() => {
          this.$bvToast.toast('There was an error saving your settings', { variant: 'danger' });
        });
    },
  },
};
</script>
