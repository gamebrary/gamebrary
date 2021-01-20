<template lang="html">
  <div>
    <b-button
      v-b-modal.amazon
      variant="warning"
      class="mt-2"
      v-if="amazonLinks.length"
    >
      <i class="fab fa-amazon fa-fw" aria-hidden />
      Available on Amazon
    </b-button>

    <b-modal
      id="amazon"
      hide-footer
    >
      <template v-slot:modal-header="{ close }">
        <modal-header
          :title="`Find ${game.name} on Amazon`"
          @close="close"
        />
      </template>

      <p>Support Gamebrary by using these affiliate links to purchase games from Amazon.</p>

      <div class="links">
        <a
          v-if="link.uid && link.url"
          v-for="link in amazonLinks"
          :key="link.url"
          :href="`https://amazon.com/dp/${link.uid}?tag=gamebrary0e-20`"
          target="_blank"
        >
          <b-img
            :src="`http://images.amazon.com/images/P/${link.uid}.01._SCMZZZZZZZ_.jpg`"
            thumbnail
          />
        </a>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    game: Object,
  },

  computed: {
    amazonLinks() {
      return this.game && this.game.external_games
        ? this.game.external_games.filter(({ category }) => category === 20)
        : [];
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}
</style>
