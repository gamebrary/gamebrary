<template lang="html">
  <section>
    <h3>Platform page</h3>

    <div
      v-if="hasLists"
      class="setting"
>
      <i class="fas fa-user-check" />
      <h5>{{ $t('settings.ownedLists') }}</h5>

      <toggle-switch
        id="ownedListsOnly"
        v-model="value.ownedListsOnly"
      />
    </div>

    <div class="setting">
      <i class="fas fa-sort-alpha-down" />
      <h5>{{ $t('settings.sortPlatforms') }}</h5>

      <toggle-switch
        id="sortListsAlphabetically"
        v-model="value.sortListsAlphabetically"
      />
    </div>
  </section>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch';
import { mapState } from 'vuex';

export default {
  components: {
    ToggleSwitch,
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    ...mapState(['gameLists']),

    // TODO: use getter instead
    hasLists() {
      return Object.keys(this.gameLists).length > 0;
    },
  },
};
</script>
