<template lang="html">
  <div>
    <b-button
      v-if="amazonLink"
      variant="warning"
      class="mb-3"
      :href="amazonLink"
      target="_blank"
    >
      <i class="fab fa-amazon fa-fw" aria-hidden />
      Available on Amazon
    </b-button>


    <!-- <b-modal
      :id="modalId"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="`Find ${game.name} on Amazon`"
          @close="close"
        />
      </template>

      <b-alert show variant="success">
        Support Gamebrary by using these affiliate links to purchase games from Amazon.
      </b-alert>

      <a
        v-for="link in amazonLinks"
        :key="link.url"
        :href="`https://amazon.com/dp/${link.uid}`"
        target="_blank"
        class="mr-2 mb-2"
      >
        <b-img
          :src="`http://images.amazon.com/images/P/${link.uid}.01._SCMZZZZZZZ_.jpg`"
          thumbnail
        />
      </a>
    </b-modal> -->
  </div>
</template>

<script>
import { WEBSITE_CATEGORIES } from '@/constants';
import { mapState } from 'vuex';


export default {
  computed: {
    ...mapState(['game']),

    amazonLink() {
      return this.amazonAsins
        ? `https://www.amazon.com/s?k=${this.amazonAsins}?tag=gamebrary0e-20`
        : null;
    },

    amazonAsins() {
      return this.game?.external_games?.filter(({ category, uid }) => uid && category === WEBSITE_CATEGORIES.AMAZON)
        .map(({ uid }) => uid)
        .join('|');
    },
  },
};
</script>
