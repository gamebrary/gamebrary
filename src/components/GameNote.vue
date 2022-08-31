<template lang="html">
  <div class="note mb-3 rounded" role="main">
    <header />

    <div
      class="note-content"
      v-html="formattedNote"
    />
  </div>
</template>

<script>
import { marked } from 'marked';

export default {
  props: {
    note: {
      type: [Object, String],
      default: '',
    },
  },

  computed: {
    formattedNote() {
      const note = this.note?.note || this.note;

      return typeof note === 'object'
        ? marked(note.note)
        : marked(note);
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
  background-image: linear-gradient(90deg, transparent 30px, #ec7063 30px, #ec7063 33px, transparent 33px);
  background-size: 100% 1.2em;
  padding-left: 2.5rem;
  padding-right: 1rem;
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
}

.note-content {
  background-image: linear-gradient(90deg, transparent 30px, #ec7063 30px, #ec7063 33px, transparent 33px), linear-gradient(#85c1e9 .1em, transparent .1em);
  background-size: 100% 1.2em;
  padding-bottom: 1rem;
  flex-grow: 8;
  padding-top: .2rem;
  padding-left: 3rem;
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
