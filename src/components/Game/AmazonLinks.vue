<template lang="html">
  <div>
    <b-button
      v-b-modal="modalId"
      variant="warning"
      class="mb-3"
      v-if="amazonLinks.length"
    >
      <i class="fab fa-amazon fa-fw" aria-hidden />
      Available on Amazon
    </b-button>

    <b-modal
      :header-bg-variant="darkTheme ? 'dark' : null"
      :header-text-variant="darkTheme ? 'white' : null"
      :body-bg-variant="darkTheme ? 'dark' : null"
      :body-text-variant="darkTheme ? 'white' : null"
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
        v-if="link.uid && link.url"
        v-for="link in amazonLinks"
        :key="link.url"
        :href="`https://amazon.com/dp/${link.uid}?tag=gamebrary0e-20`"
        target="_blank"
        class="mr-2 mb-2"
      >
        <b-img
          :src="`http://images.amazon.com/images/P/${link.uid}.01._SCMZZZZZZZ_.jpg`"
          thumbnail
        />
      </a>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    game: Object,
    modalId: {
      type: String,
      default: 'amazon',
    },
  },

  computed: {
    ...mapGetters(['darkTheme']),

    amazonLinks() {
      return this.game && this.game.external_games
        ? this.game.external_games.filter(({ category }) => category === 20)
        : [];
    },
  },
};
</script>
