<template lang="html">
  <div class="note mb-3 rounded" role="main">
    <header>
      <router-link
        v-if="note.gameName"
        :to="{ name: 'game', params: { gameId: note.gameId, gameSlug: note.gameSlug } }"
        class="cursor-pointer"
      >
        {{ note.gameName }}
      </router-link>

      <span v-else>Note:</span>
    </header>

    <div
      class="note-content"
      v-html="formattedNote"
    />
  </div>
</template>

<script>
import { marked } from 'marked';
import { mapGetters } from 'vuex';

export default {
  props: {
    note: Object,
  },

  computed: {
    ...mapGetters(['gameCoverUrl']),

    formattedNote() {
      return marked(this.note?.note || this.note);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.note {
  font-family: 'Gochi Hand', cursive;
  max-width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  background-color: #fdf5ad;
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid #d5cb74;
}

header {
  background-image: linear-gradient(90deg, transparent 79px, #ec7063 79px, #ec7063 81px, transparent 81px);
  background-size: 100% 1.2em;
  padding-left: 5.5rem;
  padding-right: 1rem;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.note-content {
  background-image: linear-gradient(90deg, transparent 79px, #ec7063 79px, #ec7063 81px, transparent 81px), linear-gradient(#85c1e9 .1em, transparent .1em);
  background-size: 100% 1.2em;
  padding-bottom: 1rem;
  flex-grow: 8;
  padding-top: .2rem;
  padding-left: 6rem;
  line-height: 1.3;
}
</style>

<style lang="scss" rel="stylesheet/scss">
.note-content {
  img {
    max-width: calc(100% - 16px);
    border-radius: .25rem;
  }
}
</style>
